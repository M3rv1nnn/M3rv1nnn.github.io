alert("starter html js css");
var min=0, max=100, currGuess=-100, counter=0;
var ans=Math.round(Math.random()*(max-min)+min);
console.log("Ans:"+ans);
const btnGuess=document.querySelector("#btnGuess");
const guessField=document.querySelector("#guessField");
const smallerlbl=document.querySelector("#smaller");
const biggerlbl=document.querySelector("#bigger");
const commentsBox=document.querySelector("#commentsBox");
btnGuess.addEventListener("click",GuessFn);
function GuessFn(){
currGuess=parseInt(guessField.value);
console.log("Curr Guess:"+currGuess);
let comments="";
if(currGuess==ans){
comments="CORRECT!";
}
if(currGuess>ans){
//replace the right number with current guess
biggerlbl.innerHTML=currGuess;
comments="too Big!";
}
if(currGuess<ans){
//replace the left number with current guess
smallerlbl.innerHTML=currGuess;
comments="too Small!";
}
guessField.value="";
counter++;
//commentsBox.innerHTML="Your guess: "+currGuess+" is "+comments+”; Tries:"+counter;
//use JS Template Strings literals (backticks)
commentsBox.innerHTML=`Your guess: ${currGuess} is ${comments} Tries:${counter}`;
}