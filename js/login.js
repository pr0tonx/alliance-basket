const loginButton = document.getElementById('loginButton');
const loginEmailInput = document.getElementById('loginEmailInput');
const loginPasswordInput = document.getElementById('loginPasswordInput');

const baseUrl = 'http://localhost:8080';


loginButton.addEventListener('click', async (e) => {
    e.preventDefault();

    const body = {name: loginEmailInput.value, password: loginPasswordInput.value};
    const options = {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)};

    try {
        const res = (await fetch(`${baseUrl}/login`, options)).json();

        if (res.error) {
            // faz algo pra mostrar pro usuário
        }

        console.log(res);
    } catch (err) {
        console.log(err);
    }
});

