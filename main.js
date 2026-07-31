
const page1btn = document.querySelector("#page1btn");
const page2btn = document.querySelector("#page2btn");
const page3btn = document.querySelector("#page3btn");
const page4btn = document.querySelector("#page4btn");

var allpages = document.querySelectorAll(".page");
const detailsBoxes = document.querySelectorAll('details');

// Set up the screen monitoring rules globally
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show'); 
        }
    });
}, {
    threshold: 0.1 
});

// Hide all pages and reset animations for the white boxes 
function hideall(){
    // SAFEGUARD: Stop the game safely if the user switches pages mid-play
    if (typeof stopGame === "function" && typeof isPlaying !== "undefined" && isPlaying) {
        stopGame();
    }

    for(let onepage of allpages){
        onepage.style.display = "none";
    }
    
    // Remove the show class to allow a new calculation for the white box
    detailsBoxes.forEach(box => {
        box.classList.remove('show');
        scrollObserver.unobserve(box);
    });
}

// Show selected page
function show(pgno){
    hideall();
    let onepage = document.querySelector("#page"+pgno);
    if (onepage) {
        onepage.style.display = "block";
        // Start tracking the boxes on the newly opened page again
        const activeBoxes = onepage.querySelectorAll('details');
        activeBoxes.forEach(box => scrollObserver.observe(box));
    }
}

// Event Listeners for Page Navigation (Safeguarded with checks)
if (page1btn) page1btn.addEventListener("click", function() { show(1); });
if (page2btn) page2btn.addEventListener("click", function() { show(2); });
if (page3btn) page3btn.addEventListener("click", function() { show(3); });
if (page4btn) page4btn.addEventListener("click", function() { show(4); });

// To refresh the page using the main title dolphin without clicking refresh 
const mainTitle = document.querySelector("#main-title");
if (mainTitle) {
    mainTitle.addEventListener("click", function(){
        window.location.reload();
    });
}

// Mobile Responsive Hamburger Menu Logic
const hamIcon = document.querySelector("#hamIcon");
const navUl = document.querySelector("nav ul");

if (hamIcon && navUl) {
    hamIcon.addEventListener("click", function(e) {
        e.preventDefault(); // Stops the browser from treating it like a standard link
        navUl.classList.toggle("menuShow");
        
        if (navUl.classList.contains("menuShow")) {
            hamIcon.textContent = "Close Menu";
        } else {
            hamIcon.textContent = "Open Menu";
        }
    });

    //Targets any clickable button or link directly inside the nav menu list
    const menuButtons = navUl.querySelectorAll("button, a");
    menuButtons.forEach(btn => {
        btn.addEventListener("click", function() {
            navUl.classList.remove("menuShow");
            hamIcon.textContent = "Open Menu";
        });
    });
}

// DOLPHIN GAMEE

const arena = document.getElementById('game-arena');
const dolphin = document.getElementById('player-dolphin');
const startStopBtn = document.getElementById('start-stop-btn');
const timerDisplay = document.getElementById('game-timer');

let isPlaying = false;
let gameSeconds = 0;
let timerInterval;
let spawnInterval;
let loopInterval;
let rubbishArray = [];

// Movement tracking variables
let dolphinX = 0; 
const moveSpeed = 7; 
const activeKeys = {};
let isDragging = false;

// 1. Keyboard Controls 
window.addEventListener('keydown', (e) => {
    if (!isPlaying) return;
    const key = e.key.toLowerCase();
    if (['a', 'd', 'arrowleft', 'arrowright'].includes(key)) {
        activeKeys[key] = true;
        e.preventDefault(); 
    }
});

window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (key in activeKeys) {
        activeKeys[key] = false;
    }
});

// Touch Controls for mobile players to drag
if (arena) {
    arena.addEventListener('touchstart', (e) => {
        if (!isPlaying) return;
        isDragging = true;
        handleTouchMove(e);
    }, { passive: false });

    arena.addEventListener('touchmove', (e) => {
        if (!isPlaying || !isDragging) return;
        e.preventDefault(); // Stops the mobile screen from shaking or scrolling down while playing
        handleTouchMove(e);
    }, { passive: false });

    arena.addEventListener('touchend', () => {
        isDragging = false;
    });
}

// Calculates tracking positions for tracking dragging movements safely on mobile viewport scales
function handleTouchMove(e) {
    if (!arena || !dolphin) return;
    if (!e.touches || e.touches.length === 0) return;
    
    const arenaRect = arena.getBoundingClientRect();
    const touch = e.touches[0];
    const dolphinWidth = dolphin.clientWidth;
    
    // Account for absolute window offsets to keep movement accurate
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const arenaLeftPage = arenaRect.left + scrollLeft;
    
    // Pinpoints position relative to the left wall of the game box, centering the finger
    let touchX = touch.pageX - arenaLeftPage - (dolphinWidth / 2);
    
    // Bounds check to stop the dolphin tracking past margins immediately
    if (touchX < 0) touchX = 0;
    if (touchX > arenaRect.width - dolphinWidth) touchX = arenaRect.width - dolphinWidth;
    
    dolphinX = touchX;
    dolphin.style.left = dolphinX + 'px';
}

// Start / Stop Button Toggle
if (startStopBtn) {
    startStopBtn.addEventListener('click', () => {
        if (!isPlaying) {
            startGame();
        } else {
            stopGame();
        }
    });
}

function startGame() {
    isPlaying = true;
    startStopBtn.textContent = "Stop Game";
    gameSeconds = 0;
    timerDisplay.textContent = "Time: " + gameSeconds + "s";
    
    // Reset inputs & clean trash using prototype-safe iteration
    Object.keys(activeKeys).forEach(function(k) {
        activeKeys[k] = false;
    });
    
    isDragging = false;
    rubbishArray.forEach(item => item.remove());
    rubbishArray = [];

    // Center dolphin position perfectly
    if (arena && dolphin) {
        const arenaRect = arena.getBoundingClientRect();
        dolphinX = (arenaRect.width - dolphin.clientWidth) / 2;
        dolphin.style.left = dolphinX + 'px';
    }

    // Start loops
    timerInterval = setInterval(() => {
        gameSeconds++;
        timerDisplay.textContent = "Time: " + gameSeconds + "s";
    }, 1000);

    spawnInterval = setInterval(spawnRubbish, 800);
    loopInterval = setInterval(runGameEngine, 1000 / 60);
}

function stopGame() {
    isPlaying = false;
    if (startStopBtn) startStopBtn.textContent = "Start Game";
    clearInterval(timerInterval);
    clearInterval(spawnInterval);
    clearInterval(loopInterval);
}

function spawnRubbish() {
    if (!arena) return;
    const trashImages = [
        'images/plastic-bottle.png', 
        'images/bag.png', 
        'images/can.png'
    ];
    
    const rubbish = document.createElement('img');
    rubbish.classList.add('rubbish');
    rubbish.src = trashImages[Math.floor(Math.random() * trashImages.length)];
    
    const arenaWidth = arena.clientWidth;
    rubbish.style.left = Math.random() * (arenaWidth - 40) + 'px';
    rubbish.style.top = '-60px'; 
    
    arena.appendChild(rubbish);
    rubbishArray.push(rubbish);
}

function runGameEngine() {
    if (!arena || !dolphin) return;
    const arenaWidth = arena.clientWidth;
    const dolphinWidth = dolphin.clientWidth;

    // Keyboard movement engine updates (Runs if no active mobile finger drags override it)
    if (!isDragging) {
        if (activeKeys.a || activeKeys.arrowleft) dolphinX -= moveSpeed;
        if (activeKeys.d || activeKeys.arrowright) dolphinX += moveSpeed;

        // Arena wall boundaries
        if (dolphinX < 0) dolphinX = 0;
        if (dolphinX > arenaWidth - dolphinWidth) dolphinX = arenaWidth - dolphinWidth;

        dolphin.style.left = dolphinX + 'px';
    }

    // Trash drops & physics hitbox engine
    const dolphinRect = dolphin.getBoundingClientRect();

    for (let i = rubbishArray.length - 1; i >= 0; i--) {
        const item = rubbishArray[i];
        let currentTop = parseFloat(item.style.top) || 0;
        
        currentTop += 4; 
        item.style.top = currentTop + 'px';

        const itemRect = item.getBoundingClientRect();

        // Object overlap checking
        if (
            itemRect.left < dolphinRect.right &&
            itemRect.right > dolphinRect.left &&
            itemRect.bottom > dolphinRect.top &&
            itemRect.top < dolphinRect.bottom
        ) {
            const finalScore = gameSeconds * 10; 
            alert("Game Over! You were hit by rubbish.\nYour Score: " + finalScore + " points.");
            stopGame();
            break;
        }

        // Offscreen trash item garbage collection
        if (currentTop > arena.clientHeight) {
            item.remove();
            rubbishArray.splice(i, 1);
        }
    }
}
// FOR THE QUIZ ONLY
const btnSubmit = document.querySelector("#btnSubmit");  
const btnRetry = document.querySelector("#btnRetry"); 
const scorebox = document.querySelector("#scorebox");
var score = 0;

// Hide retry button initially if it exists
if (btnRetry) {
    btnRetry.style.display = "none"; 
}

// Correct dolphin answers matching your HTML inputs
const corrAnsArray = [
    "Over 20 years",
    "The lower jaw",
    "Common Bottlenose Dolphin",
    "Unfused neck vertebrae",
    "Underwater sound pollution"
];

function CheckAns() {    
    score = 0; 
    
    for (let i = 0; i < corrAnsArray.length; i++) {
        const qnNo = i + 1;
        const checkedRadio = document.querySelector("input[name='q" + qnNo + "']:checked");
        const allRadiosInQn = document.querySelectorAll("input[name='q" + qnNo + "']");
        
        // Disable choices
        allRadiosInQn.forEach(radio => radio.disabled = true);
        
        if (checkedRadio && checkedRadio.value === corrAnsArray[i]) {
            score++;
        }
    }
    
    if (scorebox) {
        scorebox.innerHTML = "Score: " + score;
    }
    
    // Toggle button visibility safely
    if (btnSubmit) btnSubmit.style.display = "none";
    if (btnRetry) btnRetry.style.display = "inline-block";
}

// Reset everything to the original starting state
function ResetQuiz() {
    score = 0;
    if (scorebox) {
        scorebox.innerHTML = "Score: 0";
    }
    
    // Uncheck and re-enable all radio buttons
    const allRadios = document.querySelectorAll("input[type='radio']");
    allRadios.forEach(radio => {
        radio.checked = false;
        radio.disabled = false;
    });

    // Toggle button visibilities back to normal
    if (btnSubmit) btnSubmit.style.display = "inline-block";
    if (btnRetry) btnRetry.style.display = "none";
}

// Attach quiz event listeners safely
if (btnSubmit) btnSubmit.addEventListener("click", CheckAns);
if (btnRetry) btnRetry.addEventListener("click", ResetQuiz);


// THIS IS FOR THE AUDIO FOR THE DOLPHIN SOUND

// FIRST AUDIO: DOLPHIN WHISTLE
const dolphinBtn = document.getElementById("dolphinPlayBtn");
const dolphinAudio = new Audio("audio/Dol.mp3");
var listenCount = 0;

function playDolphinWhistle() {
    dolphinAudio.currentTime = 0; 
    dolphinAudio.play().catch(err => console.log("Audio playback delayed or blocked:", err)); 
    listenCount++;
    console.log("Dolphin whistle played " + listenCount + " times.");
}

if (dolphinBtn) {
    dolphinBtn.addEventListener("click", playDolphinWhistle);
}


// SECOND AUDIO: BURST-PULSE SOUNDS
const burstPulseBtn = document.getElementById("burstPulsePlayBtn");
const burstPulseAudio = new Audio("audio/Burst.mp3");
var burstListenCount = 0;

function playBurstPulse() {
    burstPulseAudio.currentTime = 0; 
    burstPulseAudio.play().catch(err => console.log("Audio playback delayed or blocked:", err)); 
    burstListenCount++;
    console.log("Burst-pulse sound played " + burstListenCount + " times.");
}

if (burstPulseBtn) {
    burstPulseBtn.addEventListener("click", playBurstPulse);
}


/* INITIALIZATION RUNNERS (CALLED AT THE ABSOLUTE BOTTOM)*/
// Hide everything initially
hideall();

// Open page 1 by default on load
show(1);
