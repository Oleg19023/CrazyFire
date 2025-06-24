document.addEventListener('DOMContentLoaded', () => {
    // === Инициализация FFmpeg ===
    const { createFFmpeg, fetchFile } = FFmpeg;
    const ffmpeg = createFFmpeg({
        log: true,
        corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
    });

    // === Элементы DOM ===
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const queueZone = document.getElementById('queue-zone');
    const queueList = document.getElementById('queue-list');
    const queueCount = document.getElementById('queue-count');
    const resultZone = document.getElementById('result-zone');
    const resultList = document.getElementById('result-list');
    
    const formatSelect = document.getElementById('format-select');
    const convertBtn = document.getElementById('convert-btn');
    const downloadAllBtn = document.getElementById('download-all-btn');
    const resetBtn = document.getElementById('reset-btn');

    let filesToProcess = [];
    let convertedFiles = [];
    
    // --- ИЗМЕНЕНИЕ 1: Состояние загрузки FFmpeg ---
    // Используем объект для более детального отслеживания состояния
    const ffmpegState = {
        loaded: false,
        loading: false,
    };

    // --- ИЗМЕНЕНИЕ 2: Функция для асинхронной загрузки FFmpeg ---
    // Эта функция будет вызываться только один раз
    const loadFFmpeg = async () => {
        if (ffmpegState.loaded || ffmpegState.loading) return;
        
        ffmpegState.loading = true;
        setGlobalLoadingState(true, 'Загрузка компонентов...');
        try {
            await ffmpeg.load();
            ffmpegState.loaded = true;
        } catch (error) {
            console.error("Ошибка при загрузке FFmpeg:", error);
            setGlobalLoadingState(false, 'Ошибка загрузки компонентов!');
        } finally {
            ffmpegState.loading = false;
            setGlobalLoadingState(false);
        }
    };

    // === ОСНОВНАЯ ЛОГИКА ===

    // Обработка выбранных/перетащенных файлов
    const handleFiles = (files) => {
        filesToProcess = [];
        queueList.innerHTML = '';
        
        let needsFFmpeg = false;
        
        for (const file of files) {
            const isVideo = file.type.startsWith('video/');
            const isAudio = file.type.startsWith('audio/');
            const maxSize = isVideo ? 1024 * 1024 * 1024 : 200 * 1024 * 1024;
            
            if (file.size > maxSize) {
                alert(`Файл "${file.name}" слишком большой!`);
                continue;
            }
            
            if (isVideo || isAudio) {
                needsFFmpeg = true;
            }
            filesToProcess.push(file);
        }

        if (filesToProcess.length > 0) {
            renderQueue();
            queueZone.hidden = false;
            resultZone.hidden = true;
            // --- ИЗМЕНЕНИЕ 3: Запускаем загрузку FFmpeg, если нужно ---
            if (needsFFmpeg && !ffmpegState.loaded) {
                loadFFmpeg();
            }
        }
    };

    // Отрисовка очереди файлов (без изменений)
    const renderQueue = () => {
        queueCount.textContent = filesToProcess.length;
        queueList.innerHTML = '';
        filesToProcess.forEach((file, index) => {
            const fileItem = document.createElement('li');
            fileItem.className = 'file-item';
            fileItem.id = `queue-item-${index}`;
            const icon = getFileIcon(file.type);
            const size = (file.size / 1024 / 1024).toFixed(2) + ' МБ';
            fileItem.innerHTML = `
                <div class="file-icon"><i class="fas ${icon}"></i></div>
                <div class="file-details">
                    <div class="file-name">${file.name}</div>
                    <div class="file-meta">${file.type} - ${size}</div>
                </div>
                <div class="file-status">
                    <span class="status-text">Ожидание</span>
                    <div class="progress" style="display: none;"><div class="progress-bar" role="progressbar" style="width: 0%;"></div></div>
                </div>`;
            queueList.appendChild(fileItem);
        });
    };

    // --- ИЗМЕНЕНИЕ 4: Переработанная функция старта конвертации ---
    const startConversion = async () => {
        // Проверяем, не загружается ли FFmpeg прямо сейчас
        if (ffmpegState.loading) {
            alert('Пожалуйста, подождите, пока компоненты для конвертации загрузятся.');
            return;
        }

        // Проверяем, нужны ли вообще компоненты FFmpeg для этой задачи
        const needsFFmpeg = filesToProcess.some(f => f.type.startsWith('video/') || f.type.startsWith('audio/'));
        if (needsFFmpeg && !ffmpegState.loaded) {
            alert('Произошла ошибка при загрузке компонентов. Попробуйте обновить страницу.');
            return;
        }

        setGlobalLoadingState(true, 'Конвертация...');
        convertedFiles = [];

        for (let i = 0; i < filesToProcess.length; i++) {
            const file = filesToProcess[i];
            const itemUI = document.getElementById(`queue-item-${i}`);
            const statusTextUI = itemUI.querySelector('.status-text');
            const progressUI = itemUI.querySelector('.progress');
            const progressBarUI = itemUI.querySelector('.progress-bar');
            
            statusTextUI.textContent = 'Обработка...';
            progressUI.style.display = 'block';

            try {
                const targetFormat = formatSelect.value;
                let resultBlob;
                let newFileName;

                if (file.type.startsWith('image/')) {
                    progressBarUI.style.width = '50%';
                    resultBlob = await convertImage(file, targetFormat);
                    newFileName = file.name.replace(/\.[^/.]+$/, "") + `.${targetFormat}`;
                    progressBarUI.style.width = '100%';
                } else if (file.type.startsWith('audio/') || file.type.startsWith('video/')) {
                    ffmpeg.setProgress(({ ratio }) => {
                        progressBarUI.style.width = `${Math.round(ratio * 100)}%`;
                    });
                    const output = await convertMedia(file, targetFormat);
                    resultBlob = new Blob([output.buffer], { type: getMimeType(targetFormat) });
                    newFileName = file.name.replace(/\.[^/.]+$/, "") + `.${targetFormat}`;
                }

                convertedFiles.push({ blob: resultBlob, name: newFileName });
                statusTextUI.textContent = 'Готово!';
                statusTextUI.style.color = '#198754';
            } catch (error) {
                console.error(error);
                statusTextUI.textContent = 'Ошибка';
                statusTextUI.style.color = '#dc3545';
                progressBarUI.style.display = 'none';
            }
        }
        
        renderResults();
        queueZone.hidden = true;
        resultZone.hidden = false;
        setGlobalLoadingState(false);
    };

    // Конвертация изображений (без изменений)
    const convertImage = (file, format) => {
        return new Promise((resolve, reject) => {
            const mimeType = `image/${format}`;
            const img = new Image();
            const reader = new FileReader();
            
            reader.onload = (e) => {
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    canvas.toBlob(resolve, mimeType, 0.92);
                };
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // Конвертация медиа (без изменений)
    const convertMedia = async (file, format) => {
        const inputFileName = 'input.' + file.name.split('.').pop();
        const outputFileName = 'output.' + format;
        
        ffmpeg.FS('writeFile', inputFileName, await fetchFile(file));
        await ffmpeg.run('-i', inputFileName, outputFileName);
        const data = ffmpeg.FS('readFile', outputFileName);
        
        ffmpeg.FS('unlink', inputFileName);
        ffmpeg.FS('unlink', outputFileName);
        
        return data;
    };

    // Отрисовка результатов (без изменений)
    const renderResults = () => {
        resultList.innerHTML = '';
        convertedFiles.forEach(file => {
            const fileItem = document.createElement('li');
            fileItem.className = 'file-item';
            const icon = getFileIcon(file.blob.type);
            const size = (file.blob.size / 1024 / 1024).toFixed(2) + ' МБ';

            fileItem.innerHTML = `
                <div class="file-icon"><i class="fas ${icon}"></i></div>
                <div class="file-details">
                    <div class="file-name">${file.name}</div>
                    <div class="file-meta">${file.blob.type} - ${size}</div>
                </div>
                <div class="file-actions">
                    <a href="${URL.createObjectURL(file.blob)}" download="${file.name}" title="Скачать"><i class="fas fa-download"></i></a>
                </div>`;
            resultList.appendChild(fileItem);
        });
    };

    // Скачать все (без изменений)
    const downloadAll = async () => {
        if (convertedFiles.length === 0) return;
        
        const zip = new JSZip();
        convertedFiles.forEach(file => { zip.file(file.name, file.blob); });

        const zipBlob = await zip.generateAsync({ type: "blob" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.download = "converted_files.zip";
        link.click();
    };

    // === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===
    
    // --- ИЗМЕНЕНИЕ 5: Функция для блокировки/разблокировки интерфейса ---
    const setGlobalLoadingState = (isLoading, message = '') => {
        convertBtn.disabled = isLoading;
        if (isLoading) {
            convertBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ${message}`;
        } else {
            convertBtn.textContent = 'Начать конвертацию';
        }
    };
    
    // Остальные вспомогательные функции (без изменений)
    const getFileIcon = (fileType) => {
        if (fileType.startsWith('image/')) return 'fa-file-image';
        if (fileType.startsWith('audio/')) return 'fa-file-audio';
        if (fileType.startsWith('video/')) return 'fa-file-video';
        return 'fa-file';
    };
    const getMimeType = (format) => {
        const mimes = { mp4: 'video/mp4', webm: 'video/webm', mp3: 'audio/mpeg', wav: 'audio/wav', aac: 'audio/aac' };
        return mimes[format] || 'application/octet-stream';
    };
    const resetAll = () => {
        filesToProcess = [];
        convertedFiles = [];
        queueList.innerHTML = '';
        resultList.innerHTML = '';
        queueZone.hidden = true;
        resultZone.hidden = true;
        setGlobalLoadingState(false);
        fileInput.value = '';
    };

    // === НАЗНАЧЕНИЕ ОБРАБОТЧИКОВ ===
    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFiles(e.target.files));
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => { e.preventDefault(); dropZone.classList.remove('dragover'); handleFiles(e.dataTransfer.files); });
    
    convertBtn.addEventListener('click', startConversion);
    downloadAllBtn.addEventListener('click', downloadAll);
    resetBtn.addEventListener('click', resetAll);
});