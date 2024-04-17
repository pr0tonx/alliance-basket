const navMenu = document.getElementById("nav-menu"),
            navToggle = document.getElementById("nav-toggle"),
            navClose = document.getElementById("nav-close");

    // Remova a classe 'show-menu' ao carregar a página
    navMenu.classList.remove("show-menu");

    // Menu Show
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle("show-menu");
    });

    // Menu hidden
    navClose.addEventListener('click', () => {
        navMenu.classList.remove("show-menu");
    });


    function Menuclicado() {
        const clicado = document.querySelector('.dropdown-menu');
        clicado.classList.toggle('ativado')
    }

//Initializate AOS
document.addEventListener('DOMContentLoaded', function() {
    AOS.init();
});