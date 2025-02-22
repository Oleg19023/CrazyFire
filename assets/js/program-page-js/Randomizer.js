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


