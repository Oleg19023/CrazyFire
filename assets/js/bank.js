document.addEventListener('DOMContentLoaded', function() {
    const auth = firebase.auth();
    const db = firebase.firestore();

    const bankLoader = document.getElementById('bankLoader');
    const bankWrapper = document.getElementById('bankWrapper');
    const bankUserBalance = document.getElementById('bankUserBalance');
    const topUpBtn = document.getElementById('topUpBtn');
    
    if (!bankWrapper || !bankLoader) return;

    auth.onAuthStateChanged(user => {
        if (user) {
            // Пользователь авторизован, загружаем его баланс
            const userDocRef = db.collection('users').doc(user.uid);
            userDocRef.get().then(doc => {
                if (doc.exists) {
                    const data = doc.data();
                    if (bankUserBalance) {
                        bankUserBalance.textContent = (data.balance || 0).toLocaleString('ru-RU');
                    }
                    // Показываем контент
                    bankWrapper.classList.remove('loading');
                    bankLoader.style.display = 'none';
                } else {
                    // Если вдруг документа нет, показываем ошибку
                    bankWrapper.innerHTML = '<p class="text-danger text-center">Не удалось загрузить данные пользователя. Пожалуйста, попробуйте войти снова.</p>';
                    bankLoader.style.display = 'none';
                    bankWrapper.classList.remove('loading');
                }
            });
        } else {
            // Пользователь не авторизован, перенаправляем на главную
            window.location.href = '/index.html';
        }
    });

    if (topUpBtn) {
        topUpBtn.addEventListener('click', () => {
            // TODO: Здесь будет логика перехода на страницу оплаты
            alert('Функция пополнения баланса находится в разработке!');
        });
    }
});