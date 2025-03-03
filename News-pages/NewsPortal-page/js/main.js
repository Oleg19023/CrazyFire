(function ($) {
    "use strict";
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Main News carousel
    $(".main-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        items: 1,
        dots: true,
        loop: true,
        center: true,
    });


    // Tranding carousel
    $(".tranding-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 2000,
        items: 1,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left"></i>',
            '<i class="fa fa-angle-right"></i>'
        ]
    });


    // Carousel item 1
    $(".carousel-item-1").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        items: 1,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ]
    });

    // Carousel item 2
    $(".carousel-item-2").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 30,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            }
        }
    });


    // Carousel item 3
    $(".carousel-item-3").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 30,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });
    

    // Carousel item 4
    $(".carousel-item-4").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 30,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            },
            1200:{
                items:4
            }
        }
    });
    // const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=b86ec97f0d174ec5a4fcfd10bf43c17f`; // API KEY
    // const url = `https://gnews.io/api/v4/search?q=example&apikey=718082ede25572b07cd3b7c0f7ec7534`; // API KEY
    
})(jQuery);


// const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=b86ec97f0d174ec5a4fcfd10bf43c17f`; // API KEY OLD

// // Универсальная функция для заполнения новостей
// function fillNews(selector, data, maxItems) {
//     const newsItems = document.querySelectorAll(selector);
//     data.slice(0, maxItems).forEach((newsItem, index) => {
//         const newsDiv = newsItems[index];

//         if (!newsDiv) return;

//         const img = newsDiv.querySelector('img');
//         if (img) img.src = newsItem.urlToImage || 'img/default.png';

//         const badge = newsDiv.querySelector('.badge');
//         if (badge) {
//             badge.href = newsItem.url;
//             badge.textContent = newsItem.source?.name || 'Unknown';
//         }

//         const date = newsDiv.querySelector('.text-body, .text-white');
//         if (date) {
//             date.href = newsItem.url;
//             date.textContent = newsItem.publishedAt
//                 ? new Date(newsItem.publishedAt).toLocaleDateString()
//                 : 'No date';
//         }

//         const title = newsDiv.querySelector('.h2, .h4, .h6, .small');
//         if (title) {
//             title.href = newsItem.url;
//             title.textContent = newsItem.title || 'No title';
//         }

//         const description = newsDiv.querySelector('p');
//         if (description) {
//             description.textContent = newsItem.description || 'No description';
//         }
//     });
// }

// // Запрос к API
// fetch(url)
//     .then(response => response.json())
//     .then(data => {
//         if (!data.articles) throw new Error("No articles found");

//         fillNews('.main-carousel .position-relative', data.articles, 5);
//         fillNews('.row.mx-0 .position-relative', data.articles, 5);
//         fillNews('.news-carousel .position-relative', data.articles, 5);
//         fillNews('.position-relative.mb-3', data.articles, 5);
//         fillNews('.row.news-lg.mx-0.mb-3', data.articles, 5);
//         fillNews('.d-flex.align-items-center.bg-white.mb-3', data.articles, 5);
//         fillNews('.col-lg-3.col-md-6.mb-5 .mb-3', data.articles, 5);
//     })
//     .catch(error => console.error('Error:', error));





// Новый URL API
const url = `https://gnews.io/api/v4/search?q=example&apikey=718082ede25572b07cd3b7c0f7ec7534`;

function fillNews(selector, data, maxItems) {
    console.log('Fetched data:', data);
    const newsItems = document.querySelectorAll(selector);

    data.slice(0, maxItems).forEach((newsItem, index) => {
        const newsDiv = newsItems[index];

        if (!newsDiv) return;

        const img = newsDiv.querySelector('img');
        if (img) {
            img.src = newsItem.image || 'img/default.png';
            console.log('Image src set to:', img.src);
        }

        const badge = newsDiv.querySelector('.badge');
        if (badge) {
            badge.href = newsItem.url;
            badge.textContent = newsItem.source?.name || 'Unknown';
        }

        const date = newsDiv.querySelector('.text-body, .text-white');
        if (date) {
            date.href = newsItem.url;
            date.textContent = newsItem.publishedAt
                ? new Date(newsItem.publishedAt).toLocaleDateString()
                : 'No date';
        }

        const title = newsDiv.querySelector('.h6'); // Убедитесь, что этот класс правильный
        if (title) {
            title.href = newsItem.url;
            title.textContent = newsItem.title || 'No title';
        }

        const description = newsDiv.querySelector('p');
        if (description) {
            description.textContent = newsItem.description || 'No description';
        }
    });
}

// Запрос к API
fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data.articles); // Выводим новости в консоль для проверки
        if (!data.articles) throw new Error("No articles found");

        fillNews('.main-carousel .position-relative', data.articles, 5);
        fillNews('.row.mx-0 .position-relative', data.articles, 5);
        fillNews('.news-carousel .position-relative', data.articles, 5);
        fillNews('.position-relative.mb-3', data.articles, 5);
        fillNews('.row.news-lg.mx-0.mb-3', data.articles, 5);
        fillNews('.d-flex.align-items-center.bg-white.mb-3', data.articles, 5);
        fillNews('.col-lg-3.col-md-6.mb-5 .mb-3', data.articles, 5);
    })
    .catch(error => console.error('Error:', error));












    



