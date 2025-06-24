document.addEventListener('DOMContentLoaded', () => {
    // === ОБЩАЯ ЛОГИКА ===
    function formatTime(val) {
        return val < 10 ? '0' + val : val;
    }

    // === ВКЛАДКА 1: МИРОВЫЕ ЧАСЫ ===
    const localTimeEl = document.getElementById('localTime');
    const localDateEl = document.getElementById('localDate');
    const clocksGrid = document.getElementById('clocks-grid');
    const volumeSlider = document.getElementById('volume-slider');
    let favorites = new Set(JSON.parse(localStorage.getItem('favoriteTimezones')) || []);

    const timezones = {
        // === Азия и Океания ===
        'Pacific/Auckland': 'Окленд',
        'Australia/Sydney': 'Сидней',
        'Australia/Melbourne': 'Мельбурн',
        'Asia/Tokyo': 'Токио',
        'Asia/Seoul': 'Сеул',
        'Asia/Shanghai': 'Шанхай',
        'Asia/Hong_Kong': 'Гонконг',
        'Asia/Singapore': 'Сингапур',
        'Asia/Bangkok': 'Бангкок',
        'Asia/Kolkata': 'Калькутта',
        'Asia/Dubai': 'Дубай',
        'Asia/Yekaterinburg': 'Екатеринбург',

        // === Европа ===
        'Europe/Moscow': 'Москва',
        'Europe/Istanbul': 'Стамбул',
        'Europe/Helsinki': 'Хельсинки',
        'Europe/Kyiv': 'Киев',
        'Europe/Athens': 'Афины',
        'Europe/Minsk': 'Минск',
        'Europe/Stockholm': 'Стокгольм',
        'Europe/Warsaw': 'Варшава',
        'Europe/Berlin': 'Берлин',
        'Europe/Prague': 'Прага',
        'Europe/Rome': 'Рим',
        'Europe/Paris': 'Париж',
        'Europe/Madrid': 'Мадрид',
        'Europe/Amsterdam': 'Амстердам',
        'Europe/London': 'Лондон',
        'Europe/Dublin': 'Дублин',
        'Europe/Lisbon': 'Лиссабон',

        // === Африка ===
        'Africa/Cairo': 'Каир',
        'Africa/Johannesburg': 'Йоханнесбург',
        'Africa/Lagos': 'Лагос',
        
        // === Америка ===
        'America/Sao_Paulo': 'Сан-Паулу',
        'America/Argentina/Buenos_Aires': 'Буэнос-Айрес',
        'America/Halifax': 'Галифакс',
        'America/New_York': 'Нью-Йорк (EST)',
        'America/Bogota': 'Богота',
        'America/Chicago': 'Чикаго (CST)',
        'America/Mexico_City': 'Мехико',
        'America/Denver': 'Денвер (MST)',
        'America/Phoenix': 'Финикс',
        'America/Los_Angeles': 'Лос-Анджелес (PST)',
        'America/Vancouver': 'Ванкувер',
        'America/Anchorage': 'Анкоридж',
        'Pacific/Honolulu': 'Гонолулу',
    };
    
    // Обновление локального времени
    function updateLocalClock() {
        const now = new Date();
        localTimeEl.textContent = `${formatTime(now.getHours())}:${formatTime(now.getMinutes())}:${formatTime(now.getSeconds())}`;
        localDateEl.textContent = now.toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
    
    // Обновление и сортировка всех часов
    function updateAllClocks() {
        updateLocalClock();
        
        const now = new Date();
        const cards = Array.from(document.querySelectorAll('.clock-card'));

        // 1. Обновляем время и сохраняем данные для сортировки
        cards.forEach(card => {
            const tz = card.dataset.timezone;
            const timeInTz = new Date(now.toLocaleString('en-US', { timeZone: tz }));
            
            card.dataset.offset = timeInTz.getTime() - now.getTime();
            card.dataset.isFavorite = favorites.has(tz) ? '1' : '0'; // 1 для избранного, 0 для обычного

            card.querySelector('.clock-card-time').textContent = timeInTz.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            card.querySelector('.clock-card-date').textContent = timeInTz.toLocaleDateString('ru-RU', { year: 'numeric', month: 'short', day: 'numeric' });
        });

        // 2. Сортируем с учетом избранного
        cards.sort((a, b) => {
            const favoriteA = parseInt(a.dataset.isFavorite, 10);
            const favoriteB = parseInt(b.dataset.isFavorite, 10);
            const offsetA = parseInt(a.dataset.offset, 10);
            const offsetB = parseInt(b.dataset.offset, 10);

            // Сначала сортируем по избранному (избранные идут первыми)
            if (favoriteA !== favoriteB) {
                return favoriteB - favoriteA; // 1-0=1 (b идет раньше), 0-1=-1 (a идет раньше)
            }
            
            // Если статус избранного одинаковый, сортируем по времени
            return offsetA - offsetB;
        });

        // 3. Вставляем отсортированные карточки обратно в сетку
        cards.forEach(card => clocksGrid.appendChild(card));
    }

    // Добавление часов города
    function addCityClock(tz) {
        const card = document.createElement('div');
        card.className = 'clock-card';
        card.dataset.timezone = tz;

        // Проверяем, находится ли город в избранном, и добавляем класс
        const isFavorite = favorites.has(tz);
        
        card.innerHTML = `
            <button class="favorite-btn ${isFavorite ? 'is-favorite' : ''}" title="Добавить в избранное">
                <i class="${isFavorite ? 'fas' : 'far'} fa-star"></i>
            </button>
            <h3 class="clock-card-city">${timezones[tz]}</h3>
            <div class="clock-card-time">00:00:00</div>
            <p class="clock-card-date">date</p>
        `;
        clocksGrid.appendChild(card);

        // Добавляем обработчик на звездочку
        card.querySelector('.favorite-btn').addEventListener('click', (e) => {
            e.stopPropagation(); // Предотвращаем всплытие события
            toggleFavorite(tz, e.currentTarget);
        });
    }

        function toggleFavorite(tz, btnElement) {
        if (favorites.has(tz)) {
            favorites.delete(tz);
            btnElement.classList.remove('is-favorite');
            btnElement.querySelector('i').className = 'far fa-star';
        } else {
            favorites.add(tz);
            btnElement.classList.add('is-favorite');
            btnElement.querySelector('i').className = 'fas fa-star';
        }
        // Сохраняем изменения в localStorage
        localStorage.setItem('favoriteTimezones', JSON.stringify(Array.from(favorites)));
        // Применяем сортировку немедленно
        updateAllClocks();
    }
    
    // Инициализация
    updateLocalClock();
    setInterval(updateAllClocks, 1000);

        // === НОВЫЙ БЛОК: Инициализация предустановленных часов ===
    function initializeWorldClocks() {
        // Очищаем сетку на всякий случай
        clocksGrid.innerHTML = ''; 
        // Добавляем все часы из нашего объекта timezones
        for (const tz in timezones) {
            addCityClock(tz);
        }
    }
    
    // Вызываем эту функцию при загрузке
    initializeWorldClocks();


    // === ВКЛАДКА 2: СЕКУНДОМЕР ===
    const stopwatchDisplay = document.getElementById('stopwatch-display');
    const startStopwatchBtn = document.getElementById('start-stopwatch-btn');
    const pauseStopwatchBtn = document.getElementById('pause-stopwatch-btn');
    const lapStopwatchBtn = document.getElementById('lap-stopwatch-btn');
    const resetStopwatchBtn = document.getElementById('reset-stopwatch-btn');
    const lapsList = document.getElementById('laps-list');
    
    let stopwatchInterval, startTime, elapsedTime = 0, lapCounter = 0;

    function formatStopwatchTime(ms) {
        const date = new Date(ms);
        const minutes = formatTime(date.getUTCMinutes());
        const seconds = formatTime(date.getUTCSeconds());
        const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');
        return `${minutes}:${seconds}.${milliseconds}`;
    }

    startStopwatchBtn.addEventListener('click', () => {
        startTime = Date.now() - elapsedTime;
        stopwatchInterval = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            stopwatchDisplay.textContent = formatStopwatchTime(elapsedTime);
        }, 10);
        startStopwatchBtn.disabled = true;
        pauseStopwatchBtn.disabled = false;
        lapStopwatchBtn.disabled = false;
        resetStopwatchBtn.disabled = false;
    });

    pauseStopwatchBtn.addEventListener('click', () => {
        clearInterval(stopwatchInterval);
        startStopwatchBtn.disabled = false;
        pauseStopwatchBtn.disabled = true;
    });

    resetStopwatchBtn.addEventListener('click', () => {
        clearInterval(stopwatchInterval);
        elapsedTime = 0;
        lapCounter = 0;
        stopwatchDisplay.textContent = '00:00:00.000';
        lapsList.innerHTML = '';
        startStopwatchBtn.disabled = false;
        pauseStopwatchBtn.disabled = true;
        lapStopwatchBtn.disabled = true;
        resetStopwatchBtn.disabled = true;
    });

    lapStopwatchBtn.addEventListener('click', () => {
        lapCounter++;
        const li = document.createElement('li');
        li.innerHTML = `<span>Круг ${lapCounter}</span><span>${formatStopwatchTime(elapsedTime)}</span>`;
        lapsList.prepend(li);
    });


    // === ВКЛАДКА 3: ТАЙМЕР ===
    const timerDisplay = document.getElementById('timer-display');
    const hoursInput = document.getElementById('hours-input');
    const minutesInput = document.getElementById('minutes-input');
    const secondsInput = document.getElementById('seconds-input');
    const startTimerBtn = document.getElementById('start-timer-btn');
    const pauseTimerBtn = document.getElementById('pause-timer-btn');
    const resetTimerBtn = document.getElementById('reset-timer-btn');
    
    let timerInterval, totalSeconds = 0, remainingSeconds = 0;
    // --- НОВЫЙ БЛОК: Генерация звука через Web Audio API ---
    let audioContext;
    let volumeNode;

    // Инициализируем аудио контекст только после первого взаимодействия пользователя
    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            volumeNode = audioContext.createGain();
            volumeNode.connect(audioContext.destination);
            volumeNode.gain.value = volumeSlider.value;
        }
    }

    // Функция для воспроизведения звукового сигнала
    function playAlarmSound() {
        if (!audioContext) return; // Не играть, если контекст не создан

        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine'; // Тип волны (синусоида - мягкий звук)
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // Частота звука (нота A5)
        
        oscillator.connect(volumeNode);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5); // Длительность звука - 0.5 секунды
    }

    // Привязываем инициализацию аудио к первому клику, чтобы обойти политику автозапуска
    document.body.addEventListener('click', initAudio, { once: true });

    volumeSlider.addEventListener('input', () => {
        if (volumeNode) {
            volumeNode.gain.value = volumeSlider.value;
        }
    });

    function updateTimerDisplay() {
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = remainingSeconds % 60;
        timerDisplay.textContent = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
    }

    startTimerBtn.addEventListener('click', () => {
        if (remainingSeconds === 0) {
            totalSeconds = (parseInt(hoursInput.value) || 0) * 3600 + 
                           (parseInt(minutesInput.value) || 0) * 60 + 
                           (parseInt(secondsInput.value) || 0);
            remainingSeconds = totalSeconds;
        }
        if (remainingSeconds <= 0) return;

        timerInterval = setInterval(() => {
            remainingSeconds--;
            updateTimerDisplay();
            if (remainingSeconds <= 0) {
                clearInterval(timerInterval);
                playAlarmSound();
                alert('Время вышло!');
                resetTimer();
            }
        }, 1000);

        startTimerBtn.disabled = true;
        pauseTimerBtn.disabled = false;
        resetTimerBtn.disabled = false;
    });

    pauseTimerBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        startTimerBtn.disabled = false;
        pauseTimerBtn.disabled = true;
    });
    
    function resetTimer() {
        clearInterval(timerInterval);
        remainingSeconds = 0;
        totalSeconds = 0;
        hoursInput.value = '';
        minutesInput.value = '';
        secondsInput.value = '';
        updateTimerDisplay();
        startTimerBtn.disabled = false;
        pauseTimerBtn.disabled = true;
        resetTimerBtn.disabled = true;
    }

    resetTimerBtn.addEventListener('click', resetTimer);
});