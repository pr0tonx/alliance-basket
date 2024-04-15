const signupButton = document.getElementById('signupButton');
const signupNameInput = document.getElementById('signup-name');
const signupEmailInput = document.getElementById('signup-email');
const signupPasswordInput = document.getElementById('signup-password');

const baseUrl = 'http://localhost:8080';

signupButton.addEventListener('click', async (e) => {
    e.preventDefault();

    const body = {name: signupNameInput.value, email: signupEmailInput.value, password: signupPasswordInput.value};
    const options = {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)};

    try {
        const response = await fetch(`${baseUrl}/signup`, options);
        const res = await response.json();

        console.log(res);

        if (res.error) {
            // faz algo pra mostrar pro usuário
            return;
        }

        window.location.href = '../index.html';
    } catch (err) {
        console.log(err);
    }
});


