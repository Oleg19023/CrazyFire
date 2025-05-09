document.querySelectorAll('.download-container').forEach(container => {
    const input = container.querySelector('.input');
    const label = container.querySelector('.label');
    const goButton = container.querySelector('.program-button'); // Кнопка "Перейти"
  
    // Работаем только с анимированной кнопкой (не затрагиваем "Перейти")
    input.addEventListener('change', () => {
      if (input.checked) {
        label.classList.add('disabled');
        
        // Берём ссылку из data-атрибута label
        const downloadUrl = label.getAttribute('data-download-url');
        
        setTimeout(() => {
          window.location.href = downloadUrl; // Переход по ссылке скачивания
        }, 1000); // Через 1 секунду
  
        // Сброс через 5 сек (на случай ошибки)
        setTimeout(() => {
          input.checked = false;
          label.classList.remove('disabled');
        }, 5000);
      }
    });
  });