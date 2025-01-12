///////// <-Footer-JS-> ////////////

document.addEventListener("DOMContentLoaded", () => {
    // Функция для обновления времени и даты
    function updateTime() {
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString("uk-UA"); // Формат для Украины (дд.мм.гггг)
        const formattedTime = currentDate.toLocaleTimeString("uk-UA"); // Формат времени (часы:минуты:секунды)

        // Обновляем только нужные элементы в футере
        document.getElementById("footerYear").textContent = currentDate.getFullYear();
        document.getElementById("footerDate").textContent = `Date: ${formattedDate}`;
        document.getElementById("footerTime").textContent = `Time: ${formattedTime}`;
    }

    // Изначально создаем футер с нужными элементами
    const footerHTML = `
        <footer id="footer" style="display: none;">
            <p>© <span id="footerYear"></span> CrazyFire & AppHaven project. Все права защищены.</p>    
            <div class="footer-links">
                <a href="/Info-pages/about.html">Про нас</a>
                <a href="/Info-pages/contacts.html">Контакты(Beta)</a>
                <a href="/Info-pages/privacy.html">Конфиденциальность(Beta)</a>
            </div>
            <div>
                <div class="footer-bottom">
                    <div class="footer-admin-button">
                        <a href="./admin-admin.html" class="btn btn-secondary">
                            <i class="fas fa-cogs"></i>
                        </a>
                    </div>
                    <h6 class="m-3">
                        Update v1.0 | <span id="footerDate"></span> | <span id="footerTime"></span>
                    </h6>
                </div>
            </div>
        </footer>
    `;

    // Добавляем футер в конец body
    document.body.insertAdjacentHTML("beforeend", footerHTML);

    // Обновляем время каждую секунду
    setInterval(updateTime, 1000);

    // Изначально вызываем функцию для первого отображения
    updateTime();

    // Проверка текущей страницы
    const currentPage = window.location.pathname;

    // Если это главная страница
    if (currentPage.includes("index.html") || currentPage === "/") {
        const startButton = document.getElementById("startButton"); // Кнопка "Начать"
        if (startButton) {
            startButton.addEventListener("click", () => {
                document.getElementById("footer").style.display = "block";
            });
        }
    } else {
        // На других страницах показываем футер всегда
        document.getElementById("footer").style.display = "block";
    }
});


///////// <-Footer-JS-> ////////////