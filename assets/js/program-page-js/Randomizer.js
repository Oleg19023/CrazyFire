document.addEventListener("DOMContentLoaded", function () {
    // Переключение между генераторами
    document.querySelectorAll(".sidebar a").forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            document.querySelectorAll(".generator").forEach(gen => gen.style.display = "none");
            const targetId = this.id + "Generator";
            document.getElementById(targetId).style.display = "block";
        });
    });

    // Генерация случайных чисел
    document.getElementById("generateNumber").addEventListener("click", function () {
        let min = Math.max(1, parseInt(document.getElementById("min").value));
        let max = Math.min(999999999, parseInt(document.getElementById("max").value));
        let count = Math.min(1000, Math.max(1, parseInt(document.getElementById("count").value)));
        let noRepeats = document.getElementById("noRepeats").checked;
        let sortOrder = document.getElementById("sortOrder").checked;
        let excludeNumbers = document.getElementById("excludeNumbers").checked;
    
        if (isNaN(min) || isNaN(max) || isNaN(count) || min > max) {
            alert("Введите корректные значения!");
            return;
        }
    
        let excludedValues = new Set();
        if (excludeNumbers) {
            document.getElementById("excludedValues").value
                .split(",")
                .map(num => parseInt(num.trim()))
                .filter(num => !isNaN(num))
                .forEach(num => excludedValues.add(num));
        }
    
        let result = new Set();
    
        if (noRepeats) {
            let possibleCount = max - min + 1 - excludedValues.size;
            if (count > possibleCount) {
                alert("Невозможно сгенерировать запрошенное количество чисел без повторов.");
                return;
            }
    
            let availableNumbers = [];
            for (let i = min; i <= max; i++) {
                if (!excludedValues.has(i)) {
                    availableNumbers.push(i);
                }
            }
    
            while (result.size < count) {
                let index = Math.floor(Math.random() * availableNumbers.length);
                result.add(availableNumbers[index]);
                availableNumbers.splice(index, 1);
            }
        } else {
            while (result.size < count) {
                let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
                if (!excludedValues.has(randomNumber)) {
                    result.add(randomNumber);
                }
            }
        }
    
        let finalResult = Array.from(result);
        if (sortOrder) {
            finalResult.sort((a, b) => a - b);
        }
    
        displayResult(finalResult);
    });
    
    function displayResult(numbers) {
        let resultContainer = document.getElementById("numberResult");
        resultContainer.innerHTML = "";
    
        if (numbers.length === 1) {
            resultContainer.textContent = numbers[0];
            resultContainer.style.fontSize = "70px";
        } else {
            numbers.forEach(num => {
                let span = document.createElement("span");
                span.textContent = num + " ";
                resultContainer.appendChild(span);
            });
            resultContainer.style.fontSize = "30px";
        }
    }
    
    // Показать/скрыть поле исключенных чисел
    document.getElementById("excludeNumbers").addEventListener("change", function () {
        document.getElementById("excludeInput").style.display = this.checked ? "block" : "none";
    });

// Генерация случайного пароля
document.getElementById("generatePassword").addEventListener("click", function (event) {
    event.preventDefault();
    
    let length = parseInt(document.getElementById("passwordLength").value);
    let count = parseInt(document.getElementById("passwordCount").value);
    
    if (isNaN(length) || length < 1 || isNaN(count) || count < 1) {
        alert("Введите корректные значения!");
        return;
    }
    
    let characters = "";
    if (document.getElementById("uppercase").checked) characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (document.getElementById("lowercase").checked) characters += "abcdefghijklmnopqrstuvwxyz";
    if (document.getElementById("numbers").checked) characters += "0123456789";
    if (document.getElementById("spaces").checked) characters += " ";
    if (document.getElementById("separators").checked) characters += "-_";
    if (document.getElementById("special").checked) characters += "!#$%&()*+./:;=>?@\\[^`{|}~'";
    
    if (characters.length === 0) {
        alert("Выберите хотя бы один тип символов!");
        return;
    }
    
    let passwords = [];
    for (let i = 0; i < count; i++) {
        let password = "";
        for (let j = 0; j < length; j++) {
            let randomIndex = Math.floor(Math.random() * characters.length);
            password += characters[randomIndex];
        }
        passwords.push(password);
    }
    
    displayPasswords(passwords);
});

function displayPasswords(passwords) {
    let resultContainer = document.getElementById("passwordResult");
    resultContainer.innerHTML = "";

    // Если сгенерирован один пароль
    if (passwords.length === 1) {
        let span = document.createElement("span");
        span.textContent = passwords[0];
        span.classList.add("password-box");

        // Уменьшение шрифта для длинного пароля
        if (passwords[0].length > 30) {
            span.classList.add("very-long-password");
        } else if (passwords[0].length > 20) {
            span.classList.add("long-password");
        } else {
            span.classList.add("single-password");
        }

        resultContainer.appendChild(span);
    } else {
        passwords.forEach(password => {
            let span = document.createElement("span");
            span.textContent = password;
            span.classList.add("password-box");

            // Уменьшение размера для длинных паролей
            if (password.length > 30) {
                span.classList.add("very-long-password");
            } else if (password.length > 20) {
                span.classList.add("long-password");
            }

            resultContainer.appendChild(span);
        });
    }
}
//////////////

});


// Генератор цитат
const quotes = [
    { quote: "Лучший способ предсказать свое будущее — создать его.", author: "Авраам Линкольн" },
    { quote: "Величайшая слава в жизни заключается не в том, чтобы никогда не падать, а в том, чтобы подниматься каждый раз, когда мы падаем.", author: "Нельсон Мандела" },
    { quote: "Единственный способ сделать большую работу — любить то, что ты делаешь.", author: "Стив Джобс" },
    { quote: "Успех не окончателен, неудача не фатальна: важна смелость продолжать.", author: "Уинстон Черчилль" },
    { quote: "Верьте в себя и во все, что вы есть. Знайте, что внутри вас есть нечто большее, чем любое препятствие.", author: "Кристиан Д. Ларсон" },
    { quote: "Самые лучшие и прекрасные вещи в мире нельзя увидеть и даже потрогать — их нужно чувствовать сердцем.", author: "Хелен Келлер" },
    { quote: "Единственным ограничением нашей реализации завтрашнего дня будут наши сегодняшние сомнения.", author: "Франклин Д. Рузвельт" },
    { quote: "Если вы хотите жить счастливой жизнью, привяжите её к цели, а не к людям или вещам.", author: "Альберт Эйнштейн" },
    { quote: "Будьте собой, все остальные роли уже заняты.", author: "Оскар Уайльд" },
    { quote: "Секрет успеха в том, чтобы начать.", author: "Марк Твен" },
    { quote: "Ваше время ограничено, не тратьте его, живя чужой жизнью.", author: "Стив Джобс" },
    { quote: "Вы становитесь тем, о чем думаете большую часть времени.", author: "Эрл Найтингейл" },
    { quote: "Каждое великое достижение начинается с решения попробовать.", author: "Неизвестный автор" },
    { quote: "Жизнь — это 10% того, что с нами происходит, и 90% того, как мы на это реагируем.", author: "Чарльз Свиндолл" },
    { quote: "Мечтайте, словно будете жить вечно, живите, словно умрёте сегодня.", author: "Джеймс Дин" },
    { quote: "Не важно, как медленно ты идёшь, главное — не останавливаться.", author: "Конфуций" },
    { quote: "Падайте семь раз, поднимайтесь восемь.", author: "Японская пословица" },
    { quote: "Делайте то, что можете, с тем, что имеете, там, где вы есть.", author: "Теодор Рузвельт" },
    { quote: "Чем больше вы учитесь, тем больше зарабатываете.", author: "Уоррен Баффет" },
    { quote: "Мы то, что постоянно делаем. Следовательно, совершенство — это не действие, а привычка.", author: "Аристотель" },
    { quote: "Пока ты не сдаешься, ты сильнее своей судьбы.", author: "Неизвестный автор" },
    { quote: "Проблемы — это не стоп-сигналы, а указатели на пути к успеху.", author: "Роберт Шуллер" },
    { quote: "Чтобы достичь успеха, перестаньте спрашивать разрешения.", author: "Неизвестный автор" },
    { quote: "Живите с мечтой, иначе будете работать на того, кто живёт с ней.", author: "Фаррах Грей" },
    { quote: "Лучший способ добиться успеха — действовать прямо сейчас.", author: "Неизвестный автор" },
    { quote: "Сложные дороги часто ведут к красивым местам.", author: "Неизвестный автор" },
    { quote: "Мы видим вещи не такими, какие они есть, а такими, какие мы есть.", author: "Анаис Нин" }
];

const quoteElement = document.getElementById("quote");
const authorElement = document.getElementById("author");
const newQuoteButton = document.getElementById("new-quote");

function setRandomQuote() {
    const { quote, author } = quotes[Math.floor(Math.random() * quotes.length)];
    quoteElement.innerText = quote;
    authorElement.innerText = author;
}

setRandomQuote();

newQuoteButton.addEventListener("click", setRandomQuote)
////////////


// Жребий орел или решка
document.getElementById("flipCoin").addEventListener("click", function () {
    const coinImage = document.getElementById("coinImage");
    const coinResult = document.getElementById("coinResult");

    // Убираем все предыдущие трансформации
    coinImage.style.transition = "none"; // Отключаем переход
    coinImage.style.transform = "rotateY(0deg)"; // Сбрасываем угол вращения

    // Используем requestAnimationFrame для запуска анимации
    requestAnimationFrame(() => {
        // Запускаем анимацию вращения
        coinImage.style.transition = "transform 1s ease-in-out"; // Включаем переход
        coinImage.style.transform = "rotateY(360deg)"; // Вращаем монету

        // Задержка для ожидания окончания анимации
        setTimeout(() => {
            const isHeads = Math.random() < 0.5;
            coinImage.src = isHeads ? "/assets/images/Program-pages/Orel_or_reshka/heads.png" : "/assets/images/Program-pages/Orel_or_reshka/tails.png"; // Меняем картинку
            coinResult.textContent = isHeads ? "Орёл!" : "Решка!";
        }, 1000); // Меняем изображение после анимации
    });
});
/////////////////////



// Генератор ключей для Steam
document.getElementById("steamKey").addEventListener("click", function () {
    document.getElementById("steamKeyGenerator").style.display = "block";
});

document.getElementById("generateSteamKeys").addEventListener("click", function () {
    const count = Math.min(Math.max(parseInt(document.getElementById("keyCount").value) || 1, 1), 10000);
    const keys = generateSteamKeys(count);
    document.getElementById("steamKeyResult").innerHTML = keys.join("<br>"); // Вывод ключей на страницу
});

function generateSteamKeys(count) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const keys = [];
    const segments = [5, 5, 5]; // Формат ключа: 5-5-5

    for (let i = 0; i < count; i++) {
        let key = "";
        for (let j = 0; j < segments.length; j++) {
            for (let k = 0; k < segments[j]; k++) {
                key += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            if (j < segments.length - 1) key += '-'; // Добавляем дефис между сегментами
        }
        keys.push(key);
    }
    return keys;
}








// Генератор случайных фото
document.getElementById('randomPhoto').addEventListener('click', function() {
    showGenerator('randomPhotoGenerator');
});

let currentPhotoUrl = '';
let previousPhotoUrl = '';
let currentPhotoId = '';

document.getElementById('getRandomPhoto').addEventListener('click', function() {
    getRandomPhoto();
});

document.getElementById('downloadPhoto').addEventListener('click', function() {
    if(currentPhotoUrl) {
        const a = document.createElement('a');
        a.href = currentPhotoUrl;
        a.download = `random-photo-${currentPhotoId}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
});

document.getElementById('prevPhoto').addEventListener('click', function() {
    if(previousPhotoUrl) {
        // Сохраняем текущее фото во временную переменную
        const tempUrl = currentPhotoUrl;
        const tempId = currentPhotoId;
        
        // Устанавливаем предыдущее фото
        document.getElementById('randomImage').src = previousPhotoUrl;
        currentPhotoUrl = previousPhotoUrl;
        currentPhotoId = previousPhotoId;
        
        // Обновляем предыдущее фото
        previousPhotoUrl = tempUrl;
        previousPhotoId = tempId;
        
        // Обновляем кнопки
        document.getElementById('downloadPhoto').disabled = false;
        document.getElementById('prevPhoto').disabled = !previousPhotoUrl;
        
        // Показываем информацию о фото
        document.getElementById('photoInfo').textContent = `ID фото: ${currentPhotoId}`;
    }
});

function getRandomPhoto() {
    const loadingElement = document.getElementById('loading');
    const imageElement = document.getElementById('randomImage');
    
    // Показываем индикатор загрузки
    loadingElement.style.display = 'block';
    imageElement.style.display = 'none';
    
    // Сохраняем текущее фото как предыдущее
    if(currentPhotoUrl) {
        previousPhotoUrl = currentPhotoUrl;
        previousPhotoId = currentPhotoId;
    }
    
    // Генерируем случайный ID для фото (можно использовать другие API)
    currentPhotoId = Math.floor(Math.random() * 1000);
    currentPhotoUrl = `https://picsum.photos/id/${currentPhotoId}/800/600`;
    
    // Загружаем новое фото
    imageElement.onload = function() {
        loadingElement.style.display = 'none';
        imageElement.style.display = 'block';
        document.getElementById('downloadPhoto').disabled = false;
        document.getElementById('prevPhoto').disabled = !previousPhotoUrl;
        document.getElementById('photoInfo').textContent = `ID фото: ${currentPhotoId}`;
    };
    
    imageElement.onerror = function() {
        // Если фото не загрузилось, пробуем снова
        getRandomPhoto();
    };
    
    imageElement.src = currentPhotoUrl;
}

// Функция для показа выбранного генератора
function showGenerator(generatorId) {
    // Скрываем все генераторы
    document.querySelectorAll('.generator').forEach(el => {
        el.style.display = 'none';
    });
    
    // Показываем выбранный генератор
    document.getElementById(generatorId).style.display = 'block';
    
    // Если это генератор фото, загружаем первое фото
    if(generatorId === 'randomPhotoGenerator' && !currentPhotoUrl) {
        getRandomPhoto();
    }
}








// КОЛЕСО ФОРТУНЫ // 

// Колесо Фортуны - Финальная версия
document.getElementById('wheelOfFortune').addEventListener('click', function() {
    showGenerator('wheelOfFortuneGenerator');
    initWheel();
});

let wheel;
let isSpinning = false;
let currentItems = [];
let eliminatedItems = [];
let wheelColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#8AC24A', '#FF5722', '#607D8B', '#9C27B0'];
let currentRotation = 0;

function initWheel() {
    const canvas = document.getElementById('wheelCanvas');
    const size = Math.min(window.innerWidth * 0.8, 500);
    canvas.width = size;
    canvas.height = size;
    
    const ctx = canvas.getContext('2d');
    wheel = { canvas, ctx };
    
    updateWheelItems();
    
    // Автоматическое обновление при изменении текста
    const wheelItemsTextarea = document.getElementById('wheelItems');
    wheelItemsTextarea.addEventListener('input', function() {
        if (!isSpinning) {
            updateWheelItems();
        }
    });
    
    // Блокировка textarea во время вращения
    wheelItemsTextarea.addEventListener('keydown', function(e) {
        if (isSpinning) {
            e.preventDefault();
        }
    });
    
    document.getElementById('spinButton').addEventListener('click', spinWheel);
    document.getElementById('clearHistory').addEventListener('click', clearHistory);
    
    // Обработка изменения времени прокрутки
    document.getElementById('spinTime').addEventListener('change', function() {
        const value = parseInt(this.value);
        if (value > 180) this.value = 180;
        if (value < 1) this.value = 1;
    });
    
    // Обработка клавиши пробела
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space' && !isSpinning && 
            document.getElementById('wheelOfFortuneGenerator').style.display !== 'none') {
            spinWheel();
            e.preventDefault();
        }
    });
    
    // Обработка ресайза
    window.addEventListener('resize', function() {
        const size = Math.min(window.innerWidth * 0.8, 500);
        canvas.width = size;
        canvas.height = size;
        drawWheel();
    });
}

function updateWheelItems() {
    const text = document.getElementById('wheelItems').value;
    currentItems = text.split('\n').filter(item => item.trim() !== '');
    localStorage.setItem('wheelItems', text);
    
    const colorsText = document.getElementById('wheelColors').value;
    wheelColors = colorsText.split(',').map(c => c.trim()).filter(c => c !== '');
    localStorage.setItem('wheelColors', colorsText);
    
    drawWheel();
}

function drawWheel() {
    const { ctx, canvas } = wheel;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 30;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 1. Сначала рисуем колесо
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(currentRotation * Math.PI / 180);
    ctx.translate(-centerX, -centerY);
    
    if (currentItems.length === 0) {
        ctx.font = '20px Arial';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.fillText('Добавьте варианты', centerX, centerY);
        ctx.restore();
        return;
    }
    
    const arc = (2 * Math.PI) / currentItems.length;
    
    currentItems.forEach((item, i) => {
        const angle = i * arc;
        const color = wheelColors[i % wheelColors.length];
        
        // Сектор
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, angle, angle + arc);
        ctx.closePath();
        ctx.fill();
        
        // Текст
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle + arc / 2);
        ctx.textAlign = 'left';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold ' + Math.max(12, radius/10) + 'px Arial';
        ctx.fillText(item, radius / 2, 5);
        ctx.restore();
    });
    
    // Центр колеса
    ctx.beginPath();
    ctx.fillStyle = '#fff';
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 5;
    ctx.stroke();
    
    ctx.restore();
    
    // 2. Затем рисуем стрелку ПОВЕРХ колеса (справа)
    drawArrow(ctx, canvas.width - 20, centerY);
}

function drawArrow(ctx, x, y) {
    // Яркая стрелка справа (указывает влево)
    ctx.beginPath();
    ctx.moveTo(x, y - 20);     // Верхняя точка
    ctx.lineTo(x, y + 20);     // Нижняя точка
    ctx.lineTo(x - 30, y);     // Центральная точка (острие)
    ctx.closePath();
    
    // Стиль стрелки
    ctx.fillStyle = '#FF0000'; // Красный цвет
    ctx.fill();
    ctx.strokeStyle = '#FFF';  // Белая обводка
    ctx.lineWidth = 2;
    ctx.stroke();
}

function spinWheel() {
    if (isSpinning || currentItems.length === 0) return;
    
    isSpinning = true;
    const spinButton = document.getElementById('spinButton');
    const wheelItemsTextarea = document.getElementById('wheelItems');
    
    spinButton.textContent = '...';
    spinButton.style.pointerEvents = 'none';
    wheelItemsTextarea.readOnly = true;
    
    const spinTime = parseInt(document.getElementById('spinTime').value) * 1000;
    const mode = document.getElementById('wheelMode').value;
    
    // Всегда вращаем вправо (по часовой)
    const targetRotation = currentRotation + 360 * 5 + Math.floor(Math.random() * 360);
    
    let startTime = null;
    let startRotation = currentRotation;
    
    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / spinTime, 1);
        
        const easeProgress = easeOutCubic(progress);
        currentRotation = startRotation + easeProgress * (targetRotation - startRotation);
        
        drawWheel();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            finishSpin();
        }
    }
    
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    function finishSpin() {
        // Правильный расчет для стрелки сверху (0°)
        // При вращении по часовой стрелке (угол увеличивается)
        const normalizedAngle = currentRotation % 360;
        const sectorAngle = 360 / currentItems.length;
        
        // Формула для определения индекса под стрелкой:
        const selectedIndex = (currentItems.length - Math.floor(normalizedAngle / sectorAngle) - 1) % currentItems.length;
        const selectedItem = currentItems[selectedIndex];
        
        // Отладка (можно удалить после проверки)
        console.log(`Угол: ${normalizedAngle}°, Сектор: ${sectorAngle}°, Индекс: ${selectedIndex}, Выбран: ${selectedItem}`);
        
        if (mode === 'elimination') {
            eliminatedItems.push(selectedItem);
            currentItems = currentItems.filter(item => !eliminatedItems.includes(item));
            document.getElementById('wheelItems').value = currentItems.join('\n');
        }
        
        addToHistory(selectedItem, mode === 'elimination' && currentItems.length > 0);
        
        isSpinning = false;
        spinButton.textContent = 'Крутить!';
        spinButton.style.pointerEvents = 'auto';
        wheelItemsTextarea.readOnly = false;
        
        if (mode === 'elimination') {
            drawWheel();
        }
    }
    
    requestAnimationFrame(animate);
}

function addToHistory(item, isElimination) {
    const historyElement = document.getElementById('wheelHistory');
    const resultItem = document.createElement('div');
    resultItem.className = `result-item ${isElimination ? 'eliminated' : ''}`;
    
    const date = new Date();
    const timeString = date.toLocaleTimeString();
    
    resultItem.innerHTML = `
        <span>${item}</span>
        <small>${timeString}</small>
    `;
    
    historyElement.insertBefore(resultItem, historyElement.firstChild);
    localStorage.setItem('wheelHistory', historyElement.innerHTML);
}

function clearHistory() {
    document.getElementById('wheelHistory').innerHTML = '';
    eliminatedItems = [];
    localStorage.removeItem('wheelHistory');
}

function showGenerator(generatorId) {
    document.querySelectorAll('.generator').forEach(el => {
        el.style.display = 'none';
    });
    document.getElementById(generatorId).style.display = 'block';
}

// Скачивание истории
document.getElementById('downloadHistory').addEventListener('click', function() {
    const historyItems = document.querySelectorAll('#wheelHistory .result-item');
    let txtContent = '<CRAZYFIRE> Результаты Колеса Фортуны\n\n';
    
    historyItems.forEach(item => {
        txtContent += `${item.querySelector('span').textContent} - ${item.querySelector('small').textContent}\n`;
    });
    
    const blob = new Blob([txtContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wheel_results_${new Date().toLocaleDateString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});


// Создание цветовых пикеров
function updateColorPickers() {
    const container = document.getElementById('colorPickers');
    container.innerHTML = '';
    const colors = document.getElementById('wheelColors').value.split(',');
    
    colors.forEach((color, i) => {
        const picker = document.createElement('input');
        picker.type = 'color';
        picker.value = color.trim();
        picker.className = 'form-control form-control-color';
        picker.style.width = '40px';
        picker.addEventListener('input', function() {
            const colors = document.getElementById('wheelColors').value.split(',');
            colors[i] = this.value;
            document.getElementById('wheelColors').value = colors.join(',');
            updateWheelItems();
        });
        container.appendChild(picker);
    });
}

// Вызовите эту функцию в initWheel после добавления обработчиков событий
updateColorPickers();


// Загрузка сохраненных данных
if (localStorage.getItem('wheelItems')) {
    document.getElementById('wheelItems').value = localStorage.getItem('wheelItems');
}
if (localStorage.getItem('wheelColors')) {
    document.getElementById('wheelColors').value = localStorage.getItem('wheelColors');
    updateColorPickers();
}
if (localStorage.getItem('wheelHistory')) {
    document.getElementById('wheelHistory').innerHTML = localStorage.getItem('wheelHistory');
}