document.addEventListener('DOMContentLoaded', () => {
    // Найти все dropdown-toggle элементы
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    // Для каждого dropdown-toggle добавить обработчик события
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            const parentDropdown = this.closest('.dropdown');
            
            // Переключение состояния текущего меню
            parentDropdown.classList.toggle('show');
            
            // Закрыть другие открытые меню
            document.querySelectorAll('.dropdown.show').forEach(openDropdown => {
                if (openDropdown !== parentDropdown) {
                    openDropdown.classList.remove('show');
                }
            });
        });
    });

    // Закрыть меню при клике вне
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown.show').forEach(openDropdown => {
                openDropdown.classList.remove('show');
            });
        }
    });
});