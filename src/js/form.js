"use strict";

const selectionForm = document.querySelector(".selection-programme__form");
const personalTel = selectionForm.querySelector("[name=tel]"),
    personalEmail = selectionForm.querySelector("[name=email]"),
    catName = selectionForm.querySelector("[name=name]"),
    catWeight = selectionForm.querySelector("[name=weight]");
const required = [personalEmail, catName, catWeight, personalTel];

selectionForm.addEventListener("submit", function (e){
    for(let i = 0; i < 4; i++) {
        if (!required[i].value) {
            e.preventDefault();
            required[i].classList.add("error");
        }
        if(required[i].value) {
            required[i].classList.remove("error");
        }
    }
});
for (let i = 0; i < required.length; i++) {
    required[i].addEventListener("click", function() {
        let current = document.getElementsByClassName("error");
        current[0].classList.remove("error");
    });
}
