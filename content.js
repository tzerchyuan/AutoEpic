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
        console.log(pickedResort, pickedDate, pickedRider);
        let resortPicker = document.querySelector("#PassHolderReservationComponent_Resort_Selection");
        let datePicker = document.getElementsByClassName("passholder_reservations__booking__day_selector")[0];
        let riderPicker = document.getElementsByClassName("passholder_reservations__assign_passholder_modal")[0];
        let termsChecker = document.querySelector('input[name=accept-policy]');
        // there are several buttons that are indistinguishable from the confirm button
        let confirmClicker = document.getElementsByClassName('passholder_reservations__completion__cta').children[0];

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
        if (datePicker != null && riderPicker == null) {
            // get the date and check the availability from seeing whether it is disabled
            chrome.storage.sync.get('date', function(data) {
                console.log(data.date);
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

        if (riderPicker != null && termsChecker == null) {

        }
        
        if (termsChecker != null && confirmClicker != null) {
            termsChecker.checked = true;
            confirmClicker.click();
        }

        await timer(3000);
    }
};

loop();