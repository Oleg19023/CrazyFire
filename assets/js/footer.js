///////// <-Footer-JS-> ////////////

document.addEventListener("DOMContentLoaded", () => {
    // Функция для обновления времени и даты
    function updateTime() {
        const currentDate = new Date();
        const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
        
        const formattedDate = currentDate.toLocaleDateString("uk-UA", dateOptions);
        const formattedTime = currentDate.toLocaleTimeString("uk-UA", timeOptions);

        const yearEl = document.getElementById("footerYear");
        if (yearEl) yearEl.textContent = currentDate.getFullYear();
        
        const dateEl = document.getElementById("footerDate");
        if (dateEl) dateEl.textContent = formattedDate;

        const timeEl = document.getElementById("footerTime");
        if (timeEl) timeEl.textContent = formattedTime;
    }

    const footerHTML = `
        <footer id="footer" class="footer-hidden">
            <div class="footer-container">
                <div class="footer-top">
                    <div class="footer-info">
                        <img src="/assets/images/Site-logos/4kLogo2.webp" alt="logo" class="footer-logo">
                        <div class="footer-text-block">
                            <p class="copyright"><b>© 2023-<span id="footerYear"></b></span> <b>CrazyFire. Все права защищены.</b></p>
                            <p class="trademark">Заставка, логотип и FireCoin являются товарными знаками CrazyFire.</p>
                        </div>
                    </div>
                    <div class="footer-social">
                        <a href="https://www.youtube.com/@-WizarD_" target="_blank" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
                        <a href="/Program-pages/Discord-pages.html" aria-label="Discord"><i class="fab fa-discord"></i></a>
                        <a href="https://t.me/CrazyFireApp" target="_blank" aria-label="Telegram"><i class="fab fa-telegram-plane"></i></a>
                        <a href="https://www.instagram.com/w1zardii/" target="_blank" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                        <a href="https://www.facebook.com/profile.php?id=100084032918642" target="_blank" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                    </div>
                </div>

                <hr class="footer-divider">

                <div class="footer-bottom">
                    <div class="footer-links">
                        <a href="/Info-pages/about.html">Про нас</a>
                        <a href="/Info-pages/contacts.html">Контакты</a>
                        <a href="/Info-pages/privacy.html">Конфиденциальность</a>
                    </div>
                    <div class="footer-meta">
                        <a href="/AdminSettings.html" class="btn btn-secondary admin-button" title="Настройки">
                            <i class="fas fa-cogs"></i>
                        </a>
                        <a class="update-button" href="/Info-pages/update-history.html"><b>Версия <b>2.8</b></b> </a>
                        <span class="footer-separator">|</span>
                        <span id="footerDate"></span>
                        <span class="footer-separator">|</span>
                        <span id="footerTime"></span>
                    </div>
                </div>
            </div>
        </footer>
    `;

    document.body.insertAdjacentHTML("beforeend", footerHTML);

    setInterval(updateTime, 1000);
    updateTime();

    const footerElement = document.getElementById("footer");
    const currentPage = window.location.pathname;

    if (currentPage.includes("index.html") || currentPage === "/") {
        const startButton = document.getElementById("startButton");
        if (startButton) {
            startButton.addEventListener("click", () => {
                footerElement.classList.remove("footer-hidden");
            });
        }
    } else {
        footerElement.classList.remove("footer-hidden");
    }
});


///////// <-Footer-JS-> ////////////