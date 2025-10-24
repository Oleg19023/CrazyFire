// Функция для применения темы
function applyTheme(theme) {
    let body = document.body;
    let navbar = document.querySelector('.navbar');
    let header = document.querySelector('header');
    let navLinks = document.querySelectorAll('.nav-link');
    let navbarBrandIcon = document.querySelector('.navbar-brand i');
    let searchButton = document.getElementById('searchButton');
    let cardBodies = document.querySelectorAll('.card-body');
    let parallaxToggle = document.getElementById('parallaxToggle');

    if (theme === 'dark') {
        body.classList.add('dark-theme');
        if (navbar) navbar.classList.add('dark-theme-navbar');
        if (header) header.classList.add('dark-theme-header');
        navLinks.forEach(navLink => navLink.classList.add('dark-theme-text'));
        if (navbarBrandIcon) navbarBrandIcon.classList.add('dark-theme-icon');
        if (searchButton) searchButton.classList.add('dark-theme-button');

        if (parallaxToggle) parallaxToggle.style.display = 'inline-block';
    } else {
        body.classList.remove('dark-theme');
        if (navbar) navbar.classList.remove('dark-theme-navbar');
        if (header) header.classList.remove('dark-theme-header');
        navLinks.forEach(navLink => navLink.classList.remove('dark-theme-text'));
        if (navbarBrandIcon) navbarBrandIcon.classList.remove('dark-theme-icon');
        if (searchButton) searchButton.classList.remove('dark-theme-button');

        if (parallaxToggle) {
            parallaxToggle.style.display = 'none';

            if (isParticlesEnabled) {
                const tsparticlesElement = document.getElementById('tsparticles');
                if (tsparticlesElement) {
                    tsparticlesElement.parentNode.removeChild(tsparticlesElement);
                }

                const parallaxIcon = document.getElementById('parallaxIcon');
                if (parallaxIcon) {
                    parallaxIcon.classList.remove('fa-wand-magic');
                    parallaxIcon.classList.add('fa-wand-magic-sparkles');
                }

                isParticlesEnabled = false;
                localStorage.setItem('particlesEnabled', 'false');
            }
        }
    }

    cardBodies.forEach(cardBody => cardBody.classList.toggle('card-body-theme', theme === 'dark'));

    let matrixContainer = document.getElementById('matrix-container');
    if (matrixContainer) {
        matrixContainer.style.display = theme === 'dark' ? 'block' : 'none';
    }
}

// Проверка темы при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const savedParticlesState = localStorage.getItem('particlesEnabled') === 'true';

    // Применяем сохранённую тему
    applyTheme(savedTheme);

    // Обновляем состояние переключателя
    const themeSwitch = document.getElementById('input');
    if (themeSwitch) {
        themeSwitch.checked = savedTheme === 'dark';
    }

    // Включение параллакса, если он был активен
    if (savedParticlesState) {
        const parallaxToggle = document.getElementById('parallaxToggle');
        if (parallaxToggle) {
            parallaxToggle.style.display = 'inline-block';
            const parallaxIcon = document.getElementById('parallaxIcon');
            if (parallaxIcon) {
                parallaxIcon.classList.remove('fa-wand-magic-sparkles');
                parallaxIcon.classList.add('fa-wand-magic');
            }
            isParticlesEnabled = true;
        }
    }
});

// Событие для новой кнопки (переключателя)
const themeSwitch = document.getElementById('input');
if (themeSwitch) {
    themeSwitch.addEventListener('change', function () {
        const newTheme = this.checked ? 'dark' : 'light';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// Цвет фона
document.getElementById('colorPicker').addEventListener('input', function () {
    document.body.style.backgroundColor = this.value;
});
