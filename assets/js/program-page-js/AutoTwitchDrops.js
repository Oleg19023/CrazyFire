document.addEventListener('DOMContentLoaded', () => {
    // --- Элементы DOM ---
    const streamListElement = document.getElementById("streamList");
    const streamCountElement = document.getElementById("streamCount");
    const streamUrlInput = document.getElementById("streamUrlInput");
    const addStreamButton = document.getElementById("addStreamButton");
    
    const intervalSlider = document.getElementById("intervalSlider");
    const intervalValueElement = document.getElementById("intervalValue");
    
    const statusLight = document.getElementById("statusLight");
    const statusText = document.getElementById("statusText");
    const nextStreamInfo = document.getElementById("nextStreamInfo");
    
    const startButton = document.getElementById("startButton");
    const stopButton = document.getElementById("stopButton");

    // --- Переменные состояния ---
    let streams = [];
    let currentIndex = 0;
    let currentWindow = null;
    let intervalId = null;
    let countdownIntervalId = null;

    // --- Функции ---
    
    // Загрузка стримов из localStorage
    function loadStreams() {
        const savedStreams = localStorage.getItem('twitchFarmerStreams');
        if (savedStreams) {
            streams = JSON.parse(savedStreams);
            renderStreamList();
        }
    }

    // Сохранение стримов в localStorage
    function saveStreams() {
        localStorage.setItem('twitchFarmerStreams', JSON.stringify(streams));
    }

    // Отрисовка списка стримов
    function renderStreamList() {
        streamListElement.innerHTML = '';
        streams.forEach((url, index) => {
            const li = document.createElement("li");
            li.textContent = url;
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-stream-btn';
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteBtn.title = 'Удалить стрим';
            deleteBtn.onclick = () => removeStream(index);
            li.appendChild(deleteBtn);
            streamListElement.appendChild(li);
        });
        streamCountElement.textContent = streams.length;
    }
    
    // Добавление стрима
    function addStream() {
        const url = streamUrlInput.value.trim();
        if (url && url.startsWith("https://www.twitch.tv/")) {
            if (!streams.includes(url)) {
                streams.push(url);
                saveStreams();
                renderStreamList();
                streamUrlInput.value = "";
            } else {
                alert("Этот стрим уже есть в списке.");
            }
        } else {
            alert("Введите корректную ссылку на Twitch (https://www.twitch.tv/...)");
        }
    }

    // Удаление стрима
    function removeStream(index) {
        streams.splice(index, 1);
        saveStreams();
        renderStreamList();
    }

    // Обновление текста интервала
    function updateIntervalText() {
        const minutes = parseInt(intervalSlider.value, 10);
        intervalValueElement.textContent = `${minutes} мин`;
    }

    // Обновление статуса
    function updateStatus(running = false, timeLeft) {
        if (running) {
            statusLight.className = 'status-light-on';
            statusText.textContent = 'В процессе';
            if (streams.length > 0) {
                const nextIndex = (currentIndex + 1) % streams.length;
                nextStreamInfo.textContent = `Следующий: ${streams[nextIndex]}. Осталось: ${timeLeft}с`;
            }
        } else {
            statusLight.className = 'status-light-off';
            statusText.textContent = 'Остановлено';
            nextStreamInfo.textContent = '';
        }
    }

    // Запуск автоматизации
    function startAutomation() {
        if (streams.length === 0) {
            alert("Список стримов пуст! Добавьте хотя бы одну ссылку.");
            return;
        }

        const intervalMinutes = parseInt(intervalSlider.value, 10);
        const intervalMs = intervalMinutes * 60 * 1000;
        
        startButton.disabled = true;
        stopButton.disabled = false;
        
        function openNextStream() {
            if (currentWindow && !currentWindow.closed) {
                currentWindow.close();
            }
            if (streams.length === 0) {
                stopAutomation();
                return;
            }
            currentIndex = currentIndex % streams.length; // На случай удаления стримов
            currentWindow = window.open(streams[currentIndex], "_blank");
            startCountdown(intervalMinutes * 60);
            currentIndex = (currentIndex + 1) % streams.length;
        }

        openNextStream(); // Открываем первый сразу
        intervalId = setInterval(openNextStream, intervalMs);
    }
    
    // Остановка автоматизации
    function stopAutomation() {
        clearInterval(intervalId);
        clearInterval(countdownIntervalId);
        intervalId = null;
        countdownIntervalId = null;

        if (currentWindow && !currentWindow.closed) {
            currentWindow.close();
            currentWindow = null;
        }
        
        startButton.disabled = false;
        stopButton.disabled = true;
        updateStatus(false);
    }
    
    // Таймер обратного отсчета
    function startCountdown(seconds) {
        clearInterval(countdownIntervalId);
        let timeLeft = seconds;
        updateStatus(true, timeLeft);
        
        countdownIntervalId = setInterval(() => {
            timeLeft--;
            if (timeLeft < 0) {
                clearInterval(countdownIntervalId);
            } else {
                updateStatus(true, timeLeft);
            }
        }, 1000);
    }

    // --- Назначение обработчиков ---
    intervalSlider.addEventListener("input", updateIntervalText);
    addStreamButton.addEventListener("click", addStream);
    streamUrlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addStream();
    });
    startButton.addEventListener("click", startAutomation);
    stopButton.addEventListener("click", stopAutomation);
    
    // --- Инициализация ---
    loadStreams();
    updateIntervalText();
});