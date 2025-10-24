document.addEventListener('DOMContentLoaded', () => {
    // --- ПОЛУЧЕНИЕ ЭЛЕМЕНТОВ ---
    const mainContainer = document.getElementById('videoBackground');
    const startButton = document.getElementById('startButton');
    const hideButton = document.getElementById('hideButton');
    const header = document.getElementById('header');
    const editButton = document.getElementById('editButton');
    const resetButton = document.getElementById('resetButton');
    const gridContainer = document.querySelector('.grid-container');
    const contextMenu = document.getElementById('widgetContextMenu');

    let sortableInstance = null;
    let isEditMode = false;
    let activeWidgetForMenu = null;

    const defaultWidgetsConfig = [
        { id: 'widget-time', size: 'size-1x1', pinned: false, hidden: false },
        { id: 'widget-weather', size: 'size-2x1', pinned: false, hidden: false },
        { id: 'widget-news', size: 'size-2x3', pinned: false, hidden: false },
        
        { id: 'widget-crazyflare', size: 'size-1x1', pinned: false, hidden: false },
        { id: 'widget-games', size: 'size-1x1', pinned: false, hidden: false },
        { id: 'widget-music', size: 'size-1x1', pinned: false, hidden: false },
        { id: 'widget-apps', size: 'size-1x1', pinned: false, hidden: false },
        { id: 'widget-programs', size: 'size-1x1', pinned: false, hidden: false },
        { id: 'widget-store', size: 'size-1x1', pinned: false, hidden: false },

        { id: 'widget-news-link', size: 'size-1x1', pinned: false, hidden: false },
        { id: 'widget-updates', size: 'size-1x1', pinned: false, hidden: false },
        { id: 'widget-terminal', size: 'size-1x1', pinned: false, hidden: false },
        { id: 'widget-notes', size: 'size-2x1', pinned: false, hidden: false }
    ];

    function saveWidgetState() {
        const widgets = [];
        gridContainer.querySelectorAll('.widget-tile').forEach(widget => {
            const sizeClass = Array.from(widget.classList).find(c => c.startsWith('size-'));
            widgets.push({ 
                id: widget.id, 
                size: sizeClass || 'size-1x1', 
                pinned: widget.classList.contains('pinned'),
                hidden: widget.classList.contains('widget-hidden')
            });
        });
        localStorage.setItem('widgetLayout', JSON.stringify(widgets));
    }

    function updateVisibilityIcons() {
        gridContainer.querySelectorAll('.widget-tile').forEach(widget => {
            const icon = widget.querySelector('.visibility-icon');
            if (icon) {
                if (widget.classList.contains('widget-hidden')) {
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            }
        });
    }

    function loadWidgetState() {
        const savedLayout = localStorage.getItem('widgetLayout');
        let config = defaultWidgetsConfig;
        try { if (savedLayout) { config = JSON.parse(savedLayout); } } catch (e) { config = defaultWidgetsConfig; }
        
        config.sort((a, b) => {
            if (a.hidden !== b.hidden) return a.hidden ? 1 : -1;
            if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
            return 0;
        });

        config.forEach(widgetConfig => {
            const widget = document.getElementById(widgetConfig.id);
            if (widget) {
                widget.className = widget.className.replace(/size-\dx\d/g, '').trim();
                widget.classList.add(widgetConfig.size);
                widget.classList.toggle('pinned', widgetConfig.pinned);
                widget.classList.toggle('widget-hidden', widgetConfig.hidden === true); 
                gridContainer.appendChild(widget);
            }
        });
        updateVisibilityIcons();
    }

function toggleEditMode() {
    isEditMode = !isEditMode;
    gridContainer.classList.toggle('edit-mode', isEditMode);
    editButton.textContent = isEditMode ? 'Сохранить' : 'Редактировать';
    editButton.classList.toggle('btn-success', isEditMode);
    
    resetButton.style.display = isEditMode ? 'inline-block' : 'none';

    if (isEditMode) {
        if (!sortableInstance) { 
            sortableInstance = new Sortable(gridContainer, { 
                animation: 150, 
                ghostClass: 'widget-ghost', 
                filter: '.pinned, .widget-hidden',
                onEnd: saveWidgetState 
            }); 
        }
        sortableInstance.option('disabled', false);
    } else {
        if (sortableInstance) sortableInstance.option('disabled', true);
        saveWidgetState();
    }
}
    
    function resetLayoutToDefault() {
        const isConfirmed = confirm('Вы уверены, что хотите сбросить все виджеты к виду по умолчанию? Это действие необратимо.');
        if (isConfirmed) {
            localStorage.removeItem('widgetLayout');

            location.reload();
        }
    }

    const showDashboard = () => { mainContainer.classList.add('dashboard-visible'); if (!header.classList.contains('show')) { header.style.display = 'block'; requestAnimationFrame(() => header.classList.add('show')); } };
    const hideDashboard = () => { mainContainer.classList.remove('dashboard-visible'); };

    // --- ПРАВИЛЬНЫЙ ПОРЯДОК ИНИЦИАЛИЗАЦИИ ---
    resetButton.style.display = 'none'; // Скрываем кнопку сброса при загрузке
    loadWidgetState();
    gridContainer.querySelectorAll('.widget-tile').forEach((widget, index) => { widget.setAttribute('data-aos', 'fade-up'); widget.setAttribute('data-aos-delay', index * 100); });
    AOS.init({ duration: 500, once: false, disable: window.innerWidth < 768 });
    if (localStorage.getItem('dashboardActive') === 'true') { showDashboard(); } else { hideDashboard(); }
    syncVersion();
    
    // --- ОБРАБОТЧИКИ КНОПОК ---
    startButton.addEventListener('click', () => { showDashboard(); localStorage.setItem('dashboardActive', 'true'); });
    hideButton.addEventListener('click', () => { hideDashboard(); localStorage.setItem('dashboardActive', 'false'); });
    editButton.addEventListener('click', toggleEditMode);
    resetButton.addEventListener('click', resetLayoutToDefault);
    
// --- ОБРАБОТЧИКИ КЛИКОВ ---
    gridContainer.addEventListener('click', e => {
        const target = e.target;
        const widget = target.closest('.widget-tile');
        if (!widget) return;

        // --- ЛОГИКА ДЛЯ РЕЖИМА РЕДАКТИРОВАНИЯ ---
        if (isEditMode) {
            // Клик по иконке "глаза"
            if (target.classList.contains('visibility-icon')) {
                widget.classList.toggle('widget-hidden');
                if (widget.classList.contains('widget-hidden')) { gridContainer.appendChild(widget); }
                updateVisibilityIcons();
                saveWidgetState();
                return; // Прерываем выполнение, чтобы не сработал переход по ссылке
            }
            
            // Клик по иконке "размер"
            if (target.classList.contains('resize-icon')) {
                e.preventDefault();
                activeWidgetForMenu = widget;
                contextMenu.style.display = 'block';
                const iconRect = target.getBoundingClientRect();
                contextMenu.style.left = `${iconRect.left}px`;
                contextMenu.style.top = `${iconRect.bottom + 5}px`;
                return; // Прерываем
            }
            
            // Клик по иконке "закрепить"
            if (target.classList.contains('pin-icon')) {
                widget.classList.toggle('pinned');
                if (widget.classList.contains('pinned')) { gridContainer.prepend(widget); }
                saveWidgetState();
                return; // Прерываем
            }
            // Если мы в режиме редактирования и кликнули не по иконке, ничего не делаем
            return;
        }

        // --- ЛОГИКА ДЛЯ ОБЫЧНОГО РЕЖИМА (ПЕРЕХОД ПО ССЫЛКЕ) ---
        if (widget.classList.contains('is-link') && widget.dataset.href) {
            window.location.href = widget.dataset.href;
        }
    });

    // --- ОСТАЛЬНОЙ КОД БЕЗ ИЗМЕНЕНИЙ ---
    contextMenu.addEventListener('click', e => { if (e.target.classList.contains('context-menu-item') && activeWidgetForMenu) { const newSize = e.target.dataset.size; activeWidgetForMenu.className = activeWidgetForMenu.className.replace(/size-\dx\d/g, '').trim(); activeWidgetForMenu.classList.add(newSize); contextMenu.style.display = 'none'; saveWidgetState(); } });
    window.addEventListener('click', (e) => { if (!e.target.classList.contains('resize-icon')) { contextMenu.style.display = 'none'; } });
    function syncVersion() { const footerVersionEl = document.getElementById('footerVersion'); const widgetVersionEl = document.getElementById('widgetVersionText'); if (footerVersionEl && widgetVersionEl) { widgetVersionEl.innerHTML = footerVersionEl.innerHTML; } }
    const timeWidget = document.getElementById('widgetTime');
    if (timeWidget) { setInterval(() => { timeWidget.textContent = new Date().toLocaleTimeString('ru-RU'); }, 1000); }
    const greetings = [ 'Добро пожаловать!', 'Привет, друг!', 'Здравствуйте!', 'Привет!', 'С возвращением!', 'Рады вас видеть!', 'Как дела?', 'Приветствую!', 'Счастливы вас видеть!', 'Привет, как поживаешь?', 'Хорошего дня!', 'Рады снова видеть вас!', 'Привет! Мы ждали вас!', 'Ну что, приступим?', 'Давно не виделись!', 'Как настроение?', 'Здорово, что вы здесь!', 'Привет, давайте начнем!', 'Великолепного дня!', 'Рады встрече!', 'Чувствуйте себя как дома!', 'Надеюсь, у вас все отлично!', 'Всегда рады вам!', 'Снова вместе!', 'Спасибо, что зашли!', 'Как приятно вас видеть!', 'Добрый день!', 'Доброго времени суток!', 'Отличного настроения вам!', 'Приветики', 'ʕ ᵔᴥᵔ ʔ', ];
    document.getElementById('greeting').textContent = greetings[Math.floor(Math.random() * greetings.length)];
    const backgroundIframe = document.getElementById('backgroundIframe');
    const kinescopeVideos = [
        // 1 //
        'https://kinescope.io/embed/7L7W8nZoXJygFgjYvii5tC?autoplay=true&muted=true&loop=true&background=1',
        // 2 //
        'https://kinescope.io/embed/fmag8YRSN97uPJK5iLKKEK?autoplay=true&muted=true&loop=true&background=1',
        // 3 //
        'https://kinescope.io/embed/uUJG9KtEhKECqDEDPs9pHB?autoplay=true&muted=true&loop=true&background=1',
        // 4 //
        'https://kinescope.io/embed/vZNGRDAMHQsA56bgdYndEy?autoplay=true&muted=true&loop=true&background=1',
        // 5 //
        'https://kinescope.io/embed/gRzAdPfNZDkwgWPuymP9TY?autoplay=true&muted=true&loop=true&background=1',
        // 6 //
        'https://kinescope.io/embed/43y3HfyxFrgoTZ89US7AUV?autoplay=true&muted=true&loop=true&background=1',
        // 7 //
        'https://kinescope.io/embed/2V1cTauBsqfGT1ujE4WRAp?autoplay=true&muted=true&loop=true&background=1',
        // 8 //
        'https://kinescope.io/embed/x5LnF9Kpf1NyheWdbJMmyK?autoplay=true&muted=true&loop=true&background=1',
        // 9 //
        'https://kinescope.io/embed/mRYv4cuGdMkAkmD2gzYcYs?autoplay=true&muted=true&loop=true&background=1',
        // 10 //
        'https://kinescope.io/embed/bWTit2wJiXPkVaNt4WXgvy?autoplay=true&muted=true&loop=true&background=1',
        // 11 //
        'https://kinescope.io/embed/eRKxz6Jtk4eaeAkrApy4tr?autoplay=true&muted=true&loop=true&background=1',
        // 12 //
        'https://kinescope.io/embed/hnYjJJPgRYaqyoSCXqskmr?autoplay=true&muted=true&loop=true&background=1',
        // 13 //
        'https://kinescope.io/embed/7An83s3CszZDmqSf3KzHEp?autoplay=true&muted=true&loop=true&background=1',
        // 14 //
        'https://kinescope.io/embed/jusGzB75Je9Fqi7opYiGLj?autoplay=true&muted=true&loop=true&background=1',
        // 15 //
        'https://kinescope.io/embed/8CoMKvfHZvwxpYXS74LFqy?autoplay=true&muted=true&loop=true&background=1',
        // 16 //
        'https://kinescope.io/embed/9M2mVYmJt91JtDWUZ6nYHe?autoplay=true&muted=true&loop=true&background=1',
        // 17 //
        'https://kinescope.io/embed/cMN8ZCHihxGrYtBRF1rvSV?autoplay=true&muted=true&loop=true&background=1',
        // 18 //
        'https://kinescope.io/embed/jHNhXkF1ezh9zW7nCfrBRF?autoplay=true&muted=true&loop=true&background=1',
        // 19 //
        'https://kinescope.io/embed/ocbUUjfyiNjZBMWKYgj5AQ?autoplay=true&muted=true&loop=true&background=1',
        // 20 //
        'https://kinescope.io/embed/8Bk2TRLDd6wwBYQtwpd5Yz?autoplay=true&muted=true&loop=true&background=1',
        // 21 //
        'https://kinescope.io/embed/s93vnU3zJyEHSWd8ojdeRE?autoplay=true&muted=true&loop=true&background=1',
        // 22 //
        'https://kinescope.io/embed/7AcL9GmQRFqfPnzga4uZD7?autoplay=true&muted=true&loop=true&background=1',
        // 23 //
        'https://kinescope.io/embed/mSYq4eRVd2H9fQJQrw9XE8?autoplay=true&muted=true&loop=true&background=1',
        // 24 //
        'https://kinescope.io/embed/fTeMYjwuwXaagk13vvBxnn?autoplay=true&muted=true&loop=true&background=1',
        // 25 //
        'https://kinescope.io/embed/t1CU2zmfYgA3wNuwds7EDq?autoplay=true&muted=true&loop=true&background=1',
        // 26 //
        'https://kinescope.io/embed/kMVdhzU11F1CV1fu7qUt4K?autoplay=true&muted=true&loop=true&background=1',
        // 27 //
        'https://kinescope.io/embed/jxcdzTUGtHCX3QdJgtM2jC?autoplay=true&muted=true&loop=true&background=1',
        // 28 //
        'https://kinescope.io/embed/acfZrNEhG1p5TgSgpj3FTi?autoplay=true&muted=true&loop=true&background=1',
        // 29 //
        'https://kinescope.io/embed/o17wWammbqa4DMVnEqCgNs?autoplay=true&muted=true&loop=true&background=1',
        // 30 //
        'https://kinescope.io/embed/qCb4inht5Kz1yCTFavPHvs?autoplay=true&muted=true&loop=true&background=1',
        // 31 //
        'https://kinescope.io/embed/gGinEZLuy68Kk3rUPPnikp?autoplay=true&muted=true&loop=true&background=1',
        // 32 //
        'https://kinescope.io/embed/qrzeeqhAQrnE9xCsN7vcCB?autoplay=true&muted=true&loop=true&background=1',
        // 33 //
        'https://kinescope.io/embed/uG4xhKiViFC61kKQG9YY5S?autoplay=true&muted=true&loop=true&background=1',
        // 34 //
        'https://kinescope.io/embed/69zQQUAYpGaTfAHwUWRJa8?autoplay=true&muted=true&loop=true&background=1',
        // 35 //
        'https://kinescope.io/embed/xhtxZrNp6xKKT2FEKRhvxn?autoplay=true&muted=true&loop=true&background=1',
        // 36 //
        'https://kinescope.io/embed/mb8jDXCmcn34oxH3P2nf4y?autoplay=true&muted=true&loop=true&background=1',
        // 37 //
        'https://kinescope.io/embed/qxEzGM9rFEXMfKrdzzCPSG?autoplay=true&muted=true&loop=true&background=1',
        // 38 //
        'https://kinescope.io/embed/qsCrrZ7mHZ9jZsGDkgpAf5?autoplay=true&muted=true&loop=true&background=1',
        // 39 //
        'https://kinescope.io/embed/aWu6hoC2JZJsSdPTFCHjoW?autoplay=true&muted=true&loop=true&background=1',
        // 40 //
        'https://kinescope.io/embed/wyd6Lr4UKyeur4RK8D4yAg?autoplay=true&muted=true&loop=true&background=1',
        // 41 //
        'https://kinescope.io/embed/qWWSeqCfb3DDbEsSSW7ApN?autoplay=true&muted=true&loop=true&background=1',
        // 42 //
        'https://kinescope.io/embed/9kVfz4ooH5BuCzqkfw5p9p?autoplay=true&muted=true&loop=true&background=1',
        // 43 //
        'https://kinescope.io/embed/mVWRGETP2r3QsJd4vtmuAz?autoplay=true&muted=true&loop=true&background=1',
        // 44 //
        'https://kinescope.io/embed/rzyX39oX9LuQ1NntTxxEVu?autoplay=true&muted=true&loop=true&background=1',
        // 45 //
        'https://kinescope.io/embed/evM5EgBm8w3mu8C3jwETF9?autoplay=true&muted=true&loop=true&background=1',
        // 46 //
        'https://kinescope.io/embed/oNSpYm9AxQTkYAzHwZLCJf?autoplay=true&muted=true&loop=true&background=1',
        // 47 //
        'https://kinescope.io/embed/tuXRxJV8Gbonsz9exGo2vH?autoplay=true&muted=true&loop=true&background=1',
        // 48 //
        'https://kinescope.io/embed/gRePLY4a8MdUhUs8X9bo2r?autoplay=true&muted=true&loop=true&background=1',
        // 49 //
        'https://kinescope.io/embed/qkvpXrFhQPjmXXxJdQZgmg?autoplay=true&muted=true&loop=true&background=1',
        // 50 //
        'https://kinescope.io/embed/mre3hX76h4gKeUrsAy9H9c?autoplay=true&muted=true&loop=true&background=1',
    ];
    let currentVideoIndex = -1;

    // Функция, которая будет менять видео
    function setNextVideo() {
        // 1. Делаем iframe прозрачным, запуская анимацию исчезновения
        backgroundIframe.classList.remove('show');

        // 2. Ждем, пока анимация исчезновения завершится
        setTimeout(() => {
            // 3. Выбираем новый случайный индекс, не повторяющийся с предыдущим
            let newVideoIndex;
            do {
                newVideoIndex = Math.floor(Math.random() * kinescopeVideos.length);
            } while (kinescopeVideos.length > 1 && newVideoIndex === currentVideoIndex);
            
            currentVideoIndex = newVideoIndex;
            
            // 4. Устанавливаем новый src.
            console.log("Загружаю видео:", kinescopeVideos[currentVideoIndex]); // Для отладки
            backgroundIframe.src = kinescopeVideos[currentVideoIndex];
        }, 800); // Эта задержка ДОЛЖНА соответствовать времени `transition` в CSS
    }

    backgroundIframe.onload = () => {
        // 5. Как только новое видео загрузилось, делаем iframe видимым.
        console.log("Видео загружено, показываю."); // Для отладки
        backgroundIframe.classList.add('show');
    };

    const initialIndex = Math.floor(Math.random() * kinescopeVideos.length);
    currentVideoIndex = initialIndex;
    backgroundIframe.src = kinescopeVideos[currentVideoIndex];

    // Интервал для смен видео.
    setInterval(setNextVideo, 10000); // 10 секунд
});