document.addEventListener('DOMContentLoaded', function() {
    // --- НАСТРОЙКИ ---
    const STRIPE_PUBLISHABLE_KEY = 'pk_test_51Rem4FCx81tTXrrEXk2ScyugQovPlckJUftlaUMEPbJOWNM3J2ARFkDwA1Y3TKPPtQYy9a4jRdlomAAnZc2QUpUZ00LHy3tp4f';

    // --- Инициализация сервисов ---
    const auth = firebase.auth();
    const db = firebase.firestore();

    // --- Получение элементов страницы ---
    const bankLoader = document.getElementById('bankLoader');
    const bankWrapper = document.getElementById('bankWrapper');
    const bankUserBalance = document.getElementById('bankUserBalance');
    const historyList = document.querySelector('.history-list');
    
    if (!bankWrapper || !bankLoader || !historyList) {
        console.error("Ключевые элементы страницы 'Банк' не найдены.");
        return;
    }
    
    let bankUnsubscribe = null;
    let historyUnsubscribe = null;
    let currentUser = null;

    // --- Основной обработчик ---
    auth.onAuthStateChanged(user => {
        // Отписываемся от старых слушателей при смене пользователя
        if (bankUnsubscribe) bankUnsubscribe();
        if (historyUnsubscribe) historyUnsubscribe();

        if (user) {
            currentUser = user;
            // Подписываемся на изменения баланса пользователя
            subscribeToBalanceUpdates(user.uid);
            // Загружаем историю транзакций
            subscribeToTransactionHistory(user.uid);
            // Добавляем ID пользователя в таблицы цен
            setClientReferenceId(user.uid);
        } else {
            currentUser = null;
            window.location.href = '/index.html';
        }
    });

    /**
     * Подписывается на изменения документа пользователя и обновляет баланс.
     * @param {string} uid - ID пользователя.
     */

    function setClientReferenceId(uid) {
        // Даем компоненту Stripe время на инициализацию
        setTimeout(() => {
            const pricingTables = document.querySelectorAll('stripe-pricing-table');
            if (pricingTables.length === 0) {
                console.warn("Таблицы цен Stripe еще не загружены. Повторная попытка через 1 секунду.");
                setTimeout(() => setClientReferenceId(uid), 1000); // Повторяем попытку
                return;
            }

            pricingTables.forEach(table => {
                table.setAttribute('client-reference-id', uid);
            });
            console.log(`Client Reference ID (${uid}) УСПЕШНО УСТАНОВЛЕН для ${pricingTables.length} таблиц.`);
        }, 500); // Начальная задержка в 500 мс
    }

    function subscribeToBalanceUpdates(uid) {
        bankUnsubscribe = db.collection('users').doc(uid)
            .onSnapshot(doc => {
                if (doc.exists) {
                    const data = doc.data();
                    if (bankUserBalance) {
                        bankUserBalance.textContent = (data.balance || 0).toLocaleString('ru-RU');
                    }
                    if (bankWrapper.classList.contains('loading')) {
                        bankWrapper.classList.remove('loading');
                        bankLoader.style.display = 'none';
                    }
                } else {
                    showBankError("Не удалось загрузить данные пользователя.");
                }
            }, error => {
                console.error("Ошибка при прослушивании данных банка:", error);
                showBankError("Произошла ошибка при загрузке данных.");
            });
    }

    /**
     * Подписывается на изменения в истории транзакций и отображает их.
     * @param {string} uid - ID пользователя.
     */
    function subscribeToTransactionHistory(uid) {
        const transactionsRef = db.collection('users').doc(uid).collection('transactions')
            .orderBy('timestamp', 'desc')
            .limit(10);

        historyUnsubscribe = transactionsRef.onSnapshot(snapshot => {
            const placeholder = historyList.querySelector('.history-item-placeholder');
            // Очищаем старые записи
            historyList.querySelectorAll('.history-item').forEach(item => item.remove());

            if (snapshot.empty) {
                placeholder.style.display = 'block';
            } else {
                placeholder.style.display = 'none';
                snapshot.forEach(doc => {
                    const tx = doc.data();
                    const historyItem = createHistoryItemElement(tx);
                    historyList.appendChild(historyItem);
                });
            }
        }, error => {
            console.error("Ошибка при загрузке истории транзакций:", error);
        });
    }

    /**
     * Создает HTML-элемент для одной записи в истории.
     * @param {object} tx - Данные транзакции.
     * @returns {HTMLElement}
     */
    function createHistoryItemElement(tx) {
        const item = document.createElement('div');
        item.className = 'history-item';

        const date = tx.timestamp.toDate();
        const formattedDate = date.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });
        const formattedTime = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        
        const amountSign = tx.type.includes('deposit') ? '+' : '-';
        const amountClass = tx.type.includes('deposit') ? 'text-success' : 'text-danger';

        item.innerHTML = `
            <div class="history-item-icon ${amountClass}">
                <i class="fas fa-arrow-down"></i>
            </div>
            <div class="history-item-details">
                <span class="history-item-title">Пополнение FireCoins</span>
                <span class="history-item-date">${formattedDate} в ${formattedTime}</span>
            </div>
            <div class="history-item-amount">
                <span class="coin-amount ${amountClass}">${amountSign}${tx.amount.toLocaleString('ru-RU')}</span>
                <span class="real-amount">${(tx.amount_paid || 0).toLocaleString('ru-RU', { style: 'currency', currency: tx.currency || 'USD' })}</span>
            </div>
        `;
        return item;
    }

    /**
     * Устанавливает client-reference-id для всех таблиц цен Stripe на странице.
     * Это связывает платеж с пользователем Firebase.
     * @param {string} uid - ID текущего пользователя Firebase.
     */
    function setClientReferenceId(uid) {
        const pricingTables = document.querySelectorAll('stripe-pricing-table');
        pricingTables.forEach(table => {
            table.setAttribute('client-reference-id', uid);
        });
        console.log(`Client Reference ID (${uid}) установлен для таблиц цен.`);
    }

    /**
     * Устанавливает идентификаторы для таблиц цен Stripe, чтобы связать платеж с пользователем.
     * Сначала пытается найти и использовать Stripe Customer ID. Если его нет, использует Firebase UID.
     * @param {string} uid - ID текущего пользователя Firebase.
     */
    function setClientReferenceId(uid) {
        const pricingTables = document.querySelectorAll('stripe-pricing-table');
        if (pricingTables.length === 0) {
            console.warn("Таблицы цен Stripe еще не загружены. Повторная попытка...");
            setTimeout(() => setClientReferenceId(uid), 1000);
            return;
        }

        // Ищем Stripe Customer ID пользователя в коллекции 'customers'
        const customerRef = db.collection('customers').doc(uid);
        customerRef.get().then(doc => {
            let customerId = null;
            if (doc.exists && doc.data().stripeId) {
                customerId = doc.data().stripeId;
                console.log("Найден Stripe Customer ID:", customerId);
            } else {
                console.log("Stripe Customer ID не найден, будет использован Firebase UID.");
            }

            pricingTables.forEach(table => {
                // Если есть customerId, передаем его. Это предпочтительный способ.
                if (customerId) {
                    table.setAttribute('customer', customerId);
                }
                // Всегда передаем UID как client-reference-id. Это наша подстраховка.
                table.setAttribute('client-reference-id', uid);
            });

            console.log(`Идентификаторы установлены для ${pricingTables.length} таблиц.`);

        }).catch(error => {
            console.error("Ошибка при получении Stripe Customer ID:", error);
            // В случае ошибки, просто устанавливаем UID как запасной вариант
            pricingTables.forEach(table => {
                table.setAttribute('client-reference-id', uid);
            });
        });
    }

    // Показываем сообщение об успехе/отмене после возврата со страницы Stripe.
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('status')) {
        const status = urlParams.get('status');
        if (status === 'success') {
            alert("Оплата прошла успешно! Ваш баланс скоро обновится.");
        }
        if (status === 'cancel') {
            alert("Оплата была отменена.");
        }
        window.history.replaceState({}, document.title, "/bank.html");
    }
});