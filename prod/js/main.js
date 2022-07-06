"use strict";

window.onload = function(){
    let menuIcon = document.querySelectorAll('.icon-menu');
    let menu = document.querySelector('.right-menu-container')

    menuIcon.forEach(el => {
        el.addEventListener("click", () => {
            el.classList.toggle('close')

            menu.classList.toggle('show')
        })
    })
}

