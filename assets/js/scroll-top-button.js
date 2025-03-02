// Прокрутка 
$(document).ready(function () {
    // Отслеживаем прокрутку
    $(window).scroll(function () {
        // Если прокручено больше 100px, показываем кнопку
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });

    // При клике на кнопку "Back to Top", прокручиваем страницу вверх
    $('.back-to-top').click(function () {
        // Вариант 1: Прокрутка с анимацией 'easeInOutExpo' (если подключен плагин)
        $('html, body').animate({scrollTop: 0}, 15, 'easeInOutExpo', function () {
            // После анимации скрываем кнопку, если на самом верху
            if ($(window).scrollTop() === 0) {
                $('.back-to-top').fadeOut('slow');
            }
        });

        // Вариант 2: Стандартная анимация без плагина (используем 'linear')
        // $('html, body').animate({scrollTop: 0}, 1500, 'linear', function () {
        //     if ($(window).scrollTop() === 0) {
        //         $('.back-to-top').fadeOut('slow');
        //     }
        // });

        // Вариант 3: Мгновенная прокрутка (без анимации)
        // $('html, body').scrollTop(0); // Мгновенно прокручиваем страницу до верха

        return false; // Отменяем стандартное действие ссылки
    });
});