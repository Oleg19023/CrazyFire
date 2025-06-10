document.addEventListener("DOMContentLoaded", function () {

    // -------------------------------------------------------------------
    // 1. ОБЩАЯ ЛОГИКА: Переключение между генераторами
    // -------------------------------------------------------------------
    document.querySelectorAll(".sidebar a").forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            // Скрываем все генераторы
            document.querySelectorAll(".generator").forEach(gen => {
                gen.style.display = "none";
            });
            // Показываем нужный (если он существует)
            const targetId = this.id + "Generator";
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.style.display = "block";
            }
        });
    });

    // -------------------------------------------------------------------
    // 2. ГЕНЕРАТОР СЛУЧАЙНЫХ ЧИСЕЛ
    // -------------------------------------------------------------------
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
            let possibleValues = [];
            for (let i = min; i <= max; i++) {
                if (!excludedValues.has(i)) {
                    possibleValues.push(i);
                }
            }
            if (count > possibleValues.length) {
                alert("Невозможно сгенерировать запрошенное количество уникальных чисел в заданном диапазоне с учетом исключений.");
                return;
            }
            while (result.size < count) {
                let randomIndex = Math.floor(Math.random() * possibleValues.length);
                result.add(possibleValues[randomIndex]);
                possibleValues.splice(randomIndex, 1);
            }
        } else {
            let numbers = [];
            while (numbers.length < count) {
                let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
                if (!excludedValues.has(randomNumber)) {
                    numbers.push(randomNumber);
                }
            }
            result = numbers;
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
                span.textContent = num;
                resultContainer.appendChild(span);
            });
            resultContainer.style.fontSize = "30px";
        }
    }
    
    document.getElementById("excludeNumbers").addEventListener("change", function () {
        document.getElementById("excludeInput").style.display = this.checked ? "block" : "none";
    });

    // -------------------------------------------------------------------
    // 3. ГЕНЕРАТОР ПАРОЛЕЙ
    // -------------------------------------------------------------------
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
        passwords.forEach(password => {
            let span = document.createElement("span");
            span.textContent = password;
            span.classList.add("password-box");

            if (password.length > 30) {
                span.classList.add("very-long-password");
            } else if (password.length > 20) {
                span.classList.add("long-password");
            }
            resultContainer.appendChild(span);
        });
    }

    // -------------------------------------------------------------------
    // 4. ГЕНЕРАТОР ЦИТАТ
    // -------------------------------------------------------------------
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
                quoteElement.innerText = `"${quote}"`;
                authorElement.innerText = `— ${author}`;
            }

            setRandomQuote();
            newQuoteButton.addEventListener("click", setRandomQuote);


    // -------------------------------------------------------------------
    // 5. ОРЕЛ ИЛИ РЕШКА
    // -------------------------------------------------------------------
    let flipCount = 0;
    const flipCountElement = document.getElementById("flipCount");
    const coinContainer = document.getElementById("coinContainer");
    const coinResultElement = document.getElementById("coinResult");
    let isFlipping = false;

    document.getElementById("flipCoin").addEventListener("click", function () {
        if (isFlipping) return;
        isFlipping = true;

        const amount = parseInt(document.getElementById("coinAmount").value);
        const type = document.getElementById("coinType").value;
        
        flipCount++;
        flipCountElement.textContent = flipCount;

        coinContainer.innerHTML = "";
        coinResultElement.textContent = "Бросаем...";

        let headsCount = 0;
        let tailsCount = 0;
        
        for (let i = 0; i < amount; i++) {
            const isHeads = Math.random() < 0.5;
            if (isHeads) headsCount++;
            else tailsCount++;

            if (type === "word") {
                // Режим "Слово" остается без изменений
                const wordElement = document.createElement("div");
                wordElement.className = "coin-word-item";
                wordElement.textContent = isHeads ? "Орёл" : "Решка";
                coinContainer.appendChild(wordElement);
            } else {
                // 1. Создаем НОВУЮ структуру монеты
                const coinDiv = document.createElement('div');
                coinDiv.className = 'coin';

                const innerDiv = document.createElement('div');
                innerDiv.className = 'coin__inner';

                const frontImg = document.createElement('img');
                frontImg.className = 'coin__side coin__side--front';
                frontImg.src = `/assets/images/Program-pages/Orel_or_reshka/${type}/heads.png`;
                frontImg.alt = 'Орёл';

                const backImg = document.createElement('img');
                backImg.className = 'coin__side coin__side--back';
                backImg.src = `/assets/images/Program-pages/Orel_or_reshka/${type}/tails.png`;
                backImg.alt = 'Решка';
                
                innerDiv.append(frontImg, backImg);
                coinDiv.appendChild(innerDiv);
                coinContainer.appendChild(coinDiv);

                // 2. Добавляем классы для запуска нужной анимации
                // Добавляем с небольшой задержкой, чтобы браузер успел отрисовать монету
                setTimeout(() => {
                    coinDiv.classList.add('is-flipping');
                    if (!isHeads) { // Если выпала решка
                        coinDiv.classList.add('show-tails');
                    }
                }, 10 + (i * 50)); // Небольшая задержка + разносим старт для каждой монеты
            }
        }
        
        // 3. ПОСЛЕ анимации показываем финальный результат
        const animationDuration = 1200;
        setTimeout(() => {
            if (amount === 1 && type !== 'word') {
                coinResultElement.textContent = `Выпал ${headsCount > 0 ? 'орёл' : 'решка'}!`;
            } else if (type !== 'word') {
                coinResultElement.textContent = `Результат: ${headsCount} орлов, ${tailsCount} решек.`;
            }
            // Для типа "Слово" текст не нужен, так как он уже виден
            
            isFlipping = false;
        }, animationDuration + (amount * 50)); // Учитываем задержки
    });

    document.getElementById("resetFlipCount").addEventListener("click", function(e) {
        e.preventDefault();
        flipCount = 0;
        flipCountElement.textContent = flipCount;
    });


    // -------------------------------------------------------------------
    // 6. ГЕНЕРАТОР КЛЮЧЕЙ STEAM
    // -------------------------------------------------------------------
    document.getElementById("generateSteamKeys").addEventListener("click", function () {
        const count = Math.min(Math.max(parseInt(document.getElementById("keyCount").value) || 1, 1), 10000);
        const keys = generateSteamKeys(count);
        document.getElementById("steamKeyResult").innerHTML = keys.join("<br>");
    });

    function generateSteamKeys(count) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const keys = [];
        for (let i = 0; i < count; i++) {
            let key = "";
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 5; k++) {
                    key += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                if (j < 2) key += '-';
            }
            keys.push(key);
        }
        return keys;
    }



    // -------------------------------------------------------------------
    // 7. ГЕНЕРАТОР СЛУЧАЙНЫХ ФОТО
    // -------------------------------------------------------------------
    let currentPhotoUrl = '';
    let previousPhotoUrl = '';
    let currentPhotoId = '';
    let previousPhotoId = '';

    document.getElementById('getRandomPhoto').addEventListener('click', () => getRandomPhoto());
    document.getElementById('downloadPhoto').addEventListener('click', downloadPhoto);
    document.getElementById('prevPhoto').addEventListener('click', showPreviousPhoto);

    function getRandomPhoto(retries = 5) {
        if (retries <= 0) {
            document.getElementById('loading').textContent = 'Ошибка загрузки фото. Попробуйте снова.';
            document.getElementById('loading').style.display = 'block';
            return;
        }

        const loadingElement = document.getElementById('loading');
        const imageElement = document.getElementById('randomImage');
        
        loadingElement.textContent = 'Загрузка...';
        loadingElement.style.display = 'block';
        imageElement.style.display = 'none';
        
        if (currentPhotoUrl) {
            previousPhotoUrl = currentPhotoUrl;
            previousPhotoId = currentPhotoId;
        }
        
        currentPhotoId = Math.floor(Math.random() * 1000);
        currentPhotoUrl = `https://picsum.photos/id/${currentPhotoId}/800/600`;
        
        imageElement.onload = function() {
            loadingElement.style.display = 'none';
            imageElement.style.display = 'block';
            document.getElementById('downloadPhoto').disabled = false;
            document.getElementById('prevPhoto').disabled = !previousPhotoUrl;
            document.getElementById('photoInfo').textContent = `ID фото: ${currentPhotoId}`;
        };
        
        imageElement.onerror = function() {
            getRandomPhoto(retries - 1);
        };
        
        imageElement.src = currentPhotoUrl;
    }

    function downloadPhoto() {
        if (currentPhotoUrl) {
            const a = document.createElement('a');
            a.href = currentPhotoUrl;
            a.download = `random-photo-${currentPhotoId}.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }

    function showPreviousPhoto() {
        if (previousPhotoUrl) {
            const tempUrl = currentPhotoUrl;
            const tempId = currentPhotoId;
            
            document.getElementById('randomImage').src = previousPhotoUrl;
            currentPhotoUrl = previousPhotoUrl;
            currentPhotoId = previousPhotoId;
            
            previousPhotoUrl = tempUrl;
            previousPhotoId = tempId;
            
            document.getElementById('downloadPhoto').disabled = false;
            document.getElementById('prevPhoto').disabled = !previousPhotoUrl;
            document.getElementById('photoInfo').textContent = `ID фото: ${currentPhotoId}`;
        }
    }
    
    if (document.getElementById('randomPhotoGenerator').style.display !== 'none' && !currentPhotoUrl) {
        getRandomPhoto();
    }


        // -------------------------------------------------------------------
        // 8. КОЛЕСО ФОРТУНЫ
        // -------------------------------------------------------------------
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



        // -------------------------------------------------------------------
        // 9. ГЕНЕРАТОР ПАЛИТРЫ
        // -------------------------------------------------------------------
        const paletteContainer = document.querySelector('#paletteGenerator .color-picker-container');

        // Вспомогательная функция для конвертации RGB в CMYK
        function rgbToCmyk(r, g, b) {
            let c = 1 - (r / 255);
            let m = 1 - (g / 255);
            let y = 1 - (b / 255);
            let k = Math.min(c, m, y);
            
            if (k === 1) {
                return [0, 0, 0, 100];
            }
            
            c = Math.round(((c - k) / (1 - k)) * 100);
            m = Math.round(((m - k) / (1 - k)) * 100);
            y = Math.round(((y - k) / (1 - k)) * 100);
            k = Math.round(k * 100);
            
            return `${c}%, ${m}%, ${y}%, ${k}%`;
        }

        // Инициализация палитры Pickr
        const pickr = Pickr.create({
            el: paletteContainer,
            theme: 'monolith', // Тема, похожая на ваш скриншот
            default: '#FFAA00', // Стартовый цвет
            
            // Показываем палитру всегда, не по клику
            showAlways: true,
            inline: true,
            
            // Настраиваем компоненты
            components: {
                preview: true,
                opacity: false, // Отключаем прозрачность
                hue: true,
                interaction: {
                    hex: true,
                    rgba: false,
                    hsla: false,
                    hsva: false,
                    cmyk: false,
                    input: true, // Поле для ввода HEX
                    clear: false,
                    save: false
                }
            }
        });

        // Находим элементы для вывода значений
        const hexVal = document.getElementById('palette-hex-value');
        const rgbVal = document.getElementById('palette-rgb-value');
        const cmykVal = document.getElementById('palette-cmyk-value');
        const hsvVal = document.getElementById('palette-hsv-value');
        const hslVal = document.getElementById('palette-hsl-value');
        const copyBtn = document.getElementById('copy-hex');

        // Функция для обновления всех полей
        function updateColorValues(color) {
            const rgba = color.toRGBA();
            const hsva = color.toHSVA();
            const hsla = color.toHSLA();

            // HEX
            hexVal.textContent = color.toHEXA().toString(0);
            // RGB
            rgbVal.textContent = `${Math.round(rgba[0])}, ${Math.round(rgba[1])}, ${Math.round(rgba[2])}`;
            // CMYK
            cmykVal.textContent = rgbToCmyk(rgba[0], rgba[1], rgba[2]);
            // HSV
            hsvVal.textContent = `${Math.round(hsva[0])}°, ${Math.round(hsva[1])}%, ${Math.round(hsva[2])}%`;
            // HSL
            hslVal.textContent = `${Math.round(hsla[0])}°, ${Math.round(hsla[1])}%, ${Math.round(hsla[2])}%`;
        }

        // Обновляем значения при изменении цвета
        pickr.on('change', (color, source, instance) => {
            updateColorValues(color);
        });

        // Копирование HEX в буфер обмена
        copyBtn.addEventListener('click', () => {
            const hexToCopy = pickr.getColor().toHEXA().toString(0);
            navigator.clipboard.writeText(hexToCopy).then(() => {
                // Можно добавить уведомление об успешном копировании
                const originalText = copyBtn.className;
                copyBtn.className = 'fas fa-check-circle copy-icon';
                setTimeout(() => {
                copyBtn.className = originalText;
                }, 1500);
            }).catch(err => {
                console.error('Ошибка копирования: ', err);
            });
        });

        // Инициализируем значения при загрузке
        updateColorValues(pickr.getColor());
        
        
        // -------------------------------------------------------------------
        // 10. ГЕНЕРАТОР "ИГРАЛЬНАЯ КОСТЬ"
        // -------------------------------------------------------------------

        const diceContainer = document.getElementById('dice-container');
        const rollBtn = document.getElementById('roll-dice');
        const clearBtn = document.getElementById('clear-dice');
        const totalDisplay = document.getElementById('dice-total');
        const trayButtons = document.querySelectorAll('.dice-tray-btn');
        const addCustomDieBtn = document.getElementById('add-custom-die');

        let activeDice = [];
        let isRolling = false;

        // Функция для создания SVG кости
        function createDieSVG(sides, value = '') {
            const shapes = {
                4: `<svg class="die-svg die-d4" viewBox="0 0 100 100"><path d="M50 10 L90 80 L10 80 Z"></path><text x="50" y="60" class="die-text">${value}</text></svg>`,
                6: `<svg class="die-svg die-d6" viewBox="0 0 100 100"><path d="M15 15 H85 V85 H15 Z"></path><text x="50" y="52" class="die-text">${value}</text></svg>`,
                8: `<svg class="die-svg die-d8" viewBox="0 0 100 100"><path d="M50 10 L90 50 L50 90 L10 50 Z"></path><text x="50" y="52" class="die-text">${value}</text></svg>`,
                10: `<svg class="die-svg die-d10" viewBox="0 0 100 100"><path d="M50 10 L90 40 L80 90 L20 90 L10 40 Z"></path><text x="50" y="58" class="die-text">${value}</text></svg>`,
                12: `<svg class="die-svg die-d12" viewBox="0 0 100 100"><path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z"></path><text x="50" y="52" class="die-text">${value}</text></svg>`,
                20: `<svg class="die-svg die-d20" viewBox="0 0 100 100"><path d="M50 10 L20 35 L20 65 L50 90 L80 65 L80 35 Z"></path><text x="50" y="52" class="die-text">${value}</text></svg>`,
            };
            return shapes[sides] || `<svg class="die-svg die-d-custom" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40"></circle><text x="50" y="52" class="die-text">${value}</text></svg>`;
        }

        // Отрисовка всех костей на поле
        function renderDice() {
            diceContainer.innerHTML = '';
            activeDice.forEach((die, index) => {
                const dieEl = document.createElement('div');
                dieEl.className = 'die-instance';
                dieEl.dataset.index = index;
                dieEl.innerHTML = createDieSVG(die.sides, die.value);
                diceContainer.appendChild(dieEl);
            });
        }

        // Добавление кости
        function addDie(sides) {
            if (activeDice.length >= 20) { // Ограничение на количество
                alert('Слишком много костей на поле!');
                return;
            }
            activeDice.push({ sides: sides, value: '' });
            renderDice();
        }

        // Бросок костей
        rollBtn.addEventListener('click', () => {
            if (isRolling || activeDice.length === 0) return;
            isRolling = true;

            let currentTotal = 0;
            const dieElements = diceContainer.querySelectorAll('.die-instance');
            
            activeDice.forEach((die, index) => {
                const rollValue = Math.floor(Math.random() * die.sides) + 1;
                die.value = rollValue;
                currentTotal += rollValue;
                
                const dieEl = dieElements[index];
                dieEl.innerHTML = createDieSVG(die.sides, die.value); // Обновляем с числом
                dieEl.classList.add('is-rolling');
            });
            
            totalDisplay.textContent = currentTotal;

            setTimeout(() => {
                isRolling = false;
                dieElements.forEach(el => el.classList.remove('is-rolling'));
            }, 1000); // Длительность анимации
        });

        // Добавление стандартных костей
        trayButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sides = e.currentTarget.dataset.sides;
                if (sides) {
                    addDie(parseInt(sides));
                }
            });
        });

        // Добавление кастомной кости
        addCustomDieBtn.addEventListener('click', () => {
            const sides = prompt('Введите количество граней:', '100');
            const numSides = parseInt(sides);
            if (numSides && numSides > 1 && numSides <= 1000) {
                addDie(numSides);
            } else if (sides !== null) {
                alert('Пожалуйста, введите число от 2 до 1000.');
            }
        });

        // Очистка поля
        clearBtn.addEventListener('click', () => {
            activeDice = [];
            totalDisplay.textContent = '0';
            renderDice();
        });

        // Удаление кости по клику на неё
        diceContainer.addEventListener('click', (e) => {
            const dieEl = e.target.closest('.die-instance');
            if (dieEl) {
                const index = parseInt(dieEl.dataset.index);
                activeDice.splice(index, 1);
                renderDice();
            }
        });

});