
// Подключаем библиотеку CryptoJS
const script = document.createElement('script');
script.src = "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js";
document.head.appendChild(script);

// Зашифрованные логин и пароль
const encryptedData = "U2FsdGVkX18tBuumxleBR+6lmaHg4Daw7DjvKALyIM31LvW4IkDVbP5bpNhEI0gv6RtQ1T0NVD7hvM6xCQTdYw=="; // Замените на ваши зашифрованные данные
const encryptionKey = "strongSecretKey"; // Секретный ключ для шифрования

// Функция расшифровки
function decryptData(encrypted, key) {
    const bytes = CryptoJS.AES.decrypt(encrypted, key);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

// Получаем расшифрованные данные
let storedUsername = '';
let storedPassword = '';
script.onload = () => {
    const data = decryptData(encryptedData, encryptionKey);
    storedUsername = data.username;
    storedPassword = data.password;

    init(); // Инициализация, после загрузки библиотеки
};

// Инициализация
function init() {
    document.getElementById('showLoginForm').addEventListener('click', () => {
        document.getElementById('loginForm').style.display = 'block';
    });

    document.getElementById('loginButton').addEventListener('click', () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === storedUsername && password === storedPassword) {
            // Меняем сообщение о доступе
            const accessStatus = document.getElementById('accessStatus');
            accessStatus.textContent = 'Доступ дозволено!';
            accessStatus.classList.remove('text-red');
            accessStatus.classList.add('text-green');

            // Скрываем форму входа и кнопку входа
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('showLoginForm').style.display = 'none';

            // Показываем меню администратора
            document.getElementById('adminMenu').style.display = 'block';

            // Привязываем действия к кнопкам
            initAdminActions();
        } else {
            document.getElementById('loginStatus').style.display = 'block';
        }
    });

    // Обработчик для кнопки Вийти з системи
    document.getElementById('logoutButton').addEventListener('click', () => {
        // Скрываем меню администратора
        document.getElementById('adminMenu').style.display = 'none';

        // Показываем кнопку входа и форму входа
        document.getElementById('showLoginForm').style.display = 'block';
        document.getElementById('accessStatus').textContent = 'Доступ заблоковано!';
        document.getElementById('accessStatus').classList.remove('text-green');
        document.getElementById('accessStatus').classList.add('text-red');

        // Скрываем форму настроек
        document.getElementById('loginForm').style.display = 'none';
    });
}

function initAdminActions() {
    document.getElementById('backupDatabase').addEventListener('click', () => {
        alert('Резервне копіювання бази даних виконано!');
    });

    document.getElementById('restoreDatabase').addEventListener('click', () => {
        alert('Відновлення бази даних завершено.');
    });

    document.getElementById('clearCache').addEventListener('click', () => {
        alert('Кеш успішно очищено.');
    });

    document.getElementById('sendNotifications').addEventListener('click', () => {
        alert('Повідомлення надіслано всім користувачам.');
    });

    document.getElementById('saveSettings').addEventListener('click', (event) => {
        event.preventDefault();

        // Получаем данные из формы настроек
        const siteTitle = document.getElementById('siteTitle').value;
        const language = document.getElementById('languageSelect').value;
        const notificationsEnabled = document.getElementById('notificationsToggle').checked;
        const contactEmail = document.getElementById('contactEmail').value;
        const contactPhone = document.getElementById('contactPhone').value;
        const siteLogo = document.getElementById('siteLogo').files[0];

        // Симуляция сохранения настроек
        alert(`Налаштування збережено:
            Назва сайту: ${siteTitle}
            Мова: ${language}
            Відображення повідомлень: ${notificationsEnabled ? 'Увімкнено' : 'Вимкнено'}
            Контактна пошта: ${contactEmail}
            Контактний телефон: ${contactPhone}
            Логотип: ${siteLogo ? siteLogo.name : 'Не обрано'}`);
    });

    // Добавление функций для новых пунктов меню:
    document.getElementById('manageCategories').addEventListener('click', () => {
        alert('Відкрито керування категоріями.');
    });

    document.getElementById('manageReviews').addEventListener('click', () => {
        alert('Відкрито керування відгуками.');
    });

    document.getElementById('manageNews').addEventListener('click', () => {
        alert('Додайте новину.');
    });

    document.getElementById('viewReports').addEventListener('click', () => {
        alert('Перегляд звітів');
    });
}
