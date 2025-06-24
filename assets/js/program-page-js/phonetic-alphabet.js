document.addEventListener('DOMContentLoaded', () => {
    // --- Элементы DOM ---
    const inputText = document.getElementById('inputText');
    const outputContainer = document.getElementById('outputContainer');
    const clearButton = document.getElementById('clearButton');
    const copyButton = document.getElementById('copyButton');
    const copyPanel = document.getElementById('copyPanel');

    // --- Словарь ICAO ---
    const icaoMap = {
        'A': 'Alpha', 'B': 'Bravo', 'C': 'Charlie', 'D': 'Delta', 'E': 'Echo', 'F': 'Foxtrot', 'G': 'Golf', 'H': 'Hotel', 'I': 'India', 'J': 'Juliet', 'K': 'Kilo', 'L': 'Lima', 'M': 'Mike', 'N': 'November', 'O': 'Oscar', 'P': 'Papa', 'Q': 'Quebec', 'R': 'Romeo', 'S': 'Sierra', 'T': 'Tango', 'U': 'Uniform', 'V': 'Victor', 'W': 'Whiskey', 'X': 'X-ray', 'Y': 'Yankee', 'Z': 'Zulu',
        '0': 'Zero', '1': 'One', '2': 'Two', '3': 'Three', '4': 'Four', '5': 'Five', '6': 'Six', '7': 'Seven', '8': 'Eight', '9': 'Nine'
    };
    
    // --- Функция конвертации и отображения ---
    function convertAndDisplay() {
        const text = inputText.value.toUpperCase();
        outputContainer.innerHTML = ''; // Очищаем контейнер
        let fullResultString = '';

        if (text.length === 0) {
            copyPanel.style.display = 'none';
            return;
        }

        const decodedWords = [];

        for (const char of text) {
            const word = icaoMap[char];
            const card = document.createElement('div');
            card.className = 'phonetic-card';

            if (word) {
                card.innerHTML = `<span class="char">${char}</span><span class="word">${word}</span>`;
                decodedWords.push(word);
            } else {
                // Если символ не найден в словаре
                card.innerHTML = `<span class="char char-unknown">${char}</span><span class="word">???</span>`;
                decodedWords.push(char); // Добавляем сам символ
            }
            outputContainer.appendChild(card);
        }

        fullResultString = decodedWords.join(' ');
        copyPanel.style.display = 'block'; // Показываем кнопку копирования
        copyButton.dataset.textToCopy = fullResultString; // Сохраняем результат для копирования
    }

    // --- Обработчики событий ---
    inputText.addEventListener('input', convertAndDisplay);

    clearButton.addEventListener('click', () => {
        inputText.value = '';
        convertAndDisplay();
    });

    copyButton.addEventListener('click', () => {
        const textToCopy = copyButton.dataset.textToCopy;
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = copyButton.innerHTML;
                copyButton.innerHTML = '<i class="fas fa-check"></i> Скопировано!';
                setTimeout(() => {
                    copyButton.innerHTML = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Не удалось скопировать текст: ', err);
            });
        }
    });

});