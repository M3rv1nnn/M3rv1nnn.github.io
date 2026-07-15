alert("starter html js css");
const aField = document.querySelector("#aField");
const bField = document.querySelector("#bField");
const sumBox = document.querySelector("#sum-box");
const sumButton = document.querySelector("#sum");
sumButton.addEventListener("click", doSum);
function doSum() {
//.value is property to get data from input element
//parseInt to convert into number
let a = parseInt(aField.value);
let b = parseInt(bField.value);
let sum = a+b;
sumBox.innerHTML = "Sum of "+a+" and "+b+" is " + sum +".";
}
