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
    
})(jQuery);

// Media API Main News
const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=b86ec97f0d174ec5a4fcfd10bf43c17f`; // API KEY
fetch(url)
    .then(response => response.json())
    .then(data => {
        const carouselItems = document.querySelectorAll('.main-carousel .position-relative');
        data.articles.forEach((newsItem, index) => {
            if (index < carouselItems.length) {
                const carouselItem = carouselItems[index];
                const img = carouselItem.querySelector('img');
                img.src = newsItem.urlToImage ? newsItem.urlToImage : 'img/default.png';
                const badge = carouselItem.querySelector('.badge');
                badge.href = newsItem.url;
                badge.textContent = newsItem.source.name;
                const date = carouselItem.querySelector('.text-white');
                date.href = newsItem.url;
                date.textContent = new Date(newsItem.publishedAt).toLocaleDateString();
                const title = carouselItem.querySelector('.h2');
                title.href = newsItem.url;
                title.textContent = newsItem.title;
            }
        });
    })
    .catch(error => console.error('Error:', error));

// Media API Main News №2
fetch(url)
    .then(response => response.json())
    .then(data => {
        const newsItems = document.querySelectorAll('.row.mx-0 .position-relative');
        data.articles.forEach((newsItem, index) => {
            if (index < newsItems.length) {
                const newsItemDiv = newsItems[index];
                const img = newsItemDiv.querySelector('img');
                img.src = newsItem.urlToImage ? newsItem.urlToImage : 'img/default.png';
                const badge = newsItemDiv.querySelector('.badge');
                badge.href = newsItem.url;
                badge.textContent = newsItem.source.name;
                const date = newsItemDiv.querySelector('.text-white');
                date.href = newsItem.url;
                date.textContent = new Date(newsItem.publishedAt).toLocaleDateString();
                const title = newsItemDiv.querySelector('.h6');
                title.href = newsItem.url;
                title.textContent = newsItem.title;
            }
        });
    })
    .catch(error => console.error('Error:', error));

// Media API FEATURED NEWS
fetch(url)
    .then(response => response.json())
    .then(data => {
        const newsCarouselItems = document.querySelectorAll('.news-carousel .position-relative');
        data.articles.forEach((newsItem, index) => {
            if (index < newsCarouselItems.length) {
                const carouselItem = newsCarouselItems[index];
                const img = carouselItem.querySelector('img');
                img.src = newsItem.urlToImage ? newsItem.urlToImage : 'img/default.png';
                const badge = carouselItem.querySelector('.badge');
                badge.href = newsItem.url;
                badge.textContent = newsItem.source.name;
                const date = carouselItem.querySelector('.text-white');
                date.href = newsItem.url;
                date.textContent = new Date(newsItem.publishedAt).toLocaleDateString();
                const title = carouselItem.querySelector('.h6');
                title.href = newsItem.url;
                title.textContent = newsItem.title;
            }
        });
    })
    .catch(error => console.error('Error:', error));

fetch(url)
    .then(response => response.json())
    .then(data => {
        const newsItems = document.querySelectorAll('.position-relative.mb-3');
        data.articles.forEach((newsItem, index) => {
            if (index < newsItems.length) {
                const newsItemDiv = newsItems[index];
                const img = newsItemDiv.querySelector('img');
                img.src = newsItem.urlToImage ? newsItem.urlToImage : 'img/default.png';
                const badge = newsItemDiv.querySelector('.badge');
                badge.href = newsItem.url;
                badge.textContent = newsItem.source.name;
                const date = newsItemDiv.querySelector('.text-body');
                date.href = newsItem.url;
                date.textContent = new Date(newsItem.publishedAt).toLocaleDateString();
                const title = newsItemDiv.querySelector('.h4');
                title.href = newsItem.url;
                title.textContent = newsItem.title;
            }
        });
    })
    .catch(error => console.error('Error:', error));

fetch(url)
    .then(response => response.json())
    .then(data => {
        const newsItems = document.querySelectorAll('.row.news-lg.mx-0.mb-3');
        data.articles.forEach((newsItem, index) => {
            if (index < newsItems.length) {
                const newsItemDiv = newsItems[index];
                const img = newsItemDiv.querySelector('img');
                img.src = newsItem.urlToImage ? newsItem.urlToImage : 'img/default.png';
                const badge = newsItemDiv.querySelector('.badge');
                badge.href = newsItem.url;
                badge.textContent = newsItem.source.name;
                const date = newsItemDiv.querySelector('.text-body');
                date.href = newsItem.url;
                date.textContent = new Date(newsItem.publishedAt).toLocaleDateString();
                const title = newsItemDiv.querySelector('.h4');
                title.href = newsItem.url;
                title.textContent = newsItem.title;
                const description = newsItemDiv.querySelector('p');
                description.textContent = newsItem.description;
            }
        });
    })
    .catch(error => console.error('Error:', error));

// Media API TRANDING NEWS
fetch(url)
    .then(response => response.json())
    .then(data => {
        const newsItems = document.querySelectorAll('.d-flex.align-items-center.bg-white.mb-3');
        data.articles.forEach((newsItem, index) => {
            if (index < newsItems.length) {
                const newsItemDiv = newsItems[index];
                const badge = newsItemDiv.querySelector('.badge');
                badge.href = newsItem.url;
                badge.textContent = newsItem.source.name;
                const date = newsItemDiv.querySelector('.text-body');
                date.href = newsItem.url;
                date.textContent = new Date(newsItem.publishedAt).toLocaleDateString();
                const title = newsItemDiv.querySelector('.h6');
                title.href = newsItem.url;
                title.textContent = newsItem.title;
            }
        });
    })
    .catch(error => console.error('Error:', error));

// Media API
fetch(url)
    .then(response => response.json())
    .then(data => {
        const newsItems = document.querySelectorAll('.col-lg-3.col-md-6.mb-5 .mb-3 ');
        data.articles.forEach((newsItem, index) => {
            if (index < newsItems.length) {
                const newsItemDiv = newsItems[index];
                const badge = newsItemDiv.querySelector('.badge');
                if (badge) {
                    badge.href = newsItem.url;
                    badge.textContent = newsItem.source.name;
                }
                const date = newsItemDiv.querySelector('.text-body');
                if (date) {
                    date.href = newsItem.url;
                    date.textContent = new Date(newsItem.publishedAt).toLocaleDateString();
                }
                const title = newsItemDiv.querySelector('.small');
                if (title) {
                    title.href = newsItem.url;
                    title.textContent = newsItem.title;
                }
            }
        });
    })
    .catch(error => console.error('Error:', error));










    



