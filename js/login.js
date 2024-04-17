const loginButton = document.getElementById('loginButton');
const loginEmailInput = document.getElementById('loginEmailInput');
const loginPasswordInput = document.getElementById('loginPasswordInput');

const baseUrl = 'http://localhost:8080';

loginButton.addEventListener('click', async (e) => {
    e.preventDefault();

    const body = {email: loginEmailInput.value, password: loginPasswordInput.value};
    const options = {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)};
    try {
        const response = await fetch(`${baseUrl}/login`, options);
        const res = await response.json();

        if (res.error) {
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

function showError(err){
    const errorDiv = document.getElementById('validationForm');
    const errorP = document.getElementById('errorMessage');
    switch (err.code) {
        case 400:
            errorP.textContent = "Preencha todos os campos"
            break
        case 401:
            errorP.textContent = "Email ou senha invalidos"
            break
        case 422:
            errorP.textContent = "Usuario duplicado"
            break
    }
    errorDiv.style.visibility = 'visible';
}

//INITIALIZE AOS
AOS.init();

