let links = [];
let currentIndex = 0;
let intervalId;

function updateSwitchTimeLabel() {
    const switchTime = document.getElementById("switchTime").value;
    const minutes = (switchTime / 60).toFixed(2);
    document.getElementById("switchTimeLabel").innerText = `${switchTime} секунд (${minutes} минуты)`;
}

document.getElementById("startButton").addEventListener("click", () => {
    const linksInput = document.getElementById("videoLinks").value.trim();
    if (!linksInput) {
        alert("Пожалуйста, введите хотя бы одну ссылку на видео.");
        return;
    }

    const newLinks = linksInput.split("\n").map(link => link.trim()).filter(link => link);
    if (newLinks.length === 0) {
        alert("Нет валидных ссылок для воспроизведения.");
        return;
    }

    if (JSON.stringify(newLinks) !== JSON.stringify(links)) {
        links = newLinks;
    }

    currentIndex = 0;
    playCurrentVideo();
    const switchTime = parseInt(document.getElementById("switchTime").value, 10) * 1000;

    clearInterval(intervalId);
    intervalId = setInterval(() => {
        nextVideo();
    }, switchTime);
});

document.getElementById("nextButton").addEventListener("click", () => {
    nextVideo();
});

function playCurrentVideo() {
    const videoPlayer = document.getElementById("videoPlayer");

    videoPlayer.src = links[currentIndex];
    videoPlayer.load();
    videoPlayer.addEventListener("loadedmetadata", () => {
        const randomStartTime = Math.floor(Math.random() * videoPlayer.duration); // Рандомное время в пределах длины видео
        videoPlayer.currentTime = randomStartTime;
        videoPlayer.play().catch(() => {
            alert("Не удалось воспроизвести видео: " + links[currentIndex]);
        });
    }, { once: true });
}

function nextVideo() {
    if (links.length === 0) {
        document.getElementById("statusMessage").innerText = "Список пуст. Введите ссылки.";
        return;
    }

    currentIndex = (currentIndex + 1) % links.length;
    playCurrentVideo();
}