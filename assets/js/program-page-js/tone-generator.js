document.addEventListener('DOMContentLoaded', () => {
    // --- Инициализация элементов ---
    const frequencyInput = document.getElementById("frequency-input");
    const frequencySlider = document.getElementById("frequency-slider");
    const volumeSlider = document.getElementById("volume-slider");
    const playStopButton = document.getElementById("playStopButton");
    const waveButtons = document.querySelectorAll(".wave-btn");
    const visualizerCanvas = document.getElementById("visualizer");
    
    if (!visualizerCanvas) return; // Выход, если мы не на той странице

    const canvasCtx = visualizerCanvas.getContext("2d");

    // --- Переменные состояния ---
    let audioContext;
    let oscillator;
    let gainNode;
    let analyser;
    let isPlaying = false;
    let waveType = 'sine'; // Тип волны по умолчанию

    // --- Инициализация Web Audio API ---
    function initAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;
        }
    }

    // --- Функции управления звуком ---
    function startTone() {
        initAudioContext();
        if (isPlaying) return;

        oscillator = audioContext.createOscillator();
        gainNode = audioContext.createGain();

        oscillator.type = waveType;
        oscillator.frequency.setValueAtTime(frequencySlider.value, audioContext.currentTime);
        gainNode.gain.setValueAtTime(volumeSlider.value, audioContext.currentTime);

        oscillator.connect(gainNode);
        gainNode.connect(analyser);
        analyser.connect(audioContext.destination);

        oscillator.start();
        isPlaying = true;
        updatePlayButton();
        draw();
    }

    function stopTone() {
        if (oscillator) {
            oscillator.stop();
            oscillator = null;
        }
        isPlaying = false;
        updatePlayButton();
        // Очищаем холст после остановки
        canvasCtx.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
    }

    // --- Обновление UI ---
    function updatePlayButton() {
        const icon = playStopButton.querySelector('i');
        const text = playStopButton.querySelector('span');
        if (isPlaying) {
            playStopButton.classList.add('playing');
            icon.className = 'fas fa-stop';
            text.textContent = 'Остановить';
        } else {
            playStopButton.classList.remove('playing');
            icon.className = 'fas fa-play';
            text.textContent = 'Воспроизвести';
        }
    }

    // --- Визуализация ---
    function draw() {
        if (!isPlaying) return;
        requestAnimationFrame(draw);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = document.body.classList.contains('dark-theme') ? '#1c1c1e' : '#f8f9fa';
        canvasCtx.fillRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
        
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = document.body.classList.contains('dark-theme') ? '#58a6ff' : '#0d6efd';
        canvasCtx.beginPath();

        const sliceWidth = visualizerCanvas.width * 1.0 / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = v * visualizerCanvas.height / 2;

            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }
            x += sliceWidth;
        }

        canvasCtx.lineTo(visualizerCanvas.width, visualizerCanvas.height / 2);
        canvasCtx.stroke();
    }

    // --- Обработчики событий ---
    playStopButton.addEventListener('click', () => {
        if (isPlaying) {
            stopTone();
        } else {
            startTone();
        }
    });

    // Синхронизация слайдера и инпута частоты
    frequencySlider.addEventListener('input', (e) => {
        const value = e.target.value;
        frequencyInput.value = value;
        if (oscillator) {
            oscillator.frequency.setValueAtTime(value, audioContext.currentTime);
        }
    });
    frequencyInput.addEventListener('input', (e) => {
        const value = e.target.value;
        frequencySlider.value = value;
        if (oscillator) {
            oscillator.frequency.setValueAtTime(value, audioContext.currentTime);
        }
    });

    // Громкость
    volumeSlider.addEventListener('input', (e) => {
        if (gainNode) {
            gainNode.gain.setValueAtTime(e.target.value, audioContext.currentTime);
        }
    });

    // Выбор формы волны
    waveButtons.forEach(button => {
        button.addEventListener('click', () => {
            waveButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            waveType = button.dataset.wave;
            if (oscillator) {
                oscillator.type = waveType;
            }
        });
    });
});