// --- DOM Элементы ---
const folderBtn = document.getElementById('folderBtn');
const filesBtn = document.getElementById('filesBtn');
const folderInput = document.getElementById('folderInput');
const filesInput = document.getElementById('filesInput');
const dropZone = document.getElementById('dropZone');
const filesInfo = document.getElementById('filesInfo');
const audioIndicator = document.getElementById('audioIndicator');

const videoPlayer = document.getElementById('videoPlayer');
const imageDisplay = document.getElementById('imageDisplay');
const mediaContainer = document.getElementById('mediaContainer');
const mediaTypeIndicator = document.getElementById('mediaTypeIndicator');

// Обновленные элементы управления
const playBtn = document.getElementById('playBtn');
const playBtnIcon = playBtn.querySelector('i'); // Иконка внутри кнопки
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const loopBtn = document.getElementById('loopBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');

// Обновленные элементы прогресс-бара
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar'); // Теперь это progress-played
const progressBuffered = document.getElementById('progressBuffered');
const progressThumb = document.getElementById('progressThumb');

const statusEl = document.getElementById('status');
const volumeSlider = document.getElementById('volumeSlider');
const fullscreenHotkeys = document.getElementById('fullscreenHotkeys');

// Настройки
const fadeEffectBtn = document.getElementById('fadeEffectBtn');
const metronomeBtn = document.getElementById('metronomeBtn');
const metronomeSpeed = document.getElementById('metronomeSpeed');
const metronomeBpm = document.getElementById('metronomeBpm');
const toggleClipSettingsBtn = document.getElementById('toggleClipSettingsBtn');
const clipSettingsContainer = document.getElementById('clipSettingsContainer');
const clipDurationInput = document.getElementById('clipDuration');

// --- Переменные состояния ---
let mediaFiles = [];
let currentMediaIndex = -1;
let history = [];
const MAX_HISTORY = 20;
let currentHistoryIndex = -1;

let isPlaying = false;
let isLoopEnabled = false;
let isShuffleEnabled = false;
let isClipModeEnabled = false;
let fadeEffectEnabled = false;
let isSeeking = false;

let clipDuration = 5;
let currentStartTime = 0;
let currentEndTime = 0;

let isTransitioning = false;
let hotkeysTimeout;
let clipInterval;

// Метроном
let metronomeOn = false;
let metronomeInterval;
let metronomeAudioCtx;

const supportedVideoFormats = ['.mp4', '.webm', '.mov', '.mkv'];
const supportedAudioFormats = ['.mp3', '.wav', '.flac',  '.ogg', '.aac'];
const supportedImageFormats = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

// --- Инициализация ---
videoPlayer.controls = false;

// --- Обработка файлов ---
folderBtn.addEventListener('click', () => folderInput.click());
filesBtn.addEventListener('click', () => filesInput.click());
folderInput.addEventListener('change', (e) => processFileSelection(Array.from(e.target.files)));
filesInput.addEventListener('change', (e) => processFileSelection(Array.from(e.target.files)));

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('highlight');
});
['dragleave', 'dragend'].forEach(type => {
    dropZone.addEventListener(type, () => dropZone.classList.remove('highlight'));
});
dropZone.addEventListener('drop', async (e) => {
    e.preventDefault();
    dropZone.classList.remove('highlight');
    const files = await getAllFilesFromDataTransfer(e.dataTransfer);
    if (files.length > 0) {
        processFileSelection(files);
    }
});

async function getAllFilesFromDataTransfer(dataTransfer) {
    const files = [];
    const queue = [];
    for (const item of dataTransfer.items) {
        queue.push(item.webkitGetAsEntry());
    }

    while (queue.length > 0) {
        const entry = queue.shift();
        if (entry.isFile) {
            files.push(await new Promise(resolve => entry.file(resolve)));
        } else if (entry.isDirectory) {
            const reader = entry.createReader();
            const entries = await new Promise(resolve => reader.readEntries(resolve));
            queue.push(...entries);
        }
    }
    return files;
}

function processFileSelection(files) {
    const filteredFiles = files.filter(file => {
        const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        // ИЗМЕНЕНИЕ: Проверяем все три типа форматов
        return supportedVideoFormats.includes(extension) || 
               supportedAudioFormats.includes(extension) || 
               supportedImageFormats.includes(extension);
    });

    if (filteredFiles.length > 0) {
        mediaFiles = filteredFiles;
        filesInfo.textContent = `Загружено ${mediaFiles.length} медиафайлов`;
        statusEl.textContent = `Готов к воспроизведению.`;
        history = [];
        currentHistoryIndex = -1;
        currentMediaIndex = -1;
        loadNextMedia();
    } else {
        filesInfo.textContent = 'Поддерживаемые медиафайлы не найдены';
        statusEl.textContent = 'Поддерживаемые медиафайлы не найдены';
    }
}

// --- Управление воспроизведением ---
playBtn.addEventListener('click', togglePlayPause);
prevBtn.addEventListener('click', loadPreviousMedia);
nextBtn.addEventListener('click', loadNextMedia);

function togglePlayPause() {
    if (mediaFiles.length === 0) return;

    isPlaying = !isPlaying;
    playBtnIcon.className = isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play';

    if (isPlaying) {
        if (videoPlayer.style.display === 'block' && videoPlayer.readyState >= 3) {
            videoPlayer.play().catch(e => console.error('Ошибка воспроизведения:', e));
        }
        startTimers();
    } else {
        videoPlayer.pause();
        clearInterval(clipInterval);
        statusEl.textContent = `Пауза: ${mediaFiles[currentMediaIndex]?.name || ''}`;
    }
}

function loadNextMedia() {
    if (mediaFiles.length === 0 || isTransitioning) return;

    let nextIndex;
    if (isShuffleEnabled) {
        do {
            nextIndex = Math.floor(Math.random() * mediaFiles.length);
        } while (mediaFiles.length > 1 && nextIndex === currentMediaIndex);
    } else {
        nextIndex = (currentMediaIndex + 1) % mediaFiles.length;
    }
    
    loadSpecificMedia(nextIndex);
}

function loadPreviousMedia() {
    if (history.length < 2 || currentHistoryIndex < 1 || isTransitioning) return;
    
    currentHistoryIndex--;
    const prev = history[currentHistoryIndex];
    loadSpecificMedia(prev.index, prev.startTime, prev.endTime, true);
}

function loadSpecificMedia(index, startTime = 0, endTime = 0, fromHistory = false) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    currentMediaIndex = index;

    const performLoad = () => {
        const mediaFile = mediaFiles[currentMediaIndex];
        const extension = mediaFile.name.substring(mediaFile.name.lastIndexOf('.')).toLowerCase();
        
        // ИЗМЕНЕНИЕ: Определяем все типы файлов
        const isVideo = supportedVideoFormats.includes(extension);
        const isAudio = supportedAudioFormats.includes(extension);
        const isImage = supportedImageFormats.includes(extension);
        
        // Сбрасываем все дисплеи
        videoPlayer.style.display = 'none';
        imageDisplay.style.display = 'none';
        audioIndicator.style.display = 'none';
        progressBuffered.style.width = '0%';
        
        const fileUrl = URL.createObjectURL(mediaFile);

        if (!fromHistory) {
            addToHistory(currentMediaIndex);
        }

        // ИЗМЕНЕНИЕ: Новая логика if-else if-else
        if (isVideo || isAudio) {
            mediaTypeIndicator.textContent = isVideo ? 'ВИДЕО' : 'АУДИО';
            if (isAudio) {
                audioIndicator.style.display = 'flex'; // Показываем иконку музыки
            }
            
            // Мы используем <video> элемент для проигрывания и видео, и аудио
            videoPlayer.src = fileUrl;
            videoPlayer.style.display = 'block';

            videoPlayer.onloadedmetadata = () => {
                // Логика клипов и полного воспроизведения работает и для аудио!
                if (isClipModeEnabled) {
                    const maxStartTime = Math.max(0, videoPlayer.duration - clipDuration);
                    currentStartTime = fromHistory ? startTime : Math.random() * maxStartTime;
                    currentEndTime = currentStartTime + clipDuration;
                    statusEl.textContent = `Клип: ${mediaFile.name} (${formatTime(currentStartTime)} - ${formatTime(currentEndTime)})`;
                } else {
                    currentStartTime = 0;
                    currentEndTime = videoPlayer.duration;
                    statusEl.textContent = `${isVideo ? 'Видео' : 'Аудио'}: ${mediaFile.name}`;
                }
                videoPlayer.currentTime = currentStartTime;
                
                if (isPlaying) {
                    videoPlayer.play().catch(e => console.error('Ошибка авто-воспроизведения:', e));
                }
                startTimers();
            };
        } else if (isImage) {
            mediaTypeIndicator.textContent = 'ФОТО';
            imageDisplay.src = fileUrl;
            imageDisplay.style.display = 'block';
            statusEl.textContent = `Фото: ${mediaFile.name} (${clipDuration} сек)`;
            startTimers();
        }
    };

    if (fadeEffectEnabled && currentMediaIndex !== -1) {
        mediaContainer.classList.add('fade-effect');
        setTimeout(() => {
            performLoad();
            setTimeout(() => {
                mediaContainer.classList.remove('fade-effect');
                isTransitioning = false;
            }, 50);
        }, 500);
    } else {
        performLoad();
        isTransitioning = false;
    }
}

// --- Таймеры и Прогресс-бар ---
function startTimers() {
    clearInterval(clipInterval);
    if (!isPlaying) return;

    const isVideo = videoPlayer.style.display === 'block';

    if (isVideo && !isClipModeEnabled) {
        return; // Прогресс-бар обновляется по событию ontimeupdate
    }

    // Воспроизведение клипа или показ изображения
    let duration = isClipModeEnabled ? clipDuration : clipDuration;
    let startTime = Date.now();
    if(isClipModeEnabled && isVideo) {
        const elapsedInClip = videoPlayer.currentTime - currentStartTime;
        startTime = Date.now() - elapsedInClip * 1000;
    }

    clipInterval = setInterval(() => {
        let elapsed = (Date.now() - startTime) / 1000;
        let progress = (elapsed / duration) * 100;
        updateProgressUI(progress);

        if (elapsed >= duration) {
            if (isLoopEnabled) {
                startTime = Date.now();
                if (isVideo) videoPlayer.currentTime = currentStartTime;
            } else {
                loadNextMedia();
            }
        }
    }, 100);
}

function updateProgressUI(progressPercentage) {
    const progress = Math.max(0, Math.min(100, progressPercentage));
    progressBar.style.width = `${progress}%`;
    progressThumb.style.left = `${progress}%`;
}

videoPlayer.ontimeupdate = () => {
    if (!isPlaying || isSeeking) return;

    let progress = 0;
    if (isClipModeEnabled) {
        const elapsed = videoPlayer.currentTime - currentStartTime;
        progress = (elapsed / clipDuration) * 100;
        if (videoPlayer.currentTime >= currentEndTime) {
            if (isLoopEnabled) {
                videoPlayer.currentTime = currentStartTime;
            } else {
                loadNextMedia();
            }
        }
    } else {
        progress = (videoPlayer.currentTime / videoPlayer.duration) * 100;
    }
    updateProgressUI(progress);
};

videoPlayer.onended = () => {
    if (isClipModeEnabled) return;
    if (isLoopEnabled) {
        videoPlayer.currentTime = 0;
        videoPlayer.play();
    } else {
        loadNextMedia();
    }
};

videoPlayer.onprogress = () => {
    if (videoPlayer.buffered.length > 0) {
        const bufferedEnd = videoPlayer.buffered.end(videoPlayer.buffered.length - 1);
        const duration = videoPlayer.duration;
        if (duration > 0) {
            const bufferedPercentage = (bufferedEnd / duration) * 100;
            progressBuffered.style.width = `${bufferedPercentage}%`;
        }
    }
};

// --- Логика перемотки (Seek) ---
function handleSeek(e) {
    if (mediaFiles.length === 0 || videoPlayer.style.display !== 'block') return;

    const rect = progressContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = progressContainer.clientWidth;
    const percentage = Math.max(0, Math.min(1, x / width));

    updateProgressUI(percentage * 100);

    if (isClipModeEnabled) {
        const seekTimeInClip = clipDuration * percentage;
        videoPlayer.currentTime = currentStartTime + seekTimeInClip;
    } else {
        videoPlayer.currentTime = videoPlayer.duration * percentage;
    }
}

progressContainer.addEventListener('mousedown', (e) => {
    isSeeking = true;
    handleSeek(e);
});
document.addEventListener('mousemove', (e) => {
    if (isSeeking) handleSeek(e);
});
document.addEventListener('mouseup', () => {
    if (isSeeking) {
        isSeeking = false;
        if (isPlaying) startTimers();
    }
});

// --- История ---
function addToHistory(index) {
    const historyItem = {
        index: index,
        startTime: isClipModeEnabled ? currentStartTime : 0,
        endTime: isClipModeEnabled ? currentEndTime : 0,
    };
    if (currentHistoryIndex < history.length - 1) {
        history = history.slice(0, currentHistoryIndex + 1);
    }
    history.push(historyItem);
    if (history.length > MAX_HISTORY) {
        history.shift();
    }
    currentHistoryIndex = history.length - 1;
}

// --- Настройки и режимы ---
loopBtn.addEventListener('click', () => {
    isLoopEnabled = !isLoopEnabled;
    loopBtn.classList.toggle('active', isLoopEnabled);
});
shuffleBtn.addEventListener('click', () => {
    isShuffleEnabled = !isShuffleEnabled;
    shuffleBtn.classList.toggle('active', isShuffleEnabled);
});
toggleClipSettingsBtn.addEventListener('click', () => {
    isClipModeEnabled = !isClipModeEnabled;
    toggleClipSettingsBtn.classList.toggle('active', isClipModeEnabled);
    toggleClipSettingsBtn.textContent = isClipModeEnabled ? 'Отключить' : 'Включить';
    clipSettingsContainer.style.display = isClipModeEnabled ? 'flex' : 'none';
    if (currentMediaIndex !== -1) {
        loadSpecificMedia(currentMediaIndex, 0, 0, true);
    }
});
clipDurationInput.addEventListener('change', () => {
    clipDuration = parseInt(clipDurationInput.value) || 5;
    if (clipDuration < 1) clipDuration = 1;
    clipDurationInput.value = clipDuration;
});
fadeEffectBtn.addEventListener('click', () => {
    fadeEffectEnabled = !fadeEffectEnabled;
    fadeEffectBtn.classList.toggle('active', fadeEffectEnabled);
    fadeEffectBtn.textContent = fadeEffectEnabled ? 'Отключить' : 'Включить';
});

// --- Горячие клавиши и доп. функции ---
document.addEventListener('keydown', (e) => {
    if (document.activeElement.tagName === 'INPUT') return;
    const keyMap = {
        ' ': togglePlayPause, 'ArrowLeft': loadPreviousMedia, 'ArrowRight': loadNextMedia,
        'f': toggleFullscreen, 'F': toggleFullscreen, 'Escape': () => isFullscreen() && toggleFullscreen(),
        'l': () => loopBtn.click(), 'L': () => loopBtn.click(),
        'm': () => metronomeBtn.click(), 'M': () => metronomeBtn.click(),
        's': () => shuffleBtn.click(),
        'S': () => shuffleBtn.click(),
    };
    if (keyMap[e.key]) {
        e.preventDefault();
        keyMap[e.key]();
    }
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        volumeSlider.value = Math.min(1, +volumeSlider.value + 0.1);
        videoPlayer.volume = volumeSlider.value;
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        volumeSlider.value = Math.max(0, +volumeSlider.value - 0.1);
        videoPlayer.volume = volumeSlider.value;
    } else if (e.key === '0') {
        e.preventDefault();
        videoPlayer.muted = !videoPlayer.muted;
        volumeSlider.value = videoPlayer.muted ? 0 : videoPlayer.volume;
    }
});

fullscreenBtn.addEventListener('click', toggleFullscreen);
document.addEventListener('fullscreenchange', handleFullscreenChange);
function isFullscreen() { return !!document.fullscreenElement; }
function toggleFullscreen() {
    if (!isFullscreen()) mediaContainer.requestFullscreen();
    else document.exitFullscreen();
}
function handleFullscreenChange() {
    if (isFullscreen()) {
        fullscreenHotkeys.classList.add('show');
        clearTimeout(hotkeysTimeout);
        hotkeysTimeout = setTimeout(() => fullscreenHotkeys.classList.remove('show'), 3000);
    } else {
        fullscreenHotkeys.classList.remove('show');
    }
}

// --- Мягкий звук метронома ---
function createMetronomeTick() {
    const now = metronomeAudioCtx.currentTime;
    const osc = metronomeAudioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    const filter = metronomeAudioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, now);
    const gainNode = metronomeAudioCtx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.7, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gainNode);
    gainNode.connect(filter);
    filter.connect(metronomeAudioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
}
metronomeBtn.addEventListener('click', () => {
    metronomeOn = !metronomeOn;
    metronomeBtn.classList.toggle('active', metronomeOn);
    metronomeBtn.textContent = metronomeOn ? 'ВКЛ' : 'ВЫКЛ';
    document.getElementById('metronomeContainer').classList.toggle('metronome-active', metronomeOn);
    if (metronomeOn) {
        if (!metronomeAudioCtx) {
            metronomeAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (metronomeAudioCtx.state === 'suspended') metronomeAudioCtx.resume();
        const interval = 60000 / parseInt(metronomeSpeed.value);
        createMetronomeTick();
        metronomeInterval = setInterval(createMetronomeTick, interval);
    } else {
        clearInterval(metronomeInterval);
    }
});
metronomeSpeed.addEventListener('input', () => {
    metronomeBpm.textContent = `${metronomeSpeed.value} BPM`;
    if (metronomeOn) {
        clearInterval(metronomeInterval);
        const interval = 60000 / parseInt(metronomeSpeed.value);
        metronomeInterval = setInterval(createMetronomeTick, interval);
    }
});

// --- Громкость и форматирование времени ---
volumeSlider.addEventListener('input', () => {
    videoPlayer.volume = volumeSlider.value;
    videoPlayer.muted = volumeSlider.value == 0;
});
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}