document.addEventListener('DOMContentLoaded', () => {
    // --- Элементы DOM ---
    const videoUrlInput = document.getElementById('videoUrlInput');
    const addVideoButton = document.getElementById('addVideoButton');
    const videoListElement = document.getElementById('videoList');
    const videoCountElement = document.getElementById('videoCount');
    const clearPlaylistButton = document.getElementById('clearPlaylistButton');
    const addDemoButton = document.getElementById('addDemoButton');
    
    const videoPlayer = document.getElementById('videoPlayer');
    const playerOverlay = document.getElementById('playerOverlay');
    
    const intervalSlider = document.getElementById('intervalSlider');
    const intervalValueElement = document.getElementById('intervalValue');
    
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    
    const nextVideoProgress = document.getElementById('nextVideoProgress');

    // --- Переменные состояния ---
    let videos = [];
    let currentIndex = -1;
    let mainIntervalId;
    let progressIntervalId;

    const demoLinks = [
        'https://cdn.pixabay.com/video/2015/08/11/311-135956325_tiny.mp4', 'https://cdn.pixabay.com/video/2024/03/21/205009-926015715_tiny.mp4', 'https://cdn.pixabay.com/video/2017/03/20/8451-209292190_tiny.mp4', 'https://cdn.pixabay.com/video/2020/05/24/39981-424061531_tiny.mp4', 'https://cdn.pixabay.com/video/2020/10/25/53305-472605911_tiny.mp4'
    ];

    // --- Функции ---
    function loadVideos() {
        const savedVideos = localStorage.getItem('videoSwitcherPlaylist');
        if (savedVideos) {
            videos = JSON.parse(savedVideos);
            renderPlaylist();
        }
    }

    function saveVideos() {
        localStorage.setItem('videoSwitcherPlaylist', JSON.stringify(videos));
    }

    function renderPlaylist() {
        videoListElement.innerHTML = '';
        videos.forEach((url, index) => {
            const li = document.createElement('li');
            if (index === currentIndex) {
                li.classList.add('playing');
            }
            const textNode = document.createElement('span');
            textNode.textContent = url;
            li.appendChild(textNode);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-video-btn';
            deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                removeVideo(index);
            };
            li.appendChild(deleteBtn);
            
            li.onclick = () => playSpecificVideo(index);
            
            videoListElement.appendChild(li);
        });
        videoCountElement.textContent = videos.length;
    }

    function addVideo() {
        const url = videoUrlInput.value.trim();
        if (url) {
            videos.push(url);
            videoUrlInput.value = '';
            saveVideos();
            renderPlaylist();
        }
    }

    function removeVideo(index) {
        videos.splice(index, 1);
        if (index < currentIndex) {
            currentIndex--;
        } else if (index === currentIndex) {
            stopPlayback();
        }
        saveVideos();
        renderPlaylist();
    }
    
    function playSpecificVideo(index) {
        if (!mainIntervalId) { 
            currentIndex = index;
            playCurrentVideo();
        }
    }

    function playCurrentVideo() {
        if (videos.length === 0 || currentIndex < 0) {
            playerOverlay.style.display = 'flex';
            videoPlayer.pause();
            videoPlayer.src = '';
            return;
        }
        playerOverlay.style.display = 'none';
        videoPlayer.src = videos[currentIndex];
        videoPlayer.play().catch(e => console.error("Ошибка воспроизведения:", e));
        renderPlaylist();
    }
    
    // --- ИСПРАВЛЕНИЕ: Новая функция для выбора случайного видео ---
    function playNextRandomVideo() {
        if (videos.length === 0) return;
        
        if (videos.length === 1) {
            currentIndex = 0;
        } else {
            let nextIndex;
            // Выбираем случайный индекс, пока он не будет отличаться от текущего
            do {
                nextIndex = Math.floor(Math.random() * videos.length);
            } while (nextIndex === currentIndex);
            currentIndex = nextIndex;
        }
        
        playCurrentVideo();
    }
    
    function startPlayback() {
        if (videos.length === 0) {
            alert("Плейлист пуст. Добавьте видео.");
            return;
        }
        
        startButton.disabled = true;
        stopButton.disabled = false;
        
        // ИСПРАВЛЕНИЕ: Вызываем новую функцию
        playNextRandomVideo(); 
        
        const switchTime = parseInt(intervalSlider.value, 10) * 1000;
        
        mainIntervalId = setInterval(() => {
            // ИСПРАВЛЕНИЕ: И здесь тоже
            playNextRandomVideo();
        }, switchTime);

        startProgressBar(switchTime);
    }
    
    function stopPlayback() {
        clearInterval(mainIntervalId);
        clearInterval(progressIntervalId);
        mainIntervalId = null;
        progressIntervalId = null;
        
        startButton.disabled = false;
        stopButton.disabled = true;
        
        nextVideoProgress.style.transition = 'none';
        nextVideoProgress.style.width = '0%';
        currentIndex = -1;
        renderPlaylist();
    }

    function startProgressBar(duration) {
        clearInterval(progressIntervalId);
        nextVideoProgress.style.transition = 'none';
        nextVideoProgress.style.width = '0%';
        
        setTimeout(() => {
            nextVideoProgress.style.transition = `width ${duration / 1000}s linear`;
            nextVideoProgress.style.width = '100%';
        }, 50);

        progressIntervalId = setInterval(() => {
            nextVideoProgress.style.transition = 'none';
            nextVideoProgress.style.width = '0%';
            setTimeout(() => {
                nextVideoProgress.style.transition = `width ${duration / 1000}s linear`;
                nextVideoProgress.style.width = '100%';
            }, 50);
        }, duration);
    }

    // --- Обработчики событий ---
    addVideoButton.addEventListener('click', addVideo);
    videoUrlInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addVideo(); });
    clearPlaylistButton.addEventListener('click', () => {
        if(confirm("Вы уверены, что хотите очистить весь плейлист?")) {
            videos = [];
            stopPlayback();
            saveVideos();
            renderPlaylist();
            playCurrentVideo();
        }
    });
    addDemoButton.addEventListener('click', () => {
        videos.push(...demoLinks);
        saveVideos();
        renderPlaylist();
    });
    intervalSlider.addEventListener('input', () => { intervalValueElement.textContent = `${intervalSlider.value} сек.`; });
    startButton.addEventListener('click', startPlayback);
    stopButton.addEventListener('click', stopPlayback);

    // --- Инициализация ---
    loadVideos();
    intervalValueElement.textContent = `${intervalSlider.value} сек.`;
});