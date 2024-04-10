const navMenu = document.getElementById("nav-menu"),
      navToggle = document.getElementById("nav-toggle"),
      navClose = document.getElementById("nav-close")

// Menu Show
navToggle.addEventListener('click', () => {
    navMenu.classList.add("show-menu")
})

// Menu hidden
navClose.addEventListener('click', () => {
    navMenu.classList.remove("show-menu")
})