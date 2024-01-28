import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(supabaseUrl, supabaseKey);

const apiEndpoint = "/api/v1/auth";

function loginDisplayMesg(msg, status) {
    let loginMsg = document.getElementById("login-message");

    setTimeout(() => {
        loginMsg.classList.remove(status);
        loginMsg.style.display = "none";
        loginMsg.innerHTML = "";
    }, 3000);
    loginMsg.classList.add(status);
    loginMsg.style.display = "block";
    loginMsg.innerHTML = `<p>${msg}</p>`;
}

async function sendLoginRequest(loginDetails) {
    enableLoader();
    const { data, error } = await supabase.auth.signInWithPassword(
        loginDetails
    );
    disableLoader();

    console.log(data);
    console.log("error " + error);

    if (error !== null) {
        loginDisplayMesg(error, "failure");
    } else {
        // localStorage.setItem('user', data["token"]);
        // window.location.replace("/admin.html");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let emailInput = document.getElementById("email-input");
    let passwordInput = document.getElementById("password-input");
    let loginBtn = document.getElementById("login-submit");

    loginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        let email = emailInput.value;
        let password = passwordInput.value;
        let validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        if (email.trim().length !== 0
            && password.trim().length !== 0
            && email.match(validEmailRegex)) {
                const login = {
                    email: email,
                    password: password
                };
                sendLoginRequest(login);
        } else {
            let msg = "Please make sure you have entered a valid email and password.";
            loginDisplayMesg(msg, "failure");
        }
        // disableLoader();
    })
});