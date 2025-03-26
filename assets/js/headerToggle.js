const header = document.querySelector('header');
const mainToggleBtn = document.getElementById('toggleHeaderBtn');
const floatToggleBtn = document.getElementById('floatToggleBtn').firstElementChild;
let fadeTimeout;

// Обработчик для основной кнопки
mainToggleBtn.addEventListener('click', () => {
    if (header.style.transform === 'translateY(-100%)') {
        showHeader();
    } else {
        hideHeader();
    }
});

// Обработчик для плавающей кнопки
floatToggleBtn.addEventListener('click', showHeader);

function hideHeader() {
    header.style.transform = 'translateY(-100%)';
    header.style.transition = 'transform 0.6s ease';
    mainToggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
    
    // Показываем плавающую кнопку с задержкой
    setTimeout(() => {
        const floatBtn = document.getElementById('floatToggleBtn');
        floatBtn.style.display = 'block';
        floatBtn.style.opacity = '1';
        floatBtn.style.transition = 'opacity 0.5s ease';
        
        // Устанавливаем таймер для затемнения через 2 секунды
        clearTimeout(fadeTimeout);
        fadeTimeout = setTimeout(() => {
            floatBtn.style.opacity = '0.2'; // Сильная прозрачность
        }, 2000);
    }, 600);
}

function showHeader() {
    header.style.transform = 'translateY(0)';
    mainToggleBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.getElementById('floatToggleBtn').style.display = 'none';
    clearTimeout(fadeTimeout);
}

// Показываем кнопку при прокрутке вверх
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const floatBtn = document.getElementById('floatToggleBtn');
    
    if (currentScroll < lastScroll && header.style.transform === 'translateY(-100%)') {
        floatBtn.style.display = 'block';
        floatBtn.style.opacity = '1';
        
        // Сбрасываем таймер и устанавливаем новый
        clearTimeout(fadeTimeout);
        fadeTimeout = setTimeout(() => {
            floatBtn.style.opacity = '0.2';
        }, 2000);
    }
    
    lastScroll = currentScroll;
});

// Возвращаем видимость при наведении
document.getElementById('floatToggleBtn').addEventListener('mouseenter', function() {
    this.style.opacity = '1';
    clearTimeout(fadeTimeout);
});

document.getElementById('floatToggleBtn').addEventListener('mouseleave', function() {
    if (header.style.transform === 'translateY(-100%)') {
        fadeTimeout = setTimeout(() => {
            this.style.opacity = '0.2';
        }, 2000);
    }
});