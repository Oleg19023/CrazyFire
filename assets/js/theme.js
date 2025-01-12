// Функция для применения темы
function applyTheme(theme) {
    let body = document.body;
    let navbar = document.querySelector('.navbar');
    let header = document.querySelector('header');
    let navLinks = document.querySelectorAll('.nav-link');
    let navbarBrandIcon = document.querySelector('.navbar-brand i');
    let searchButton = document.getElementById('searchButton');
    let cardBodies = document.querySelectorAll('.card-body');
    let themeIcon = document.getElementById('themeIcon');

    if (!themeIcon) {
        console.error('Theme icon not found');
        return;
    }

    if (theme === 'dark') {
        body.classList.add('dark-theme');
        if (navbar) navbar.classList.add('dark-theme-navbar');
        if (header) header.classList.add('dark-theme-header');
        navLinks.forEach(navLink => navLink.classList.add('dark-theme-text'));
        if (navbarBrandIcon) navbarBrandIcon.classList.add('dark-theme-icon');
        if (searchButton) searchButton.classList.add('dark-theme-button');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        body.classList.remove('dark-theme');
        if (navbar) navbar.classList.remove('dark-theme-navbar');
        if (header) header.classList.remove('dark-theme-header');
        navLinks.forEach(navLink => navLink.classList.remove('dark-theme-text'));
        if (navbarBrandIcon) navbarBrandIcon.classList.remove('dark-theme-icon');
        if (searchButton) searchButton.classList.remove('dark-theme-button');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }

    // Обновление стилей карточек
    cardBodies.forEach(cardBody => cardBody.classList.toggle('card-body-theme', theme === 'dark'));
}

// Проверка темы при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }
});

// Сохранение и переключение темы
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
        applyTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
    });
}