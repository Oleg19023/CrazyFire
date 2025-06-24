document.addEventListener('DOMContentLoaded', () => {
    // --- Элементы DOM ---
    const textInput = document.getElementById('textInput');
    const morseInput = document.getElementById('morseInput');
    const swapButton = document.getElementById('swapButton');
    const playButton = document.getElementById('playButton');
    const downloadButton = document.getElementById('downloadButton');
    const copyButton = document.getElementById('copyButton');
    const clearButton = document.getElementById('clearButton');
    const toggleCheatSheet = document.getElementById('toggleCheatSheet');
    const morseTableContainer = document.getElementById('morseTableContainer');
    const converterWrapper = document.querySelector('.morse-converter');

    // --- Словарь Морзе ---
    const morseCodeMap = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..',
        '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',
        ' ': '/', ',': '--..--', '.': '.-.-.-', '?': '..--..', ';': '-.-.-.', ':': '---...', "'": '.----.', '-': '-....-', '/': '-..-.', '(': '-.--.', ')': '-.--.-', '\"': '.-..-.'
    };
    const textCodeMap = Object.fromEntries(Object.entries(morseCodeMap).map(([k, v]) => [v, k]));

    // --- Переменные состояния ---
    let toMorse = true;
    let isPlaying = false;
    let activeOscillators = [];
    let playbackTimeout;

    // --- Аудио ---
    let audioContext;
    const dotDuration = 80;
    const frequency = 600;

    function initAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }
    document.body.addEventListener('click', initAudioContext, { once: true });

    // --- Функции ---
    function convert() {
        if (toMorse) {
            const text = textInput.value.toUpperCase();
            morseInput.value = text.split('').map(char => morseCodeMap[char] || '').join(' ');
        } else {
            const morse = morseInput.value.trim();
            textInput.value = morse.split(' ').map(code => textCodeMap[code] || '').join('');
        }
    }

    // --- ИСПРАВЛЕННАЯ ЛОГИКА ВОСПРОИЗВЕДЕНИЯ И ОСТАНОВКИ ---

    function updatePlayButton() {
        const icon = playButton.querySelector('i');
        const text = playButton.querySelector('span');
        if (isPlaying) {
            playButton.classList.add('playing');
            icon.className = 'fas fa-stop';
            if (text) text.textContent = 'Остановить';
        } else {
            playButton.classList.remove('playing');
            icon.className = 'fas fa-volume-up';
            if (text) text.textContent = 'Прослушать';
        }
    }

    function stopAllSounds() {
        // Останавливаем все активные генераторы
        activeOscillators.forEach(osc => osc.stop());
        activeOscillators = []; // Очищаем массив

        // Отменяем запланированное завершение воспроизведения
        if (playbackTimeout) {
            clearTimeout(playbackTimeout);
        }

        isPlaying = false;
        updatePlayButton();
    }

    function playMorseSound(morseCode) {
        if (isPlaying) return;
        if (!audioContext) return;

        isPlaying = true;
        updatePlayButton();

        let time = audioContext.currentTime;
        let totalDurationMs = 0;

        const symbolSpace = dotDuration / 1000;
        const letterSpace = (dotDuration * 3) / 1000;
        const wordSpace = (dotDuration * 7) / 1000;

        for (const symbol of morseCode) {
            let dur = 0;
            if (symbol === '.') dur = dotDuration / 1000;
            if (symbol === '-') dur = (dotDuration * 3) / 1000;

            if (dur > 0) {
                const oscillator = playSound(time, dur);
                activeOscillators.push(oscillator);
                time += dur + symbolSpace;
                totalDurationMs += (dur + symbolSpace) * 1000;
            } else if (symbol === ' ') {
                time += letterSpace - symbolSpace;
                totalDurationMs += (letterSpace - symbolSpace) * 1000;
            } else if (symbol === '/') {
                time += wordSpace - letterSpace;
                totalDurationMs += (wordSpace - letterSpace) * 1000;
            }
        }

        // Запланируем сброс состояния после окончания воспроизведения
        playbackTimeout = setTimeout(() => {
            isPlaying = false;
            updatePlayButton();
        }, totalDurationMs);
    }

    function playSound(startTime, duration) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        gainNode.gain.setValueAtTime(1, startTime);
        gainNode.gain.setValueAtTime(0, startTime + duration * 0.9); // Плавное затухание
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
        return oscillator;
    }
    
    // --- Остальные функции (без изменений) ---
    async function generateAndDownloadMp3(morseCode) {
        // ... код для скачивания MP3 остается таким же ...
        if (!morseCode) {
            alert("Поле с кодом Морзе пусто. Нечего скачивать.");
            return;
        }
        downloadButton.disabled = true;
        downloadButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Кодирование...';
        try {
            const sampleRate = 44100;
            const channels = 1;
            let totalDurationSec = 0;
            const symbolSpace = dotDuration / 1000;
            const letterSpace = (dotDuration * 3) / 1000;
            const wordSpace = (dotDuration * 7) / 1000;
            for (const symbol of morseCode) {
                if (symbol === '.') totalDurationSec += (dotDuration / 1000) + symbolSpace;
                else if (symbol === '-') totalDurationSec += (dotDuration * 3 / 1000) + symbolSpace;
                else if (symbol === ' ') totalDurationSec += letterSpace - symbolSpace;
                else if (symbol === '/') totalDurationSec += wordSpace - letterSpace;
            }
            const offlineCtx = new OfflineAudioContext(channels, Math.ceil(sampleRate * totalDurationSec), sampleRate);
            let time = 0;
            for (const symbol of morseCode) {
                let dur = 0;
                if (symbol === '.') dur = dotDuration / 1000;
                if (symbol === '-') dur = (dotDuration * 3 / 1000);
                if (dur > 0) {
                    const oscillator = offlineCtx.createOscillator();
                    const gainNode = offlineCtx.createGain();
                    oscillator.type = 'sine';
                    oscillator.frequency.value = frequency;
                    gainNode.gain.setValueAtTime(1, time);
                    gainNode.gain.setValueAtTime(0, time + dur);
                    oscillator.connect(gainNode);
                    gainNode.connect(offlineCtx.destination);
                    oscillator.start(time);
                    oscillator.stop(time + dur);
                    time += dur + symbolSpace;
                } else if (symbol === ' ') {
                    time += letterSpace - symbolSpace;
                } else if (symbol === '/') {
                    time += wordSpace - letterSpace;
                }
            }
            const renderedBuffer = await offlineCtx.startRendering();
            const pcmData = renderedBuffer.getChannelData(0);
            const samples = new Int16Array(pcmData.length);
            for (let i = 0; i < pcmData.length; i++) {
                samples[i] = pcmData[i] * 32767;
            }
            const mp3encoder = new lamejs.Mp3Encoder(channels, sampleRate, 128);
            const mp3Data = [];
            const sampleBlockSize = 1152;
            for (let i = 0; i < samples.length; i += sampleBlockSize) {
                const sampleChunk = samples.subarray(i, i + sampleBlockSize);
                const mp3buf = mp3encoder.encodeBuffer(sampleChunk);
                if (mp3buf.length > 0) mp3Data.push(mp3buf);
            }
            const mp3buf = mp3encoder.flush();
            if (mp3buf.length > 0) mp3Data.push(mp3buf);
            const blob = new Blob(mp3Data, { type: 'audio/mp3' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `morse_code_${Date.now()}.mp3`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Ошибка при создании MP3:', err);
            alert('Не удалось создать MP3 файл.');
        } finally {
            downloadButton.disabled = false;
            downloadButton.innerHTML = '<i class="fas fa-download"></i> Скачать MP3';
        }
    }
    
    function generateTable() {
        const table = document.createElement('table');
        table.innerHTML = `<thead><tr><th>Символ</th><th>Код</th><th>Символ</th><th>Код</th></tr></thead>`;
        const tbody = document.createElement('tbody');
        const entries = Object.entries(morseCodeMap);
        for(let i = 0; i < Math.ceil(entries.length / 2); i++) {
            const row = document.createElement('tr');
            const [char1, code1] = entries[i];
            row.innerHTML = `<td>${char1 === ' ' ? 'Пробел' : char1}</td><td>${code1}</td>`;
            const secondIndex = i + Math.ceil(entries.length / 2);
            if(secondIndex < entries.length) {
                const [char2, code2] = entries[secondIndex];
                row.innerHTML += `<td>${char2 === ' ' ? 'Пробел' : char2}</td><td>${code2}</td>`;
            } else {
                row.innerHTML += `<td></td><td></td>`;
            }
            tbody.appendChild(row);
        }
        table.appendChild(tbody);
        morseTableContainer.appendChild(table);
    }

    // --- Обработчики событий ---
    textInput.addEventListener('input', () => { if (toMorse) convert(); });
    morseInput.addEventListener('input', () => { if (!toMorse) convert(); });
    swapButton.addEventListener('click', () => {
        toMorse = !toMorse;
        converterWrapper.classList.toggle('swapped');
        textInput.readOnly = !toMorse;
        morseInput.readOnly = toMorse;
        if(toMorse) textInput.focus(); else morseInput.focus();
        convert();
    });
    // ИСПРАВЛЕННЫЙ ОБРАБОТЧИК
    playButton.addEventListener('click', () => {
        if (isPlaying) {
            stopAllSounds();
        } else {
            const codeToPlay = morseInput.value.trim();
            if (codeToPlay) {
                playMorseSound(codeToPlay);
            }
        }
    });
    downloadButton.addEventListener('click', () => {
        const codeToDownload = morseInput.value.trim();
        generateAndDownloadMp3(codeToDownload);
    });
    copyButton.addEventListener('click', () => {
        morseInput.select();
        document.execCommand('copy');
    });
    clearButton.addEventListener('click', () => {
        textInput.value = '';
        morseInput.value = '';
        stopAllSounds(); // Также останавливаем звук при очистке
    });
    toggleCheatSheet.addEventListener('click', () => {
        const containerParent = toggleCheatSheet.parentElement;
        containerParent.classList.toggle('open');
        if(containerParent.classList.contains('open')) {
            morseTableContainer.style.maxHeight = morseTableContainer.scrollHeight + "px";
        } else {
            morseTableContainer.style.maxHeight = "0";
        }
    });
    
    // Инициализация
    morseInput.readOnly = true;
    generateTable();
});