document.addEventListener("DOMContentLoaded", function() {
  // Конфигурация Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyB-nLWTMjzrsfYiDtHeItdT3Aa2KAEWqoI",
    authDomain: "crazyfire-app.firebaseapp.com",
    projectId: "crazyfire-app",
    storageBucket: "crazyfire-app.firebasestorage.app",
    messagingSenderId: "218958038563",
    appId: "1:218958038563:web:07df108430af2145f45396",
    measurementId: "G-X69JL6FMKQ"
  };

  // Инициализация Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();

  // Безопасное получение элементов
  function getElement(id) {
    const el = document.getElementById(id);
    if (!el) console.warn(`Элемент #${id} не найден`);
    return el;
  }

  // Получаем элементы
  const elements = {
    loginModal: getElement("loginModal"),
    registerModal: getElement("registerModal"),
    loginBtn: getElement("loginBtn"),
    profileMenu: getElement("profileMenu"),
    profileName: getElement("profileName"),
    profileEmail: getElement("profileEmail"),
    logoutBtn: getElement("logoutBtn"),
    loginForm: getElement("loginForm"),
    registerForm: getElement("registerForm")
  };

  // Управление видимостью элементов
  function toggleElement(el, show) {
    if (el) el.style.display = show ? "block" : "none";
  }
  

  // Функция обновления баланса
function updateBalance(balance) {
  const balanceElement = document.getElementById('userBalance');
  if (balanceElement) {
    balanceElement.textContent = balance.toLocaleString('ru-RU');
    
    // Анимация при изменении
    balanceElement.classList.add('balance-update');
    setTimeout(() => {
      balanceElement.classList.remove('balance-update');
    }, 500);
  }
}

// Обновление интерфейса
function updateUI(user) {
  const loginBtn = document.getElementById("loginBtn");
  const profileMenu = document.getElementById("profileMenu");
  
  if (user) {
    // Пользователь авторизован
    if (loginBtn) loginBtn.style.display = "none";
    if (profileMenu) profileMenu.style.display = "flex"; // Изменили на flex
    
    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");
    
    if (profileName) {
      // Отображаем имя или email
      profileName.textContent = user.displayName || user.email.split('@')[0];
    }
    
    if (profileEmail) {
      profileEmail.textContent = user.email;
    }
    
    // Добавляем аватар, если есть
    if (user.photoURL) {
      const profileIcon = document.querySelector(".profile-icon");
      if (profileIcon) {
        profileIcon.innerHTML = `<img src="${user.photoURL}" alt="Аватар" class="profile-avatar">`;
      }
    }
  } else {
    // Пользователь не авторизован
    if (loginBtn) loginBtn.style.display = "block";
    if (profileMenu) profileMenu.style.display = "none";
  }
  if (user) {
    // Пример получения баланса (замените на вашу логику)
    const userBalance = 0; // Здесь должно быть реальное значение
    updateBalance(userBalance);
  }
}

// Инициализация аутентификации
function initAuth() {
  // Социальная аутентификация
  function setupSocialAuth() {
    const providers = {
      'google': new firebase.auth.GoogleAuthProvider(),
      'facebook': (() => {
        const p = new firebase.auth.FacebookAuthProvider();
        p.addScope('email');
        return p;
      })(),
      'github': new firebase.auth.GithubAuthProvider(),
      'apple': (() => {
        const p = new firebase.auth.OAuthProvider('apple.com');
        p.addScope('email');
        p.addScope('name');
        return p;
      })(),
      'discord': (() => {
        const p = new firebase.auth.OAuthProvider('discord.com');
        p.addScope('email');
        p.addScope('identify');
        return p;
      })(),
      'x': (() => {
        const p = new firebase.auth.OAuthProvider('x.com');
        p.addScope('email');
        return p;
      })()
    };

    Object.entries(providers).forEach(([name, provider]) => {
      const buttons = document.querySelectorAll(`.${name}-auth`);
      buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          auth.signInWithPopup(provider)
            .then(() => {
              if (elements.loginModal) elements.loginModal.style.display = "none";
              if (elements.registerModal) elements.registerModal.style.display = "none";
            })
            .catch(error => {
              console.error(`Ошибка входа через ${name}:`, error);
              alert(`Ошибка входа через ${name}: ${error.message}`);
            });
        });
      });
    });
  }

    // Email/пароль аутентификация
    function setupEmailAuth() {
      if (elements.loginForm) {
        elements.loginForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const email = getElement("login_email_field").value;
          const password = getElement("login_password_field").value;

          auth.signInWithEmailAndPassword(email, password)
            .then(() => {
              if (elements.loginModal) elements.loginModal.style.display = "none";
            })
            .catch(error => {
              alert("Ошибка входа: " + error.message);
            });
        });
      }

      if (elements.registerForm) {
        elements.registerForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const email = getElement("register_email_field").value;
          const password = getElement("register_password_field").value;
          const confirmPassword = getElement("confirm_password_field").value;

          if (password !== confirmPassword) {
            alert("Пароли не совпадают!");
            return;
          }

          auth.createUserWithEmailAndPassword(email, password)
            .then(() => {
              if (elements.registerModal) elements.registerModal.style.display = "none";
            })
            .catch(error => {
              alert("Ошибка регистрации: " + error.message);
            });
        });
      }
    }
    

    // Выход из системы
    if (elements.logoutBtn) {
      elements.logoutBtn.addEventListener("click", () => {
        auth.signOut();
      });
    }

    setupSocialAuth();
    setupEmailAuth();
  }

    // Обработчик кнопки сброса пароля
    document.getElementById('resetPassword').addEventListener('click', function(e) {
    e.preventDefault();
    
    // Запросим email пользователя
    const email = prompt('Введите ваш email для сброса пароля:');
    
    if (email) {
        firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            alert('Письмо для сброса пароля отправлено на ' + email);
        })
        .catch(error => {
            console.error('Ошибка сброса пароля:', error);
            alert('Ошибка: ' + error.message);
        });
    }
    });

  // Отслеживание состояния аутентификации
  auth.onAuthStateChanged(user => {
    updateUI(user);
  });

  // Инициализация
  initAuth();
});







// const firebaseConfig = {
//   apiKey: "AIzaSyB-nLWTMjzrsfYiDtHeItdT3Aa2KAEWqoI",
//   authDomain: "crazyfire-app.firebaseapp.com",
//   projectId: "crazyfire-app",
//   storageBucket: "crazyfire-app.firebasestorage.app",
//   messagingSenderId: "218958038563",
//   appId: "1:218958038563:web:07df108430af2145f45396",
//   measurementId: "G-X69JL6FMKQ"
// };

// // Инициализация Firebase
// firebase.initializeApp(firebaseConfig);

// // Инициализация FirebaseUI
// const ui = new firebaseui.auth.AuthUI(firebase.auth());

// ui.start("#firebaseui-auth-container", {
//   signInOptions: [
//     firebase.auth.EmailAuthProvider.PROVIDER_ID,
//     firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//     firebase.auth.FacebookAuthProvider.PROVIDER_ID,
//   ],
//   signInSuccessUrl: "/", // URL, куда перенаправить после успешного входа
// });

// firebase.auth().onAuthStateChanged((user) => {
//   if (user) {
//     console.log("Пользователь вошел:", user.email);
//   } else {
//     console.log("Пользователь вышел");
//   }
// });