console.log('logging in');

// TODO: log in to the account and navigate to the reservations page

window.addEventListener("load", login, false);

function login(evt) {
    console.log("Logging in, please make sure to use autofill for username and password.");
    document.querySelector('button[data-component-element=bdySignIn_Form]').click()
}


// new window span The system cannot process your request. We apologize for any inconvenience.