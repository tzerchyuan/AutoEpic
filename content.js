console.log('contentscript running');
// Returns a Promise that resolves after "ms" Milliseconds
const timer = ms => new Promise(res => setTimeout(res, ms))

var signedIn = false;
var pickedResort = false;
var pickedDate = false;
var pickedRider = false;
var reserved = false;

async function loop() {
    while (true) {
        // Here are the cases to short circuit
        var alreadySelected = Array.from(document.querySelectorAll('span'))
                                .find(x => x.textContent.toUpperCase().includes('Pass holder has already reserved this date.'.toUpperCase()));
        if (alreadySelected !=  null) {
            console.log('Rider already reserved the date. Aborting...');
            chrome.storage.sync.clear();
            break; 
        }

        // Proceeding with reserving
        chrome.storage.sync.get('reserve', function(data) {
            console.log('in reserve callback');
            if (data.reserve) {
                let resortPicker = document.querySelector("#PassHolderReservationComponent_Resort_Selection");
                let datePicker = document.getElementsByClassName("passholder_reservations__booking__day_selector")[0];
                let riderPicker = document.getElementsByClassName("passholder_reservations__assign_passholder_modal")[0];
                let termsChecker = document.querySelector('input[name=accept-policy]');
                // there are several buttons that are indistinguishable from the confirm button
                let confirmClicker = document.getElementsByClassName('passholder_reservations__completion__cta')[0]?.children[0];
                // reservation confirmation is in this div
                let confirmationDiv = document.querySelector('.reservation_confirmation');

                if (resortPicker != null && datePicker == null) {
                    chrome.storage.sync.get('resort', function(data) {
                        if (data.resort != null) {
                            resortPicker.value = Array.from(resortPicker.children).filter(x => x.textContent.toUpperCase() === data.resort.toUpperCase())[0].value;
                            let evt = document.createEvent("HTMLEvents");
                            evt.initEvent("change", true, true);
                            resortPicker.dispatchEvent(evt);
                            console.log('checking availability');
                            document.querySelector("#passHolderReservationsSearchButton").click();
                        }
                    })
                }
                else if (datePicker != null && riderPicker == null && termsChecker == null) {
                    // get the date and check the availability from seeing whether it is disabled
                    chrome.storage.sync.get('date', function(data) {
                        console.log(`Selecting date (${data.date})...`)
                        // date is in format yyyy-MM-dd
                        let month = data.date.substring(5, 7);
                        // TODO: support other months
                        let day = data.date.substring(8, 10);
                        if (day[0] === "0") {
                            day = day[1];
                        }
                        var button = Array.from(document.querySelectorAll('button')).find(el => el.textContent === `${day}`);
                        console.log(button);
                        if (Array.from(button.classList).filter(x => x.includes('disabled')).length > 0) {
                            // refresh the page to start again
                            location.reload();
                        }
                        else {
                            // select that date
                            button.click();
                        }
                    });
                }
                else if (riderPicker != null && termsChecker == null) {
                    chrome.storage.sync.get('name', function(data) {
                        console.log(`Selecting rider (${data.name})...`);
                        Array.from(document.querySelectorAll('span')).filter(
                            element => element.textContent.toUpperCase().includes(`${data.name.toUpperCase()}`))
                            .find(element => element.children.length == 0)
                            .click();
                        // click on assign pass holder

                        Array.from(document.querySelectorAll('button')).find(
                            element => element.textContent.toUpperCase().includes('ASSIGN PASS HOLDERS')).click();
                    })
                }
                else if (termsChecker != null && confirmClicker != null) {
                    console.log(`Signing terms and conditions and reserving...`);
                    termsChecker.click();
                    confirmClicker.click();
                }
                else if (confirmationDiv != null) {
                    // reservation successful
                    console.log('Reservation successful.');
                    chrome.storage.sync.clear();
                }
                else {
                    // we need to reload since reservation is not successful.
                    location.reload();
                }
            }
            else {
                console.log('Reserve is not set to true. Open the extension and provide information.');
            }
        })

        console.log('watiting 3secs...')
        await timer(3000);
    }
};

window.addEventListener('load', loop, false);