document.getElementById("theme-toggle").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    
    // Change icon based on mode
    let themeIcon = document.getElementById("theme-icon");
    let workIcon = document.getElementById("work_icon");

    if (document.body.classList.contains("dark-mode")) {
        themeIcon.src = "images/icons/dark-mode.png"; // Switch to light mode icon
        workIcon.src = "images/icons/work-icon-dark.png";
    } else {
        themeIcon.src = "images/icons/light-mode.png"; // Switch to dark mode icon
        workIcon.src = "images/icons/work-icon-light.png";
    }
});


let highestZIndex = 1; // Track the highest z-index

function bringToFront(windowId) {
    const windowElement = document.getElementById(windowId);
    highestZIndex++; // Increase z-index count
    windowElement.style.zIndex = highestZIndex; // Set the highest z-index
}

// Attach click event to bring windows forward when selected
document.querySelectorAll(".window").forEach((win) => {
    win.addEventListener("mousedown", () => bringToFront(win.id));
});

// Open a window and add to taskbar if not already there
function openWindow(id) {
    const win = document.getElementById(id);
    win.style.display = "block";
    

    let taskbar = document.getElementById("taskbar-icons");
    if (!document.getElementById("taskbar-" + id)) {
        let taskIcon = document.createElement("div");
        taskIcon.id = "taskbar-" + id;
        taskIcon.className = "taskbar-item";
        taskIcon.innerText = win.querySelector('.title-bar span').innerText;
        taskIcon.onclick = () => toggleWindow(id);
        taskbar.appendChild(taskIcon);
    }
    bringToFront(id);
}

// Minimize window (hide but keep in taskbar)
function minimizeWindow(id) {
    let win = document.getElementById(id);
    win.style.display = "none";
}

// Toggle window from taskbar (restore or minimize)
function toggleWindow(id) {
    let win = document.getElementById(id);
    win.style.display = (win.style.display === "none") ? "block" : "none";
    bringToFront(id);
}

// Close window and remove from taskbar
function closeWindow(id) {
    let win = document.getElementById(id);
    win.style.display = "none";

    let taskIcon = document.getElementById("taskbar-" + id);
    if (taskIcon) taskIcon.remove();
}

let currentImageIndex = 0;
let images = [];

// Function to open full-screen viewer
function openFullScreen(img) {
    
    images = Array.from(document.querySelectorAll(".photo")); // Get all images
    currentImageIndex = images.indexOf(img); // Find the clicked image index

    document.getElementById("fullscreen-img").src = img.src;
    document.getElementById("fullscreen-view").style.display = "flex";
}

// Function to close full-screen
function closeFullScreen() {
    document.getElementById("fullscreen-view").style.display = "none";
}

// Function to navigate images
function changeImage(direction) {
    currentImageIndex += direction;

    // Loop to first/last image
    if (currentImageIndex < 0) {
        currentImageIndex = images.length - 1; // Go to last image
    } else if (currentImageIndex >= images.length) {
        currentImageIndex = 0; // Go to first image
    }

    document.getElementById("fullscreen-img").src = images[currentImageIndex].src;
}

// Listen for keyboard events
document.addEventListener("keydown", function (event) {
    if (document.getElementById("fullscreen-view").style.display === "flex") {
        if (event.key === "ArrowRight") {
            changeImage(1); // Next image
        } else if (event.key === "ArrowLeft") {
            changeImage(-1); // Previous image
        } else if (event.key === "Escape") {
            closeFullScreen(); // Close on Esc
        }
    }
});


// Toggle Start Menu
function toggleStartMenu() {
    let menu = document.getElementById("start-menu");
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

// Opened window drag functionality
document.querySelectorAll('.window').forEach(win => {
    let titleBar = win.querySelector('.title-bar');
    titleBar.addEventListener('mousedown', (e) => {
        let shiftX = e.clientX - win.getBoundingClientRect().left;
        let shiftY = e.clientY - win.getBoundingClientRect().top;

        function moveAt(x, y) {
            win.style.left = x - shiftX + 'px';
            win.style.top = y - shiftY + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.clientX, event.clientY);
        }

        document.addEventListener('mousemove', onMouseMove);

        titleBar.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', onMouseMove);
        }, { once: true });

    });
});

//Lock screen
function unlockScreen() {
    document.getElementById("wrong-password").style.display = "none";
    
    let passwordInput = document.getElementById("lock-password").value;
    let correctPassword = "1234"; // Set your desired password

    if (passwordInput === correctPassword) {
        document.getElementById("lock-password").value = "";
        document.getElementById("lock-screen").style.display = "none";
    } else {
        document.getElementById("wrong-password").style.display = "block";
    }
}

// Function to show the lock screen
function lockScreen() {
    document.getElementById("lock-screen").style.display = "flex";
}

// Add event listener to the Sleep button
document.getElementById("sleep-button").addEventListener("click", lockScreen);


// Unlock on "Enter" key press
document.getElementById("lock-password").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        unlockScreen();
    }
});

//Timer to sleep
let timeout;
function resetTimer() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        document.getElementById("lock-screen").style.display = "flex";
    }, 30000); // 30 seconds
}

// Reset inactivity timer on keypress or mouse movement
document.addEventListener("mousemove", resetTimer);
document.addEventListener("keypress", resetTimer);

resetTimer(); // Start timer when the page loads
