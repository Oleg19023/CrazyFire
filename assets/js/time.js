document.addEventListener("DOMContentLoaded", () => {
    // 1. Находим ВСЕ элементы с нужными классами ОДИН РАЗ при загрузке страницы.
    // Это гораздо эффективнее, чем искать их каждую секунду.
    const dateElements = document.querySelectorAll('.current-date');
    const timeElements = document.querySelectorAll('.current-time');
    const yearElements = document.querySelectorAll('.current-year');

    // Если на странице нет ни одного элемента для обновления, ничего не делаем.
    if (dateElements.length === 0 && timeElements.length === 0 && yearElements.length === 0) {
        return;
    }

    // 2. Функция, которая будет обновлять время
    function updateDynamicTime() {
        const now = new Date();

        // Форматируем дату и время.
        // "uk-UA" - украинский формат. Можно заменить на "ru-RU" (русский) или "en-GB" (британский) и т.д.
        const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const formattedDate = now.toLocaleDateString("uk-UA", optionsDate);
        const formattedTime = now.toLocaleTimeString("uk-UA");
        const year = now.getFullYear();

        // 3. Обновляем текст для КАЖДОГО найденного элемента.
        dateElements.forEach(element => {
            element.textContent = formattedDate;
        });

        timeElements.forEach(element => {
            element.textContent = formattedTime;
        });

        yearElements.forEach(element => {
            element.textContent = year;
        });
    }

    // 4. Запускаем обновление каждую секунду.
    setInterval(updateDynamicTime, 1000);

    // Также вызываем функцию один раз сразу при загрузке,
    // чтобы не ждать первую секунду до появления времени.
    updateDynamicTime();
});