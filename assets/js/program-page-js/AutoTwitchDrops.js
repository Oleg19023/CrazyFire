const streamList = document.getElementById("streams");
const intervalSlider = document.getElementById("intervalSlider");
const intervalValue = document.getElementById("intervalValue");
const intervalHours = document.getElementById("intervalHours");
const streamUrl = document.getElementById("streamUrl");
const addStreamButton = document.getElementById("addStream");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");

let streams = [];
let currentIndex = 0;
let currentWindow = null;
let intervalId = null;

// Функция обновления текста интервала
intervalSlider.addEventListener("input", () => {
    const minutes = parseInt(intervalSlider.value, 10);
    const hours = (minutes / 60).toFixed(2); // Преобразование в часы с двумя знаками после запятой

    intervalValue.textContent = `${minutes} минут`;
    intervalHours.textContent = `${hours} час${hours == 1 ? '' : (hours < 5 ? 'а' : 'ов')}`;
});

// Добавление стрима в список
addStreamButton.addEventListener("click", () => {
    const url = streamUrl.value.trim();
    if (url && url.startsWith("https://www.twitch.tv/")) {
        streams.push(url);

        const li = document.createElement("li");
        li.textContent = url;
        streamList.appendChild(li);

        streamUrl.value = "";
    } else {
        alert("Введите корректную ссылку на Twitch!");
    }
});

// Функция для открытия следующего стрима
function openNextStream() {
    // Закрываем предыдущую вкладку, если она открыта
    if (currentWindow && !currentWindow.closed) {
        currentWindow.close();
    }

    if (streams.length === 0) {
        alert("Список стримов пуст! Добавьте хотя бы одну ссылку.");
        stopAutomation();
        return;
    }

    // Открываем новый стрим
    currentWindow = window.open(streams[currentIndex], "_blank");

    // Переходим к следующей ссылке или сбрасываем индекс
    currentIndex = (currentIndex + 1) % streams.length;
}

// Запуск автоматизации
startButton.addEventListener("click", () => {
    if (streams.length === 0) {
        alert("Список стримов пуст! Добавьте хотя бы одну ссылку.");
        return;
    }

    const interval = intervalSlider.value * 60 * 1000; // Преобразуем минуты в миллисекунды
    intervalId = setInterval(openNextStream, interval);
    openNextStream();

    startButton.disabled = true;
    stopButton.disabled = false;
});

// Остановка автоматизации
stopButton.addEventListener("click", () => {
    stopAutomation();
});

function stopAutomation() {
    clearInterval(intervalId);
    intervalId = null;

    if (currentWindow && !currentWindow.closed) {
        currentWindow.close();
        currentWindow = null;
    }

    startButton.disabled = false;
    stopButton.disabled = true;
}