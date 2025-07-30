document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.querySelector('.timeline-nav nav');
    const updateItems = document.querySelectorAll('.update-item');

    if (!navContainer || updateItems.length === 0) return;

    // 1. Создаем навигационные ссылки
    updateItems.forEach(item => {
        const version = item.dataset.version;
        const id = item.id;

        if (version && id) {
            const link = document.createElement('a');
            link.href = `#${id}`;
            link.textContent = `Версия ${version}`;
            navContainer.appendChild(link);

            // Плавная прокрутка по клику с учетом высоты хэдера
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Находим целевой элемент по якорю
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;
                
                // Находим хэдер и получаем его высоту
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 0;
                
                // Вычисляем позицию для прокрутки
                // Это позиция элемента минус высота хэдера и небольшой дополнительный отступ
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 20; // 20px - дополнительный отступ
                
                // Выполняем плавную прокрутку
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        }
    });

    const navLinks = navContainer.querySelectorAll('a');

    // 2. Отслеживаем скролл для подсветки активной ссылки
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Убираем активный класс со всех ссылок
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Добавляем класс элементу в поле зрения
                const id = entry.target.id;
                const activeLink = navContainer.querySelector(`a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }

                // Дополнительно для подсветки маркера на линии
                document.querySelectorAll('.update-item').forEach(item => item.classList.remove('is-visible'));
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        rootMargin: '-40% 0px -60% 0px' // Активация, когда элемент находится в средней части экрана
    });

    updateItems.forEach(item => observer.observe(item));
});