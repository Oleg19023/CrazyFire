document.addEventListener('DOMContentLoaded', () => {
    // --- НАСТРОЙКИ API ---
    const API_KEY = '718082ede25572b07cd3b7c0f7ec7534';
    const GNEWS_URL = `https://gnews.io/api/v4/search?q=technology&lang=ru&max=5&apikey=${API_KEY}`;
    
    const newsWrapper = document.querySelector('#news-carousel .swiper-wrapper');
    if (!newsWrapper) return;

    // --- ФУНКЦИЯ ЗАГРУЗКИ НОВОСТЕЙ ---
    async function fetchNews() {
        try {
            const response = await fetch(GNEWS_URL);
            if (!response.ok) throw new Error(`Ошибка сети: ${response.status}`);
            const data = await response.json();
            return data.articles;
        } catch (error) {
            console.error("Ошибка при загрузке новостей:", error);
                const errorHTML = `
                <div class="swiper-slide news-error">
                    <i class="fas fa-exclamation-triangle error-icon"></i>
                    <h4>Не удалось загрузить новости</h4>
                    <p>Возможные причины: привышен лимит API, региональные ограничения или проблема с интернет-соединением.</p>
                </div>
            `;
            newsWrapper.innerHTML = errorHTML;
            return null;
        }
    }

    // --- ФУНКЦИЯ СОЗДАНИЯ СЛАЙДОВ ---
    function createNewsSlides(articles) {
        newsWrapper.innerHTML = '';
        
        articles.forEach(article => {
            const imageUrl = article.image || ''; 
            
            const slideHTML = `
                <div class="swiper-slide">
                    <a href="${article.url}" target="_blank" class="news-item" style="background-image: url('${imageUrl}')">
                        <div class="news-item-overlay">
                            <h5 class="news-item-title">${article.title}</h5>
                            <span class="news-item-source">${article.source.name}</span>
                        </div>
                    </a>
                </div>
            `;
            newsWrapper.insertAdjacentHTML('beforeend', slideHTML);
        });
    }

    // --- ОСНОВНАЯ ЛОГИКА ---
    fetchNews().then(articles => {
        if (articles && articles.length > 0) {
            createNewsSlides(articles);
            
            // --- ИНИЦИАЛИЗАЦИЯ КАРУСЕЛИ С НОВЫМИ НАСТРОЙКАМИ ---
            window.newsSwiper = new Swiper('#news-carousel', {
                loop: true,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                },
                speed: 800,
                pagination: {
                  el: '.swiper-pagination',
                  clickable: true,
                },
            });
        }
    });
});