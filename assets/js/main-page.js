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
        'Приветики',
        'ʕ ᵔᴥᵔ ʔ',
    ];    

    // Генерация случайного индекса для приветствия
    const randomGreetingIndex = Math.floor(Math.random() * greetings.length);
    document.getElementById('greeting').textContent = greetings[randomGreetingIndex];

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











