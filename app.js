/*
=================================
Theme Synchronization
=================================
*/

const themeToggle = document.getElementById("themeToggle");

function updateThemeButton() {
    if (!themeToggle) return;

    themeToggle.textContent =
        document.body.classList.contains("dark")
            ? "☀️ Light"
            : "🌙 Dark";
}

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark");
}

updateThemeButton();

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");

        localStorage.setItem(
            "theme",
            document.body.classList.contains("dark")
                ? "dark"
                : "light"
        );

        updateThemeButton();
    });
}

/*
=================================
Letterboard Generation
=================================
*/

const board = document.getElementById("letterboard");

if (board) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    [...alphabet].forEach(letter => {
        const btn = document.createElement("button");

        btn.className = "letter";
        btn.textContent = letter;

        btn.onclick = () => addCharacter(letter);

        board.appendChild(btn);
    });
}

/*
=================================
Text Controls
=================================
*/

function addCharacter(char) {
    const box = document.getElementById("message");

    if (!box) return;

    box.value += char;
}

function backspaceText() {
    const box = document.getElementById("message");

    if (!box) return;

    box.value = box.value.slice(0, -1);
}

function clearText() {
    const box = document.getElementById("message");

    if (!box) return;

    box.value = "";
}

function speakText() {
    const box = document.getElementById("message");

    if (!box) return;

    let text = box.value.trim();

    if (!text) return;

    // AI-assisted corrections
    text = text.replace(/\bteh\b/gi, "the");
    text = text.replace(/\bwaer\b/gi, "water");
    text = text.replace(/\bhep\b/gi, "help");

    const speech = new SpeechSynthesisUtterance(text);

    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

    speechSynthesis.cancel();
    speechSynthesis.speak(speech);
}