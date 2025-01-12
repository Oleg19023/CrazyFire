// Переменная для отслеживания состояния поиска
let searchVisible = false;

// Получаем элементы
const searchToggle = document.getElementById('searchToggle');
const searchInput = document.getElementById('searchInput');

if (searchToggle && searchInput) {
    // Слушаем нажатие на кнопку поиска
    searchToggle.addEventListener('click', function() {
        if (!searchVisible) {
            searchInput.style.display = 'block';  // Показываем поле
            searchInput.focus();  // Ставим фокус на поле
            searchToggle.classList.add('active');  // Добавляем класс активности к кнопке
        } else {
            searchInput.style.display = 'none';  // Скрываем поле
            searchToggle.classList.remove('active');  // Убираем класс активности с кнопки
        }
        searchVisible = !searchVisible;  // Меняем состояние
    });
}

// Фильтрация блюд при вводе в поле поиска
if (searchInput) {
    searchInput.addEventListener('input', function() {
        let filter = this.value.toLowerCase().trim(); // Получаем значение поиска и удаляем лишние пробелы
        let cards = document.querySelectorAll('.card'); // Получаем все карточки блюд
        let foundAny = false; // Переменная для отслеживания наличия совпадений

        cards.forEach(function(card) {
            // Проверяем, является ли карточка кнопкой добавления
            const isAddNewDishCard = card.querySelector('.fa-plus') !== null;
            if (isAddNewDishCard) {
                // Всегда отображаем карточку добавления нового блюда
                card.style.display = '';
            } else {
                let title = card.querySelector('.card-title').textContent.toLowerCase(); // Получаем название блюда
                const isVisible = title.includes(filter);
                card.style.display = isVisible ? '' : 'none'; // Показываем или скрываем карточку
                foundAny = foundAny || isVisible; // Устанавливаем флаг, что нашли хотя бы одну карточку
            }
        });

        // Если ничего не найдено, отображаем сообщение
        const cardContainer = document.querySelector('.row.g-3');
        let messageElement = document.getElementById('no-results'); // Получаем элемент для сообщения

        if (!messageElement) {
            // Создаем элемент для сообщения, если его нет
            messageElement = document.createElement('p');
            messageElement.id = 'no-results'; // Устанавливаем id для этого элемента
            messageElement.textContent = 'Ничего не найдено.'; // Текст сообщения
            messageElement.style.display = 'none'; // Скрываем по умолчанию
            cardContainer.appendChild(messageElement); // Добавляем элемент в контейнер карточек
        }

        // Показываем или скрываем сообщение в зависимости от результатов поиска
        messageElement.style.display = foundAny ? 'none' : 'block';
    });
}