const range = document.querySelector("#slider"),
    imageCatbefore = document.querySelector(".cat-before"),
    imageCatafter = document.querySelector(".cat-after");

range.onchange = function() {
    if(range.value == 0) {
        imageCatbefore.classList.remove("hidden");
        imageCatafter.classList.add("hidden");
        catDemo.classList.remove("before-after");
    }
    else if (range.value == 2){
        imageCatafter.classList.remove("hidden");
        imageCatbefore.classList.add("hidden");
        catDemo.classList.remove("before-after");
    }
    else {
        imageCatafter.classList.remove("hidden");
        imageCatbefore.classList.remove("hidden");
        catDemo.classList.add("before-after");
    }
}