// Функционал модальных окон
        document.addEventListener('DOMContentLoaded', function() {
        const loginBtn = document.getElementById('loginBtn');
        const loginModal = document.getElementById('loginModal');
        const registerModal = document.getElementById('registerModal');
        const overlay = document.getElementById('modalOverlay');
        const closeButtons = document.querySelectorAll('.close');
        const showRegister = document.getElementById('showRegister');
        const showLogin = document.getElementById('showLogin');
        
        // Открытие модального окна входа
        loginBtn.addEventListener('click', function() {
            loginModal.style.display = 'block';
            overlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
        
        // Переключение между окнами входа и регистрации
        showRegister.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.style.display = 'none';
            registerModal.style.display = 'block';
        });
        
        showLogin.addEventListener('click', function(e) {
            e.preventDefault();
            registerModal.style.display = 'none';
            loginModal.style.display = 'block';
        });
        
        // Закрытие модальных окон
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
            overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
            });
        });
        
        // Закрытие при клике на затемнение
        overlay.addEventListener('click', function() {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
            overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        // Закрытие при нажатии ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
            overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
            }
        });
        
        // Обработка форм
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            // Здесь должна быть логика входа
            console.log('Login form submitted');
        });
        
        document.getElementById('registerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            // Здесь должна быть логика регистрации
            console.log('Register form submitted');
        });
        document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            
            // Меняем иконку
            const icon = this.querySelector('.eye-icon');
            if (type === 'password') {
            icon.innerHTML = '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>';
            } else {
            icon.innerHTML = '<path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>';
            }
        });
        });
        });