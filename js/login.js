const loginButton = document.getElementById('loginButton');
const loginEmailInput = document.getElementById('loginEmailInput');
const loginPasswordInput = document.getElementById('loginPasswordInput');

const baseUrl = 'http://localhost:8080';

loginButton.addEventListener('click', async (e) => {
    e.preventDefault();

    validateLoginFields()

    const body = {email: loginEmailInput.value, password: loginPasswordInput.value};
    const options = {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)};
    try {
        const response = await fetch(`${baseUrl}/login`, options);
        const res = await response.json();

        if (res.error) {
            console.log(res);
            showErrors(res);

            
            return;
        }

        window.localStorage.setItem('id', res.id);
        window.localStorage.setItem('email', res.email);
        window.localStorage.setItem('token', res.token);

        window.location.href = '../index.html';
    } catch (err) {
        console.log(err);
    }
});


function showErrors () {
    // if (res.code == 401) {
    //     showI
    // }
}

function validateLoginFields () {

}
