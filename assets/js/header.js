document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const mobileMenu = document.getElementById('navbarSupportedContent');
    
    // Блокировка/разблокировка скролла
    if (mobileMenu) {
        mobileMenu.addEventListener('show.bs.collapse', () => body.classList.add('mobile-menu-open'));
        mobileMenu.addEventListener('hide.bs.collapse', () => body.classList.remove('mobile-menu-open'));
    }

    // --- ФИНАЛЬНОЕ ИСПРАВЛЕНИЕ ДЛЯ МОБИЛЬНЫХ МЕНЮ ---

    // Находим все выпадающие меню внутри оверлея
    const dropdownsInMobileMenu = mobileMenu.querySelectorAll('.dropdown');

    dropdownsInMobileMenu.forEach(dropdown => {
        // Подписываемся на стандартное событие Bootstrap "show.bs.dropdown"
        // Оно срабатывает ПЕРЕД тем, как меню откроется
        dropdown.addEventListener('show.bs.dropdown', function (event) {
            
            // Работаем только в мобильном режиме
            if (window.innerWidth < 992) {
                // Закрываем все другие открытые меню
                dropdownsInMobileMenu.forEach(otherDropdown => {
                    // Проверяем, что это не то же самое меню, которое мы пытаемся открыть
                    if (otherDropdown !== dropdown) {
                        // Используем официальный JS API Bootstrap для закрытия
                        const instance = bootstrap.Dropdown.getInstance(otherDropdown.querySelector('.dropdown-toggle'));
                        if (instance) {
                            instance.hide();
                        }
                    }
                });
            }
        });
    });
});