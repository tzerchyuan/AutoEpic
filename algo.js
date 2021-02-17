var reserve = function() {

    chrome.storage.sync.get('resort', function(data) {
        // set selection to the right mountain and proceed to check availability
        let selectElement = 'document.querySelector("#PassHolderReservationComponent_Resort_Selection")';
        let command = `${selectElement}.value = Array.from(` + 
                    `${selectElement}.children).filter(x => x.text.toUpperCase() === '${data.resort}')[0].value;` + 
                    `var evt = document.createEvent("HTMLEvents"); evt.initEvent("change", true, true);` +
                    `${selectElement}.dispatchEvent(evt);` + 
                    'document.querySelector("#passHolderReservationsSearchButton").click();';
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.executeScript(
                tabs[0].id,
                {code: command});
        });
    })
}

/*
document.querySelector("#PassHolderReservationComponent_Resort_Selection").value = 
var evt = document.createEvent("HTMLEvents");
evt.initEvent("change", true, true);
selections.dispatchEvent(evt);
document.querySelector("#passHolderReservationsSearchButton").click()
*/