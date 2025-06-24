document.addEventListener('DOMContentLoaded', () => {
    // === ЭЛЕМЕНТЫ DOM ===
    const textInput = document.getElementById('text-input');
    const clearBtn = document.getElementById('clear-btn');
    const charCountRealtime = document.getElementById('char-count-realtime');
    const fileInput = document.getElementById('file-input');
    const fileUploadWrapper = document.querySelector('.file-upload-wrapper');

    // ... остальные элементы для вывода результатов
    const totalCharsEl = document.getElementById('total-chars');
    const charsNoSpacesEl = document.getElementById('chars-no-spaces');
    const wordCountEl = document.getElementById('word-count');
    const uniqueWordCountEl = document.getElementById('unique-word-count');
    const sentenceCountEl = document.getElementById('sentence-count');
    const avgWordLengthEl = document.getElementById('avg-word-length');
    const avgSentenceLengthEl = document.getElementById('avg-sentence-length');

    // === ИНИЦИАЛИЗАЦИЯ PDF.JS ===
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js`;

    // === ФУНКЦИЯ АНАЛИЗА ТЕКСТА ===
    function analyzeText() {
        const text = textInput.value;
        const totalChars = text.length;
        totalCharsEl.textContent = totalChars.toLocaleString('ru-RU');
        charCountRealtime.textContent = `Символов: ${totalChars.toLocaleString('ru-RU')}`;
        
        const charsNoSpaces = text.replace(/\s/g, '').length;
        charsNoSpacesEl.textContent = charsNoSpaces.toLocaleString('ru-RU');

        const words = text.match(/[a-zA-Zа-яА-ЯёЁ0-9_]+/g) || [];
        const wordCount = words.length;
        wordCountEl.textContent = wordCount.toLocaleString('ru-RU');

        const uniqueWords = new Set(words.map(word => word.toLowerCase()));
        uniqueWordCountEl.textContent = uniqueWords.size.toLocaleString('ru-RU');
        
        const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g) || [];
        sentenceCountEl.textContent = sentences.length.toLocaleString('ru-RU');
        
        const totalWordLength = words.reduce((acc, word) => acc + word.length, 0);
        const avgWordLength = wordCount > 0 ? (totalWordLength / wordCount).toFixed(1) : 0;
        avgWordLengthEl.textContent = avgWordLength;
        
        const avgSentenceLength = sentences.length > 0 ? (wordCount / sentences.length).toFixed(1) : 0;
        avgSentenceLengthEl.textContent = avgSentenceLength;
    }

    // === ОБРАБОТКА ЗАГРУЗКИ ФАЙЛОВ ===
    function handleFile(file) {
        if (!file) return;

        const reader = new FileReader();
        const extension = file.name.split('.').pop().toLowerCase();
        
        textInput.value = `Загрузка файла "${file.name}"...`;
        analyzeText();

        if (extension === 'txt') {
            reader.onload = (e) => {
                textInput.value = e.target.result;
                analyzeText();
            };
            reader.readAsText(file);
        } else if (extension === 'docx') {
            reader.onload = (e) => {
                mammoth.extractRawText({ arrayBuffer: e.target.result })
                    .then(result => {
                        textInput.value = result.value;
                        analyzeText();
                    })
                    .catch(err => {
                        console.error(err);
                        textInput.value = 'Ошибка при чтении файла .docx';
                    });
            };
            reader.readAsArrayBuffer(file);
        } else if (extension === 'pdf') {
            reader.onload = (e) => {
                const loadingTask = pdfjsLib.getDocument({ data: e.target.result });
                loadingTask.promise.then(async (pdf) => {
                    let fullText = '';
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        const pageText = textContent.items.map(item => item.str).join(' ');
                        fullText += pageText + '\n';
                    }
                    textInput.value = fullText;
                    analyzeText();
                }).catch(err => {
                    console.error(err);
                    textInput.value = 'Ошибка при чтении файла .pdf';
                });
            };
            reader.readAsArrayBuffer(file);
        } else {
             textInput.value = `Файлы с расширением .${extension} не поддерживаются.`;
        }
    }

    // === НАЗНАЧЕНИЕ ОБРАБОТЧИКОВ ===
    textInput.addEventListener('input', analyzeText);

    clearBtn.addEventListener('click', () => {
        textInput.value = '';
        fileInput.value = ''; // Сбрасываем инпут файла
        analyzeText();
    });

    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));

    // Drag and Drop
    fileUploadWrapper.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadWrapper.classList.add('dragover');
    });
    fileUploadWrapper.addEventListener('dragleave', () => {
        fileUploadWrapper.classList.remove('dragover');
    });
    fileUploadWrapper.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadWrapper.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        handleFile(file);
    });

    // Инициализация подсказок
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Первоначальный анализ
    analyzeText();
});