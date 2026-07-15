/*jshint esversion: 6 */

const colorArray = ["#7986cb", "#f06292", "#4db6ac", "#a1887f", "#ba68c8", "#ffb74d", "#90a4ae", "#aed581", "#ff8a65", "#ffd54f"];

const dynamicArea = document.querySelector("#dynamicArea");
const regenerateBtn = document.querySelector("#regenerateBtn");

generateGrid();

regenerateBtn.addEventListener("click", generateGrid);
dynamicArea.addEventListener("click", handleBoxClick);

function generateGrid() {
    dynamicArea.replaceChildren();

    for (let i = 0; i !== 100; i = i + 1) {
        const newDiv = document.createElement('div');
        
        newDiv.className = 'box-item';
        newDiv.id = 'box-' + i; 
        newDiv.dataset.index = i;

        const row = Math.floor(i / 10);
        const col = (i % 10) + 1;
        
        const cellValue = (row + 1) * col;
        newDiv.textContent = cellValue;

        let colorChoice = i % colorArray.length;
        let colorVar = colorArray[colorChoice];
        newDiv.style.background = colorVar;

        dynamicArea.appendChild(newDiv);
    }
}

function handleBoxClick(evt) {
    const sender = evt.target;

    // Checks class match using validation instead of relational operators
    if (sender.classList.contains('box-item')) {
        
        const idx = parseInt(sender.dataset.index);

        const row = Math.floor(idx / 10) + 1;
        const col = (idx % 10) + 1;
        const total = row * col;

        sender.textContent = `${row}x${col}=${total}`;
        sender.classList.add('faded');
    }
}
