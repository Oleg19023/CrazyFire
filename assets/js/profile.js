document.addEventListener('DOMContentLoaded', function() {
    // Инициализация сервисов Firebase
    const auth = firebase.auth();
    const db = firebase.firestore();

    // Получаем элементы страницы, проверяя их наличие
    function getElement(id) {
        const el = document.getElementById(id);
        if (!el) console.warn(`Элемент с id "${id}" не найден на странице.`);
        return el;
    }

    const profileLoader = getElement('profileLoader');
    const profileWrapper = getElement('profileWrapper');
    const profileIcon = getElement('profileIcon');
    const profileNameDisplay = getElement('profileNameDisplay');
    const profileEmailDisplay = getElement('profileEmailDisplay');
    const userBalanceDisplay = getElement('userBalanceDisplay');
    const profileCreatedAt = getElement('profileCreatedAt');
    const avatarInput = getElement('avatarInput');

    // Элементы для модального окна
    const editProfileBtn = getElement('editProfileBtn');
    const changeAvatarBtn = getElement('changeAvatarBtn'); // Кнопка на аватаре
    const editProfileModalEl = getElement('editProfileModal');
    
    // Проверяем, что ключевые элементы существуют
    if (!profileWrapper || !profileLoader || !editProfileModalEl) {
        console.error("Ключевые элементы профиля или модальное окно не найдены. Скрипт не может быть выполнен.");
        return;
    }

    const editProfileModal = new bootstrap.Modal(editProfileModalEl);
    
    // Глобальная переменная для текущего пользователя
    let currentUser = null;

    // Главный обработчик состояния аутентификации
    auth.onAuthStateChanged(user => {
            if (user) {
                currentUser = user;
                loadProfileDataFromFirestore(user.uid);
                setupEventListeners();
            } else {
                window.location.href = '/index.html';
            }
        });

    // Функция загрузки данных ТОЛЬКО из Firestore
    function loadProfileDataFromFirestore(uid) {
        const userDocRef = db.collection('users').doc(uid);
        
        userDocRef.get().then(doc => {
            if (doc.exists) {
                const data = doc.data();
                
                // Заполняем данные на странице профиля
                profileNameDisplay.textContent = data.displayName || 'Имя не указано';
                profileEmailDisplay.textContent = data.email;
                profileIcon.src = data.photoURL || './assets/images/None-person.jpg';
                userBalanceDisplay.textContent = (data.balance || 0).toLocaleString('ru-RU');
                
                if (data.createdAt && data.createdAt.toDate) {
                   const creationDate = data.createdAt.toDate();
                   profileCreatedAt.textContent = creationDate.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });
                }

                // Показываем контент
                profileWrapper.classList.remove('loading');
                profileLoader.style.display = 'none';

            } else {
                console.error("Документ пользователя не найден в Firestore!");
                // Можно перенаправить на страницу ошибки или попробовать создать документ
            }
        }).catch(error => {
            console.error("Ошибка при загрузке данных профиля:", error);
        });
    }

    // Настраиваем все обработчики событий
    function setupEventListeners() {
        const saveProfileChangesBtn = getElement('saveProfileChanges');
        const newDisplayNameInput = getElement('newDisplayName');
        const newPhotoURLInput = getElement('newPhotoURL');

        // Обе кнопки (Редактировать и Камера на аватаре) открывают одно и то же модальное окно
        if (editProfileBtn) {
            editProfileBtn.classList.remove('disabled');
            editProfileBtn.addEventListener('click', () => {
                // Перед открытием заполняем поля актуальными данными
                newDisplayNameInput.value = currentUser.displayName;
                newPhotoURLInput.value = currentUser.photoURL || '';
                editProfileModal.show();
            });
        }
        if (changeAvatarBtn) {
            changeAvatarBtn.addEventListener('click', () => {
                newDisplayNameInput.value = currentUser.displayName;
                newPhotoURLInput.value = currentUser.photoURL || '';
                editProfileModal.show();
            });
        }

        // Логика сохранения
        if (saveProfileChangesBtn) {
            saveProfileChangesBtn.addEventListener('click', () => {
                const newName = newDisplayNameInput.value.trim();
                const newURL = newPhotoURLInput.value.trim();
                
                if (newName.length < 3) {
                    alert("Имя должно быть не короче 3 символов.");
                    return;
                }

                // Функция для сохранения данных после всех проверок
                const proceedToSave = (finalURL) => {
                    saveProfileChangesBtn.disabled = true;
                    saveProfileChangesBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Сохранение...';
                    
                    const userDocRef = db.collection('users').doc(currentUser.uid);
                    const dataToUpdate = {
                        displayName: newName,
                        photoURL: finalURL || null // Если URL пустой или невалидный, сохраняем null
                    };

                    Promise.all([
                        userDocRef.update(dataToUpdate),
                        currentUser.updateProfile(dataToUpdate)
                    ]).then(() => {
                        profileNameDisplay.textContent = newName;
                        profileIcon.src = finalURL || './assets/images/None-person.jpg';
                        alert("Профиль успешно обновлен!");
                        editProfileModal.hide();
                    }).catch(error => {
                        console.error("Ошибка при обновлении профиля:", error);
                        alert("Произошла ошибка. Попробуйте снова.");
                    }).finally(() => {
                        saveProfileChangesBtn.disabled = false;
                        saveProfileChangesBtn.textContent = 'Сохранить';
                    });
                };

                // --- НАЧАЛО НОВОЙ ЛОГИКИ ПРОВЕРКИ URL ---

                // Если поле URL пустое, просто сохраняем остальные данные
                if (!newURL) {
                    proceedToSave(null);
                    return;
                }

                // Если URL не пустой, проверяем его
                const img = new Image();
                img.onload = function() {
                    // Картинка успешно загрузилась, можно сохранять
                    console.log('URL изображения валиден.');
                    proceedToSave(newURL);
                };
                img.onerror = function() {
                    // Произошла ошибка, URL невалидный
                    alert('Не удалось загрузить изображение по указанной ссылке. Пожалуйста, проверьте URL и убедитесь, что он ведет на картинку.');
                };
                
                img.src = newURL; // Запускаем проверку
            });
        }
    }
});