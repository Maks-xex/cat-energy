const mainMenu = document.querySelector(".main-nav");
const toggleMenu = mainMenu.querySelector(".main-nav__toggle");
const catDemo = document.querySelector(".cat-demo");

toggleMenu.addEventListener("click",function (e) {
    e.preventDefault();
    if (mainMenu.classList.contains("main-nav--closed")){
        mainMenu.classList.remove("main-nav--closed");
        mainMenu.classList.add("main-nav--open");
    }
    else {
        mainMenu.classList.remove("main-nav--open");
        mainMenu.classList.add("main-nav--closed");
    }
});