document.addEventListener('DOMContentLoaded', function() {
    const auth = firebase.auth();
    const db = firebase.firestore();

    const bankLoader = document.getElementById('bankLoader');
    const bankWrapper = document.getElementById('bankWrapper');
    const bankUserBalance = document.getElementById('bankUserBalance');
    const topUpBtn = document.getElementById('topUpBtn');
    
    if (!bankWrapper || !bankLoader) return;
    
    let bankUnsubscribe = null;

    auth.onAuthStateChanged(user => {
        // Если пользователь меняется (например, выходит из системы), отписываемся от старого слушателя
        if (bankUnsubscribe) {
            bankUnsubscribe();
        }

        if (user) {
            // Пользователь авторизован, подписываемся на изменения его баланса
            bankUnsubscribe = db.collection('users').doc(user.uid)
                .onSnapshot(doc => {
                    if (doc.exists) {
                        const data = doc.data();
                        
                        // Обновляем баланс в реальном времени
                        if (bankUserBalance) {
                            bankUserBalance.textContent = (data.balance || 0).toLocaleString('ru-RU');
                        }
                        
                        // Показываем контент (только при первой загрузке)
                        if (bankWrapper.classList.contains('loading')) {
                            bankWrapper.classList.remove('loading');
                            bankLoader.style.display = 'none';
                        }
                    } else {
                        // Если вдруг документа нет, показываем ошибку
                        bankWrapper.innerHTML = '<p class="text-danger text-center">Не удалось загрузить данные пользователя. Пожалуйста, попробуйте войти снова.</p>';
                        if (bankWrapper.classList.contains('loading')) {
                            bankLoader.style.display = 'none';
                            bankWrapper.classList.remove('loading');
                        }
                    }
                }, error => {
                    console.error("Ошибка при прослушивании данных банка:", error);
                });

        } else {
            // Пользователь не авторизован, перенаправляем на главную
            window.location.href = '/index.html';
        }
    });

    if (topUpBtn) {
        topUpBtn.addEventListener('click', () => {
            // STRIPE
            alert('Функция пополнения баланса находится в разработке!');
        });
    }
});