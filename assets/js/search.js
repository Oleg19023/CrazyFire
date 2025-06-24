// --- ОБЩИЕ ПЕРЕМЕННЫЕ И НАСТРОЙКА КНОПКИ ПОИСКА ---

const searchToggle = document.getElementById('searchToggle');
const searchInput = document.getElementById('searchInput');
let searchVisible = false;

if (searchToggle && searchInput) {
    searchToggle.addEventListener('click', function () {
        if (!searchVisible) {
            searchInput.style.display = 'block';
            searchInput.focus();
            searchToggle.classList.add('active');
        } else {
            searchInput.style.display = 'none';
            searchToggle.classList.remove('active');
            searchInput.value = '';
            // Вызываем универсальную функцию поиска
            performSearch(); 
        }
        searchVisible = !searchVisible;
    });
}

// --- УНИВЕРСАЛЬНАЯ ФУНКЦИЯ ПОИСКА ---

function performSearch() {
    const filter = searchInput.value.toLowerCase().trim();
    let cards, cardSelectors;

    // Определяем, на какой мы странице, и выбираем нужные селекторы
    if (document.querySelector('.calculators-grid')) {
        // Мы на странице с калькуляторами
        cards = document.querySelectorAll('.calc-card');
        cardSelectors = {
            title: '.calc-header h3',
            // У калькуляторов нет описания, но можем добавить фиктивный селектор
            // или искать по другим элементам, если они появятся.
            description: null 
        };
    } else if (document.querySelector('.programs-container')) {
        // Мы на странице с программами
        cards = document.querySelectorAll('.program-card');
        cardSelectors = {
            title: '.program-title',
            description: '.program-description',
            tags: '.program-tegs' // Дополнительно для тегов
        };
    } // === НОВЫЙ БЛОК ДЛЯ СТРАНИЦЫ С ЧАСАМИ ===
    else if (document.querySelector('.clocks-grid')) {
        cards = document.querySelectorAll('.clock-card');
        cardSelectors = {
            title: '.clock-card-city' // Ищем только по названию города
        };
    }
    // === КОНЕЦ НОВОГО БЛОКА ===
    else {
        // Если мы на другой странице, где нет нужных карточек, выходим
        return;
    }

    // Если на странице нет карточек, ничего не делаем
    if (!cards || cards.length === 0) {
        return;
    }

    let foundAny = false;

    cards.forEach(card => {
        // Получаем текст из элементов по селекторам
        const titleElement = card.querySelector(cardSelectors.title);
        const title = titleElement ? titleElement.textContent.toLowerCase() : '';

        const descElement = cardSelectors.description ? card.querySelector(cardSelectors.description) : null;
        const description = descElement ? descElement.textContent.toLowerCase() : '';
        
        const tagsElement = cardSelectors.tags ? card.querySelector(cardSelectors.tags) : null;
        const tags = tagsElement ? tagsElement.textContent.toLowerCase() : '';

        // Проверяем совпадения
        const titleMatch = title.includes(filter);
        const descriptionMatch = description.includes(filter);
        const tagsMatch = tags.includes(filter);
        
        const isVisible = titleMatch || descriptionMatch || tagsMatch;

        // Показываем или скрываем карточку
        card.style.display = isVisible ? '' : 'none';

        // Приоритет в отображении (для сортировки в будущем, если контейнер будет flex)
        // Название - высший приоритет
        if (titleMatch) {
            card.style.order = '0';
        } 
        // Описание - средний
        else if (descriptionMatch) {
            card.style.order = '1';
        } 
        // Теги - низший
        else if (tagsMatch) {
            card.style.order = '2';
        }

        if (isVisible) {
            foundAny = true;
        }
    });

    // Показываем сообщение "Ничего не найдено"
    toggleNoResultsMessage(foundAny);
}


// --- ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ДЛЯ СООБЩЕНИЯ "НИЧЕГО НЕ НАЙДЕНО" ---

function toggleNoResultsMessage(found) {
    // Находим родительский контейнер, он должен быть один на странице
    const container = document.querySelector('.calculators-grid, .programs-container');
    if (!container) return;

    let messageElement = document.getElementById('no-results-message');

    // Если элемента нет, создаем его
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.id = 'no-results-message';
        messageElement.innerHTML = `
            <i class="fas fa-search" style="font-size: 4rem; color: #888;"></i>
            <p style="font-size: 1.5rem; margin-top: 1rem; color: #888;">Ничего не найдено</p>
            <span style="color: #aaa;">Попробуйте изменить поисковый запрос.</span>
        `;
        messageElement.style.textAlign = 'center';
        messageElement.style.padding = '40px';
        messageElement.style.width = '100%';
        messageElement.style.display = 'none'; // Скрываем по умолчанию
        container.appendChild(messageElement);
    }

    // Показываем или скрываем сообщение
    messageElement.style.display = found ? 'none' : 'block';
}


// --- НАЗНАЧЕНИЕ ОБРАБОТЧИКА ---

// Слушаем ввод в поле поиска
if (searchInput) {
    // Используем 'input' для реакции на каждое изменение
    searchInput.addEventListener('input', performSearch);
}