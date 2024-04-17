const logoutButton = document.getElementById('logoutButton');

logoutButton.addEventListener('click', (e) => {
    e.preventDefault();

    window.localStorage.clear();
    window.location = 'login.html';
});
