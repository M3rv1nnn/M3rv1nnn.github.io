// target all elements to save to constants

const page1btn = document.querySelector("#page1btn");
const page2btn = document.querySelector("#page2btn");
const page3btn = document.querySelector("#page3btn");

var allpages = document.querySelectorAll(".page");

// hide all pages

function hideall(){

    for(let onepage of allpages){
        onepage.style.display = "none";
    }

}

// show selected page

function show(pgno){

    hideall();

    let onepage = document.querySelector("#page"+pgno);

    onepage.style.display = "block";

}

// Event Listeners

page1btn.addEventListener("click", function(){

    show(1);

});

page2btn.addEventListener("click", function(){

    show(2);

});

page3btn.addEventListener("click", function(){

    show(3);

});

// hide everything first

hideall();

// show page 1 by default

show(1);

// ------------------------
// Responsive Menu
// ------------------------

const hamBtn = document.querySelector("#hamIcon");

const menuItemsList = document.querySelector("nav ul");

hamBtn.addEventListener("click", toggleMenus);

function toggleMenus(){

    menuItemsList.classList.toggle("menuShow");

    if(menuItemsList.classList.contains("menuShow")){

        hamBtn.innerHTML = "Close Menu";

    }
    else{

        hamBtn.innerHTML = "Open Menu";

    }

}