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
    let parallaxToggle = document.getElementById('parallaxToggle');

    if (!themeIcon) {
        console.error('Theme icon not found');
        return;
    }

    if (theme === 'dark') {
        // Применяем тёмную тему
        body.classList.add('dark-theme');
        if (navbar) navbar.classList.add('dark-theme-navbar');
        if (header) header.classList.add('dark-theme-header');
        navLinks.forEach(navLink => navLink.classList.add('dark-theme-text'));
        if (navbarBrandIcon) navbarBrandIcon.classList.add('dark-theme-icon');
        if (searchButton) searchButton.classList.add('dark-theme-button');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');

        // Показываем кнопку параллакса
        if (parallaxToggle) parallaxToggle.style.display = 'inline-block';
    } else {
        // Снимаем тёмную тему
        body.classList.remove('dark-theme');
        if (navbar) navbar.classList.remove('dark-theme-navbar');
        if (header) header.classList.remove('dark-theme-header');
        navLinks.forEach(navLink => navLink.classList.remove('dark-theme-text'));
        if (navbarBrandIcon) navbarBrandIcon.classList.remove('dark-theme-icon');
        if (searchButton) searchButton.classList.remove('dark-theme-button');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');

        // Скрываем кнопку параллакса
        if (parallaxToggle) {
            parallaxToggle.style.display = 'none';

            // Если партиклы включены, отключаем их
            if (isParticlesEnabled) {
                const tsparticlesElement = document.getElementById('tsparticles');
                if (tsparticlesElement) {
                    tsparticlesElement.parentNode.removeChild(tsparticlesElement);
                }

                const parallaxIcon = document.getElementById('parallaxIcon');
                if (parallaxIcon) {
                    parallaxIcon.classList.remove('fa-stop');
                    parallaxIcon.classList.add('fa-play');
                }

                isParticlesEnabled = false; // Обновляем статус
                localStorage.setItem('particlesEnabled', 'false'); // Сохраняем статус
            }
        }
    }

    // Обновление стилей карточек
    cardBodies.forEach(cardBody => cardBody.classList.toggle('card-body-theme', theme === 'dark'));
}

// Проверка темы и состояния параллакса при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    const savedParticlesState = localStorage.getItem('particlesEnabled') === 'true';

    if (savedTheme) {
        applyTheme(savedTheme);
    }

    if (savedParticlesState) {
        const parallaxToggle = document.getElementById('parallaxToggle');
        if (parallaxToggle) {
            parallaxToggle.style.display = 'inline-block';
            const parallaxIcon = document.getElementById('parallaxIcon');
            if (parallaxIcon) {
                parallaxIcon.classList.remove('fa-play');
                parallaxIcon.classList.add('fa-stop');
            }
            isParticlesEnabled = true;
        }
    }
});

// Сохранение и переключение темы
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', function () {
        const currentTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
        applyTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
    });
}


  // Цвет фона
  document.getElementById('colorPicker').addEventListener('input', function() {
    document.body.style.backgroundColor = this.value;
  });