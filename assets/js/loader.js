   // Создаем div и вставляем в него прелоадер
    let preloader = document.createElement("div");
    preloader.id = "preloader";
    preloader.innerHTML = `
        <svg class="pl" width="240" height="240" viewBox="0 0 240 240">
            <circle class="pl__ring pl__ring--a" cx="120" cy="120" r="105" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 660" stroke-dashoffset="-330" stroke-linecap="round"></circle>
            <circle class="pl__ring pl__ring--b" cx="120" cy="120" r="35" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 220" stroke-dashoffset="-110" stroke-linecap="round"></circle>
            <circle class="pl__ring pl__ring--c" cx="85" cy="120" r="70" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 440" stroke-linecap="round"></circle>
            <circle class="pl__ring pl__ring--d" cx="155" cy="120" r="70" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 440" stroke-linecap="round"></circle>
        </svg>
    `;
    
    // Вставляем в body
    document.body.insertAdjacentElement("afterbegin", preloader);

// Функция для скрытия прелоадера (с возможностью переопределения)
function hidePreloader(delay = 300) { // 300ms — значение по умолчанию
    setTimeout(() => {
        preloader.classList.add("hidden");
        setTimeout(() => preloader.remove(), 500);
    }, delay);
}

// Стандартный обработчик (сработает, если нет переопределения)
window.addEventListener("load", () => {
    // Если hidePreloader уже вызван (например, из другого скрипта), ничего не делаем
    if (!window._preloaderOverridden) {
        hidePreloader(); // Используем задержку по умолчанию (300ms)
    }
});

// Помечаем, что hidePreloader был вызван извне
window._preloaderOverridden = false;

// "Публичная" версия функции для переопределения
window.setPreloaderDelay = function(delay) {
    window._preloaderOverridden = true;
    hidePreloader(delay);
};

// Плавное появление контента (оставляем как есть)
window.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.add('theme-loaded');
    document.body.style.opacity = '1';
    setTimeout(() => {
        document.documentElement.classList.add('animations-ready');
    }, 100);
});

/* Пример использования:
<script>window._preloaderOverridden = true;window.addEventListener("load", () => hidePreloader(1000));</script> 
*/
