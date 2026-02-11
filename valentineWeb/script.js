const config = window.VALENTINE_CONFIG;

function validateConfig() {
    const warnings = [];
    if (!config.valentineName) config.valentineName = "My Love";
    const isValidHex = (hex) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    Object.entries(config.colors).forEach(([key, value]) => {
        if (!isValidHex(value)) config.colors[key] = getDefaultColor(key);
    });
}

function getDefaultColor(key) {
    const defaults = {
        backgroundStart: "#ffafbd", backgroundEnd: "#ffc3a0",
        buttonBackground: "#ff6b6b", buttonHover: "#ff8787", textColor: "#ff4757"
    };
    return defaults[key];
}

document.title = config.pageTitle;

window.addEventListener('DOMContentLoaded', () => {
    validateConfig();

    // Set texts
    document.getElementById('valentineTitle').textContent = `${config.valentineName}, my love...`;
    document.getElementById('question1Text').textContent = config.questions.first.text;
    document.getElementById('yesBtn1').textContent = config.questions.first.yesBtn;
    document.getElementById('noBtn1').textContent = config.questions.first.noBtn;
    document.getElementById('secretAnswerBtn').textContent = config.questions.first.secretAnswer;
    document.getElementById('question2Text').textContent = config.questions.second.text;
    document.getElementById('startText').textContent = config.questions.second.startText;
    document.getElementById('nextBtn').textContent = config.questions.second.nextBtn;
    document.getElementById('question3Text').textContent = config.questions.third.text;
    document.getElementById('yesBtn3').textContent = config.questions.third.yesBtn;
    document.getElementById('noBtn3').textContent = config.questions.third.noBtn;

    // Build Question 3 Timetable
    const q3TimetableContainer = document.getElementById('timetableInQuestion');
    if (config.timetable && q3TimetableContainer) {
        let tableHTML = `<table class="valentine-table"><thead><tr><th>Time</th><th>Activity</th></tr></thead><tbody>`;
        config.timetable.forEach(item => {
            tableHTML += `<tr><td class="time-col">${item.time}</td><td class="activity-col">${item.activity}</td></tr>`;
        });
        tableHTML += `</tbody></table>`;
        q3TimetableContainer.innerHTML = tableHTML;
    }

    createFloatingElements();
    setupMusicPlayer();
    setInitialPosition();
});

function createFloatingElements() {
    const container = document.querySelector('.floating-elements');
    config.floatingEmojis.hearts.forEach(heart => createEmoji(heart, 'heart', container));
    config.floatingEmojis.bears.forEach(bear => createEmoji(bear, 'bear', container));
}

function createEmoji(emoji, className, container) {
    const div = document.createElement('div');
    div.className = className;
    div.innerHTML = emoji;
    setRandomPosition(div);
    container.appendChild(div);
}

function setRandomPosition(element) {
    element.style.left = Math.random() * 100 + 'vw';
    element.style.animationDelay = Math.random() * 5 + 's';
    element.style.animationDuration = 10 + Math.random() * 20 + 's';
}

function showNextQuestion(questionNumber) {
    document.querySelectorAll('.question-section').forEach(q => q.classList.add('hidden'));
    document.getElementById(`question${questionNumber}`).classList.remove('hidden');
}

function moveButton(button) {
    const x = Math.random() * (window.innerWidth - button.offsetWidth);
    const y = Math.random() * (window.innerHeight - button.offsetHeight);
    button.style.position = 'fixed';
    button.style.left = x + 'px';
    button.style.top = y + 'px';
}

// Love meter functionality
const loveMeter = document.getElementById('loveMeter');
const loveValue = document.getElementById('loveValue');
const extraLove = document.getElementById('extraLove');

function setInitialPosition() {
    loveMeter.value = 100;
    loveValue.textContent = 100;
    loveMeter.style.width = '100%';
}

loveMeter.addEventListener('input', () => {
    const value = parseInt(loveMeter.value);
    loveValue.textContent = value;
    if (value > 100) {
        extraLove.classList.remove('hidden');
        const extraWidth = ((value - 100) / 9900) * window.innerWidth * 0.8;
        loveMeter.style.width = `calc(100% + ${extraWidth}px)`;
        extraLove.textContent = value >= 5000 ? config.loveMessages.extreme : (value > 1000 ? config.loveMessages.high : config.loveMessages.normal);
        value >= 5000 ? extraLove.classList.add('super-love') : extraLove.classList.remove('super-love');
    } else {
        extraLove.classList.add('hidden');
        loveMeter.style.width = '100%';
    }
});

function celebrate() {
    document.querySelectorAll('.question-section').forEach(q => q.classList.add('hidden'));
    document.getElementById('celebration').classList.remove('hidden');
    document.getElementById('celebrationTitle').textContent = config.celebration.title;
    document.getElementById('celebrationMessage').textContent = config.celebration.message;
    document.getElementById('celebrationEmojis').textContent = config.celebration.emojis;

    const timetableContainer = document.getElementById('timetableDisplay');
    if (config.timetable && timetableContainer) {
        let tableHTML = `<table style="width:100%; margin-top:20px; border-collapse: collapse; background: white; border-radius: 10px; color: var(--text-color);">
            <thead><tr style="border-bottom: 2px solid var(--button-color);"><th style="padding: 10px;">Time</th><th style="padding: 10px;">Activity</th></tr></thead><tbody>`;
        config.timetable.forEach(item => { tableHTML += `<tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px; font-weight: bold;">${item.time}</td><td style="padding: 8px;">${item.activity}</td></tr>`; });
        tableHTML += `</tbody></table><p style="margin-top:10px; font-weight:bold;">Friday, 13/2/2026 📍 KK</p>`;
        timetableContainer.innerHTML = tableHTML;
    }
    createHeartExplosion();
}

function createHeartExplosion() {
    for (let i = 0; i < 50; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = config.floatingEmojis.hearts[Math.floor(Math.random() * config.floatingEmojis.hearts.length)];
        heart.className = 'heart';
        document.querySelector('.floating-elements').appendChild(heart);
        setRandomPosition(heart);
    }
}

function setupMusicPlayer() {
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    if (!config.music.enabled) { document.getElementById('musicControls').style.display = 'none'; return; }
    document.getElementById('musicSource').src = config.music.musicUrl;
    bgMusic.volume = config.music.volume || 0.5;
    bgMusic.load();
    if (config.music.autoplay) bgMusic.play().catch(() => musicToggle.textContent = config.music.startText);
    musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) { bgMusic.play(); musicToggle.textContent = config.music.stopText; }
        else { bgMusic.pause(); musicToggle.textContent = config.music.startText; }
    });
}