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
  const db = firebase.firestore(); // Инициализация Firestore

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

// Вспомогательная функция для проверки и создания документа пользователя в Firestore
async function checkAndCreateUserDocument(user) {
    if (!user) return;

    const userDocRef = db.collection('users').doc(user.uid);
    const doc = await userDocRef.get();

    if (!doc.exists) {
        // Документа нет, создаем его (первый вход)
        console.log(`Создание нового документа для пользователя ${user.uid}`);
        try {
            await userDocRef.set({
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                bannerURL: null, // Баннер
                balance: 0, // Начальный баланс
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error("Ошибка при создании документа пользователя:", error);
        }
    }
    // Если документ уже существует, ничего не делаем
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
        // Новый код в setupSocialAuth
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            auth.signInWithPopup(provider)
                .then((result) => {
                    // После успешного входа вызываем нашу новую функцию
                    return checkAndCreateUserDocument(result.user);
                })
                .then(() => {
                    // После проверки/создания документа закрываем модальные окна
                    if (elements.loginModal) elements.loginModal.style.display = "none";
                    if (elements.registerModal) elements.registerModal.style.display = "none";
                    const overlay = getElement('modalOverlay');
                    if (overlay) overlay.style.display = 'none';
                    document.body.style.overflow = 'auto';
                })
                .catch(error => {
                    console.error(`Ошибка входа через ${name}:`, error);
                    // Улучшаем сообщение об ошибке
                    if (error.code === 'auth/account-exists-with-different-credential') {
                        alert('Аккаунт с таким email уже существует, но привязан к другому способу входа. Попробуйте войти с помощью него.');
                    } else {
                        alert(`Ошибка входа через ${name}: ${error.message}`);
                    }
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

        // Проверка длины email
        if (email.length > 254) {
            alert("Введен слишком длинный email-адрес.");
            return; // Прерываем выполнение функции
        }

        auth.signInWithEmailAndPassword(email, password)
          .then((userCredential) => {
            // Проверяем верификацию email перед входом
            if (!userCredential.user.emailVerified) {
              auth.signOut();
              alert('Пожалуйста, подтвердите ваш email. Проверьте вашу почту.');
              return;
            }
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
        
        // 1. Получаем все данные
        const email = getElement("register_email_field").value;
        const password = getElement("register_password_field").value;
        const confirmPassword = getElement("confirm_password_field").value;
        const displayName = getElement("name_field").value.trim();

        // 2. Сначала проводим все проверки
        if (displayName.length < 3) {
            alert("Имя должно быть не короче 3 символов.");
            return;
        }
        if (email.length < 5 || email.length > 254) {
            alert("Длина email должна быть от 5 до 254 символов.");
            return;
        }
        if (password !== confirmPassword) {
            alert("Пароли не совпадают!");
            return;
        }

        // 3. Только после успешных проверок пытаемся создать пользователя
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                // Обновляем профиль в Auth
                return user.updateProfile({ displayName: displayName })
                    .then(() => {
                        // Создаем документ в Firestore
                        return db.collection("users").doc(user.uid).set({
                            displayName: displayName,
                            email: user.email,
                            photoURL: null,
                            bannerURL: null, // Баннер
                            balance: 0, // Начальный баланс
                            createdAt: firebase.firestore.FieldValue.serverTimestamp()
                        });
                    })
                    .then(() => {
                        // Отправляем письмо подтверждения
                        return user.sendEmailVerification();
                    });
            })
            .then(() => {
                alert('Письмо с подтверждением отправлено! Пожалуйста, проверьте почту.');
                if (elements.registerModal) elements.registerModal.style.display = "none";
                auth.signOut();
            })
            .catch(error => {
                alert("Ошибка регистрации: " + error.message);
            });
      });
    }
  }
    

    // Выход из системы
    // Новый универсальный обработчик для всех кнопок выхода
    function setupLogoutButtons() {
        const logoutButtons = document.querySelectorAll('.js-logout-btn');
        logoutButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                auth.signOut().catch(error => {
                    console.error("Ошибка при выходе из аккаунта:", error);
                    alert("Не удалось выйти. Пожалуйста, попробуйте снова.");
                });
            });
        });
    }

    setupLogoutButtons();
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

// Глобальная переменная для отписки от слушателя, чтобы избежать утечек памяти
let userDocUnsubscribe = null;

auth.onAuthStateChanged(user => {
  // Если пользователь меняется (входит или выходит), отписываемся от старого слушателя
  if (userDocUnsubscribe) {
    userDocUnsubscribe();
  }

  if (user) {
    // Пользователь авторизован
    
    // Подписываемся на изменения его документа в Firestore
    userDocUnsubscribe = db.collection('users').doc(user.uid).onSnapshot(doc => {
      if (doc.exists) {
        const userData = doc.data();
        
        // Создаем "синтетический" объект user, объединяя данные из Auth и Firestore
        const enrichedUser = {
          ...user, // все стандартные поля: uid, email, emailVerified
          displayName: userData.displayName || user.displayName, // имя из Firestore имеет приоритет
          photoURL: userData.photoURL || user.photoURL, // аватар из Firestore имеет приоритет
          balance: userData.balance || 0
        };

        // Вызываем одну функцию обновления UI с полными данными
        updateRealtimeUI(enrichedUser);

      } else {
        // Документа еще нет (редкий случай), показываем данные из Auth
        updateRealtimeUI(user);
      }
    }, error => {
        console.error("Ошибка при прослушивании документа пользователя:", error);
    });

  } else {
    // Пользователь не авторизован
    updateRealtimeUI(null);
  }
});

function updateRealtimeUI(user) {
  const loginBtn = document.getElementById("loginBtn");
  const profileMenu = document.getElementById("profileMenu");
  
  if (user) {
    // Пользователь авторизован
    if (loginBtn) loginBtn.style.display = "none";
    if (profileMenu) profileMenu.style.display = "flex";
    
    // Обновляем имя
    const profileName = document.getElementById("profileName");
    if (profileName) {
      profileName.textContent = user.displayName || user.email.split('@')[0];
    }
    
    const profileIconContainer = document.querySelector("#profileMenu .profile-icon");
    if (profileIconContainer) {
      if (user.photoURL) {
        // Если есть URL, создаем или обновляем <img>
        let avatarImg = profileIconContainer.querySelector('.profile-avatar');
        if (!avatarImg) {
          // Если <img> еще нет, создаем его и вставляем
          profileIconContainer.innerHTML = ''; // Очищаем от SVG
          avatarImg = document.createElement('img');
          avatarImg.alt = 'Аватар';
          avatarImg.className = 'profile-avatar';
          profileIconContainer.appendChild(avatarImg);
        }
        avatarImg.src = user.photoURL;
      } else {
        // Если URL нет, возвращаем стандартную SVG-иконку
        profileIconContainer.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
            <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="currentColor"/>
          </svg>
        `;
      }
    }
    
    // Обновляем баланс
    const balanceElement = document.getElementById('userBalance');
    if (balanceElement) {
      balanceElement.textContent = (user.balance || 0).toLocaleString('ru-RU');
    }

  } else {
    // Пользователь не авторизован
    if (loginBtn) loginBtn.style.display = "block";
    if (profileMenu) profileMenu.style.display = "none";
  }
}

  // Инициализация
  initAuth();
});