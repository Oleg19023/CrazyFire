document.getElementById('startButton').addEventListener('click', function() {
    const header = document.getElementById('header');

    if (!header.classList.contains('show')) {
        header.style.display = 'block'; // Показываем
        requestAnimationFrame(() => {
            header.classList.add('show'); // Добавляем анимацию
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const greetings = [
        'Добро пожаловать!',
        'Привет, друг!',
        'Здравствуйте!',
        'Привет!',
        'С возвращением!',
        'Рады вас видеть!',
        'Как дела?',
        'Приветствую!',
        'Счастливы вас видеть!',
        'Привет, как поживаешь?',
        'Хорошего дня!',
        'Рады снова видеть вас!',
        'Привет! Мы ждали вас!',
        'Ну что, приступим?',
        'Давно не виделись!',
        'Как настроение?',
        'Здорово, что вы здесь!',
        'Привет, давайте начнем!',
        'Великолепного дня!',
        'Рады встрече!',
        'Чувствуйте себя как дома!',
        'Надеюсь, у вас все отлично!',
        'Всегда рады вам!',
        'Снова вместе!',
        'Спасибо, что зашли!',
        'Как приятно вас видеть!',
        'Добрый день!',
        'Доброго времени суток!',
        'Отличного настроения вам!',
        'Приветики ʕ ᵔᴥᵔ ʔ',
    ];    

    const videos = [
        './assets/media/Main-page/1.mp4',
        './assets/media/Main-page/2.mp4',
        './assets/media/Main-page/3.mp4',
        './assets/media/Main-page/4.mp4',
        './assets/media/Main-page/5.mp4',
        './assets/media/Main-page/6.mp4',
        './assets/media/Main-page/7.mp4',
        './assets/media/Main-page/8.mp4',
        './assets/media/Main-page/9.mp4',
        './assets/media/Main-page/10.mp4',
        './assets/media/Main-page/11.mp4',
        './assets/media/Main-page/12.mp4',
        './assets/media/Main-page/13.mp4',
        './assets/media/Main-page/14.mp4',
        './assets/media/Main-page/15.mp4',
        './assets/media/Main-page/16.mp4',
        './assets/media/Main-page/17.mp4',
        './assets/media/Main-page/18.mp4',
        './assets/media/Main-page/19.mp4',
        './assets/media/Main-page/20.mp4',
        './assets/media/Main-page/21.mp4',
        './assets/media/Main-page/22.mp4',
        './assets/media/Main-page/23.mp4',
        './assets/media/Main-page/24.mp4',
        './assets/media/Main-page/25.mp4',
        './assets/media/Main-page/26.mp4',
        './assets/media/Main-page/27.mp4',
        './assets/media/Main-page/28.mp4',
        './assets/media/Main-page/29.mp4',
        './assets/media/Main-page/30.mp4',
        './assets/media/Main-page/31.mp4',
        './assets/media/Main-page/32.mp4',
        './assets/media/Main-page/33.mp4',
        './assets/media/Main-page/34.mp4',
        './assets/media/Main-page/35.mp4',
        './assets/media/Main-page/36.mp4',
        './assets/media/Main-page/37.mp4',
        './assets/media/Main-page/38.mp4',
        './assets/media/Main-page/39.mp4',
        './assets/media/Main-page/40.mp4',
        './assets/media/Main-page/41.mp4',
        './assets/media/Main-page/42.mp4',
        './assets/media/Main-page/43.mp4',
        './assets/media/Main-page/44.mp4',
        './assets/media/Main-page/45.mp4',
        './assets/media/Main-page/46.mp4',
        './assets/media/Main-page/47.mp4',
        './assets/media/Main-page/48.mp4',
        './assets/media/Main-page/49.mp4',
        './assets/media/Main-page/50.mp4',
        './assets/media/Main-page/51.mp4',
        './assets/media/Main-page/52.mp4',
        // './assets/media/Main-page/53.mp4',
        // './assets/media/Main-page/54.mp4',
        // './assets/media/Main-page/55.mp4',
        // './assets/media/Main-page/56.mp4',
        // './assets/media/Main-page/57.mp4',
        // './assets/media/Main-page/58.mp4',
        // './assets/media/Main-page/59.mp4',
        // './assets/media/Main-page/60.mp4',
        // './assets/media/Main-page/61.mp4',
        // './assets/media/Main-page/62.mp4',
        // './assets/media/Main-page/63.mp4',
        // './assets/media/Main-page/64.mp4',
        // './assets/media/Main-page/65.mp4',
        // './assets/media/Main-page/66.mp4',
        // './assets/media/Main-page/67.mp4',
        // './assets/media/Main-page/68.mp4',
        // './assets/media/Main-page/69.mp4',
        // './assets/media/Main-page/70.mp4',
        // './assets/media/Main-page/71.mp4',
        // './assets/media/Main-page/72.mp4',
        // './assets/media/Main-page/73.mp4',
        // './assets/media/Main-page/74.mp4',
        // './assets/media/Main-page/75.mp4',
        // './assets/media/Main-page/76.mp4',
        // './assets/media/Main-page/77.mp4',
        // './assets/media/Main-page/78.mp4',
        // './assets/media/Main-page/79.mp4',
        // './assets/media/Main-page/80.mp4',
        // './assets/media/Main-page/81.mp4',
        // './assets/media/Main-page/82.mp4',
        // './assets/media/Main-page/83.mp4',
        // './assets/media/Main-page/84.mp4',
        // './assets/media/Main-page/85.mp4',
        // './assets/media/Main-page/86.mp4',
        // './assets/media/Main-page/87.mp4',
        // './assets/media/Main-page/88.mp4',
        // './assets/media/Main-page/89.mp4',
        // './assets/media/Main-page/90.mp4',
        // './assets/media/Main-page/91.mp4',
        // './assets/media/Main-page/92.mp4',
        // './assets/media/Main-page/93.mp4',
        // './assets/media/Main-page/94.mp4',
        // './assets/media/Main-page/95.mp4',
        // './assets/media/Main-page/96.mp4',
        // './assets/media/Main-page/97.mp4',
        // './assets/media/Main-page/98.mp4',
        // './assets/media/Main-page/99.mp4',
        // './assets/media/Main-page/100.mp4',
    ];    

    // Генерация случайного индекса для приветствия
    const randomGreetingIndex = Math.floor(Math.random() * greetings.length);
    document.getElementById('greeting').textContent = greetings[randomGreetingIndex];

    // Генерация случайного индекса для видео
    const backgroundVideo = document.getElementById('backgroundVideo');
    const randomVideoIndex = Math.floor(Math.random() * videos.length);
    backgroundVideo.src = videos[randomVideoIndex];
    
    // Включаем видео сразу после его загрузки
    backgroundVideo.onloadeddata = () => {
        backgroundVideo.classList.add('show'); // Делаем видео видимым
        backgroundVideo.play(); // Запускаем видео
    };

    // Функция для смены видео каждые 10 секунд
    setInterval(() => {
        const newVideoIndex = Math.floor(Math.random() * videos.length);
        
        // Плавное отключение текущего видео
        backgroundVideo.classList.remove('show'); // Убираем класс для перехода

        setTimeout(() => {
            backgroundVideo.src = videos[newVideoIndex]; // Меняем источник видео
            backgroundVideo.load(); // Перезагрузка видео

            // Включаем видео после загрузки
            backgroundVideo.onloadeddata = () => {
                backgroundVideo.classList.add('show'); // Добавляем класс для плавного появления
                backgroundVideo.play(); // Запускаем новое видео
            };
        }, 500); // Задержка, чтобы видео успело потухнуть
    }, 10000); // 10000 миллисекунд = 10 секунд
});












