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
        'Что нового?',
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
    ];    

    const videos = [
        './assets/media/3196062-uhd_3840_2160_25fps.mp4',
        './assets/media/3205619-hd_1920_1080_25fps.mp4',
        './assets/media/3205627-hd_1920_1080_25fps.mp4',
        './assets/media/3255275-uhd_3840_2160_25fps.mp4',
        './assets/media/4253156-uhd_3840_2160_25fps.mp4',
        './assets/media/5519939-uhd_3840_2160_30fps.mp4',
        './assets/media/6963744-hd_1920_1080_25fps.mp4',
        './assets/media/2282013-uhd_3840_2024_24fps.mp4',
        './assets/media/7989682-hd_1920_1080_25fps.mp4',
        './assets/media/2278095-hd_1920_1080_30fps.mp4',
        './assets/media/2865279-uhd_3840_2160_30fps.mp4',
        './assets/media/3255156-uhd_3840_2160_25fps.mp4',
        './assets/media/3126361-uhd_3840_2160_25fps.mp4',
        './assets/media/854053-hd_1920_1080_25fps.mp4',
        './assets/media/7989448-hd_1920_1080_25fps.mp4',
        './assets/media/3121459-uhd_3840_2160_24fps.mp4',
        './assets/media/3121138-uhd_3840_2160_24fps.mp4',
        './assets/media/8425708-uhd_3840_2160_25fps.mp4',
        './assets/media/11904029_3840_2160_30fps.mp4',
        './assets/media/11904103_3840_2160_24fps.mp4',
        './assets/media/11904085_3840_2160_24fps.mp4',
        './assets/media/3191572-uhd_3840_2160_25fps.mp4',
        './assets/media/3130284-uhd_3840_2160_30fps.mp4',
        './assets/media/18069232-uhd_3840_2160_24fps.mp4'

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












