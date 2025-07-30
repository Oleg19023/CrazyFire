// tools-app.js (полная замена)

document.addEventListener('DOMContentLoaded', () => {
    // --- Элементы для переключения контента ---
    const navLinks = document.querySelectorAll('.tools-sidebar-nav .nav-link');
    const toolCards = document.querySelectorAll('.tool-card');
    const contentWrappers = document.querySelectorAll('.tools-main-content .content-wrapper');
    const baseTitle = "CrazyFire Инструменты";

    // --- Элементы для мобильного меню ---
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.tools-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const mobileHeaderTitle = document.getElementById('mobile-header-title');

    // --- Логика прелоадеров для Iframe ---
    const iframeWrappers = document.querySelectorAll('.iframe-wrapper');
    iframeWrappers.forEach(wrapper => {
        const iframe = wrapper.querySelector('iframe');
        // Создаем и добавляем прелоадер
        const preloader = document.createElement('div');
        preloader.className = 'iframe-preloader';
        wrapper.prepend(preloader); // Вставляем прелоадер перед iframe

        // Когда iframe полностью загружен, убираем прелоадер
        iframe.addEventListener('load', () => {
            preloader.style.display = 'none';
        });
    });

    // Функция для открытия/закрытия сайдбара
    function toggleSidebar(forceClose = false) {
        if (forceClose) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        } else {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        }
    }

    // Функция для переключения на нужный инструмент
    function showTool(toolId) {
        // 1. Скрываем все блоки контента
        contentWrappers.forEach(wrapper => {
            wrapper.classList.remove('active');
        });

        // 2. Показываем нужный блок контента
        const targetContent = document.getElementById(toolId);
        if (targetContent) {
            targetContent.classList.add('active');
        }

        // 3. Обновляем активную ссылку в сайдбаре и заголовок
        navLinks.forEach(link => {
            if (link.dataset.toolId === toolId) {
                link.classList.add('active');
                const toolName = link.querySelector('span').textContent;
                document.title = toolName === 'Главная' ? baseTitle : `${toolName} - ${baseTitle}`;
                if(mobileHeaderTitle) {
                    mobileHeaderTitle.textContent = toolName;
                }
            } else {
                link.classList.remove('active');
            }
        });

        // 4. Закрываем сайдбар на мобильных устройствах после выбора
        if (window.innerWidth <= 992) {
            toggleSidebar(true);
        }
    }

    // --- ОБРАБОТЧИКИ СОБЫТИЙ ---

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const toolId = link.dataset.toolId;
            showTool(toolId);
        });
    });

    toolCards.forEach(card => {
        card.addEventListener('click', () => {
            const toolId = card.dataset.toolId;
            showTool(toolId);
        });
    });

    if (menuToggle && sidebar && overlay) {
        menuToggle.addEventListener('click', () => toggleSidebar());
        overlay.addEventListener('click', () => toggleSidebar(true));
    }

    // Инициализация
    const initialActiveLink = document.querySelector('.nav-link.active');
    if (initialActiveLink) {
        showTool(initialActiveLink.dataset.toolId);
    }
});