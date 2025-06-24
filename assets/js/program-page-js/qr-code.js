document.addEventListener('DOMContentLoaded', () => {

    const isMobile = window.innerWidth < 768;
    const defaultQrSize = isMobile ? 200 : 400;

    // === СПИСОК ЛОГОТИПОВ ===
    const logoCategories = {
        basic: {
            name: 'Базовые',
            path: '/assets/images/Program-pages/Qr-code-maker/basic/',
            count: 50,
            targetGrid: document.querySelector('#gallery-basic .logo-gallery-grid')
        },
        icons: {
            name: 'Иконки',
            path: '/assets/images/Program-pages/Qr-code-maker/icons/',
            count: 48,
            targetGrid: document.querySelector('#gallery-icons .logo-gallery-grid')
        },
        brands: {
            name: 'Бренды',
            path: '/assets/images/Program-pages/Qr-code-maker/brends/',
            count: 224,
            targetGrid: document.querySelector('#gallery-brands .logo-gallery-grid')
        }
    };


    // === Функция для правильного кодирования UTF-8 ===
    function encode_utf8(s) {
        return unescape(encodeURIComponent(s));
    }

    // === Инициализация экземпляра QRCodeStyling ===
    const qrCode = new QRCodeStyling({
        width: defaultQrSize,
        height: defaultQrSize,
        type: 'svg',
        data: 'https://crazyfire-app.web.app',
        image: '',
        dotsOptions: {
            color: '#000000',
            type: 'square'
        },
        backgroundOptions: {
            color: '#ffffff',
        },
        imageOptions: {
            crossOrigin: 'anonymous',
            margin: 10
        },
        qrOptions: {
            errorCorrectionLevel: 'Q',
            mode: 'Byte' // Этот режим обязателен для работы
        }
    });

    qrCode.append(document.getElementById('qr-canvas'));

    // === Элементы DOM ===
    const allInputs = document.querySelectorAll('#qr-type-content input, #qr-type-content select, #qr-type-content textarea, #qr-color-dark, #qr-color-light, #qr-size-slider');
    const logoInput = document.getElementById('qr-logo-input');
    const removeLogoBtn = document.getElementById('qr-logo-remove');
    const downloadLinks = document.querySelectorAll('.download-actions .dropdown-item');
    const mainDownloadBtn = document.getElementById('download-btn');
    const qrSizeSlider = document.getElementById('qr-size-slider');
    const qrSizeValue = document.getElementById('qr-size-value');
    const showModalBtn = document.getElementById('show-logo-modal-btn');
    const logoModal = document.getElementById('logo-modal-wrapper');
    const closeModalBtn = document.getElementById('logo-modal-close');
    const modalOverlay = document.querySelector('.logo-modal-overlay');

    // === УСТАНОВКА ЗНАЧЕНИЯ ПО УМОЛЧАНИЮ ДЛЯ ПОЛЗУНКА ===
    if(qrSizeSlider) {
        qrSizeSlider.value = defaultQrSize;
    }
    if(qrSizeValue) {
        qrSizeValue.textContent = defaultQrSize;
    }
    
    // === Основная функция обновления QR-кода ===
    const updateQRCode = () => {
        const activeTab = document.querySelector('#qr-type-tabs .nav-link.active').getAttribute('data-bs-target');
        let rawData = ''; // Необработанные данные
        
        switch (activeTab) {
            case '#tab-url':
                rawData = document.getElementById('qr-data-url').value;
                break;
            case '#tab-text':
                rawData = document.getElementById('qr-data-text').value;
                break;
            case '#tab-wifi':
                const ssid = document.getElementById('qr-wifi-ssid').value;
                const pass = document.getElementById('qr-wifi-pass').value;
                const enc = document.getElementById('qr-wifi-enc').value;
                rawData = `WIFI:T:${enc};S:${ssid};P:${pass};;`;
                break;
            case '#tab-vcard':
                const name = document.getElementById('qr-vcard-name').value;
                const tel = document.getElementById('qr-vcard-tel').value;
                const email = document.getElementById('qr-vcard-email').value;
                rawData = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${tel}\nEMAIL:${email}\nEND:VCARD`;
                break;
        }

        const data = encode_utf8(rawData);
        
        const newSize = parseInt(qrSizeSlider.value, 10);
        qrSizeValue.textContent = newSize;

        qrCode.update({
            width: newSize,
            height: newSize,
            data: data || ' ', // Используем пробел, если данных нет
            dotsOptions: { color: document.getElementById('qr-color-dark').value },
            backgroundOptions: { color: document.getElementById('qr-color-light').value }
        });
    };

    // === НОВЫЙ БЛОК: Управление галереей и модальным окном ===
    const openModal = () => logoModal.classList.add('visible');
    const closeModal = () => logoModal.classList.remove('visible');

    // Новая функция для заполнения всех галерей по категориям
    const populateAllGalleries = () => {
        // Проходимся по каждой категории в нашем объекте
        for (const categoryKey in logoCategories) {
            const category = logoCategories[categoryKey];
            if (!category.targetGrid) continue; // Пропускаем, если контейнер не найден

            category.targetGrid.innerHTML = ''; // Очищаем сетку категории

            // Генерируем элементы для каждой картинки в категории
            for (let i = 1; i <= category.count; i++) {
                const logoName = `${i}.png`;
                const item = document.createElement('div');
                item.className = 'logo-gallery-item';
                
                const img = document.createElement('img');
                const fullPath = category.path + logoName;
                img.src = fullPath;
                img.alt = logoName;
                img.loading = 'lazy'; // Ленивая загрузка для производительности

                item.appendChild(img);
                
                // Добавляем обработчик клика
                item.addEventListener('click', () => {
                    qrCode.update({ image: fullPath });
                    logoInput.value = '';
                    closeModal();
                });
                
                category.targetGrid.appendChild(item);
            }
        }
    };
    
    // === ОБРАБОТЧИКИ СОБЫТИЙ ===

    // Обновление при любом изменении в полях ввода
    allInputs.forEach(input => input.addEventListener('input', updateQRCode));
    showModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    // Обновление при переключении вкладок
    document.querySelectorAll('#qr-type-tabs .nav-link').forEach(tab => {
        tab.addEventListener('shown.bs.tab', updateQRCode);
    });

    // Обработка загрузки логотипа
    logoInput.addEventListener('change', (e) => {
        if (!e.target.files || !e.target.files[0]) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            qrCode.update({ image: event.target.result });
        };
        reader.readAsDataURL(e.target.files[0]);
    });

    // Удаление логотипа
    removeLogoBtn.addEventListener('click', () => {
        logoInput.value = '';
        qrCode.update({ image: '' });
    });

    // Скачивание
    const download = (format) => qrCode.download({ name: 'crazyfire-qr', extension: format });
    mainDownloadBtn.addEventListener('click', () => download('png'));
    downloadLinks.forEach(link => link.addEventListener('click', (e) => {
        e.preventDefault();
        download(e.target.dataset.format);
    }));

    // Инициализация при загрузке страницы
    updateQRCode();
    populateAllGalleries();
});