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

    // --- Основные элементы страницы ---
    const profileLoader = getElement('profileLoader');
    const profileWrapper = getElement('profileWrapper');
    const profileIcon = getElement('profileIcon');
    const profileNameDisplay = getElement('profileNameDisplay');
    const profileEmailDisplay = getElement('profileEmailDisplay');
    const userBalanceDisplay = getElement('userBalanceDisplay');
    const profileCreatedAt = getElement('profileCreatedAt');
    const profileHeader = getElement('profileHeader');
    const profileBannerImg = getElement('profileBannerImg');

    // --- Элементы модального окна ---
    const editProfileBtn = getElement('editProfileBtn');
    const changeAvatarBtn = getElement('changeAvatarBtn'); // Кнопка на аватаре
    const editProfileModalEl = getElement('editProfileModal');

    // Проверяем, что ключевые элементы существуют
    if (!profileWrapper || !profileLoader || !editProfileModalEl) {
        console.error("Ключевые элементы профиля или модальное окно не найдены. Скрипт не может быть выполнен.");
        return;
    }

    const editProfileModal = new bootstrap.Modal(editProfileModalEl);

    // --- Глобальные переменные ---
    let currentUser = null;
    let currentUserData = {}; // Храним здесь актуальные данные пользователя
    let profileUnsubscribe = null; // Слушатель для страницы профиля

    auth.onAuthStateChanged(user => {
        if (profileUnsubscribe) {
            profileUnsubscribe();
        }
        if (user) {
            currentUser = user;
            // Подписываемся на изменения документа пользователя в реальном времени
            profileUnsubscribe = db.collection('users').doc(user.uid)
                .onSnapshot(doc => {
                    if (doc.exists) {
                        const data = doc.data();
                        currentUserData = data; // Обновляем локальную копию данных

                        // Заполняем все поля на странице
                        profileNameDisplay.textContent = data.displayName || 'Имя не указано';
                        profileEmailDisplay.textContent = data.email;
                        profileIcon.src = data.photoURL || './assets/images/None-person.jpg';
                        userBalanceDisplay.textContent = (data.balance || 0).toLocaleString('ru-RU');

                        if (data.bannerURL) {
                            // Если у пользователя есть своя ссылка на баннер, показываем его
                            profileBannerImg.src = data.bannerURL;
                            profileHeader.classList.add('has-banner');
                        } else {
                            // Если ссылки нет, просто скрываем контейнер с баннером
                            profileHeader.classList.remove('has-banner');
                        }

                        // Форматируем дату регистрации
                        if (data.createdAt && data.createdAt.toDate) {
                            const creationDate = data.createdAt.toDate();
                            profileCreatedAt.textContent = creationDate.toLocaleDateString('ru-RU', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                            });
                        }

                        // Показываем контент после первой загрузки
                        if (profileWrapper.classList.contains('loading')) {
                            profileWrapper.classList.remove('loading');
                            profileLoader.style.display = 'none';
                        }
                    } else {
                        console.error("Документ пользователя не найден в Firestore!");
                        window.location.href = '/index.html'; // Перенаправляем, если данных нет
                    }
                }, error => {
                    console.error("Ошибка при загрузке данных профиля:", error);
                });

            // Настраиваем обработчики кнопок только после того, как пользователь определен
            setupEventListeners();
        } else {
            // Если пользователя нет, перенаправляем на главную
            window.location.href = '/index.html';
        }
    });

    // Настраиваем все обработчики событий
    function setupEventListeners() {
        // Получаем элементы модального окна
        const saveProfileChangesBtn = getElement('saveProfileChanges');
        const newDisplayNameInput = getElement('newDisplayName');
        const newPhotoURLInput = getElement('newPhotoURL');
        const newBannerURLInput = getElement('newBannerURL');

        // Функция для открытия модального окна
        const openEditModal = () => {
            // Заполняем поля актуальными данными из currentUserData
            newDisplayNameInput.value = currentUserData.displayName || '';
            newPhotoURLInput.value = currentUserData.photoURL || '';
            newBannerURLInput.value = currentUserData.bannerURL || '';
            editProfileModal.show();
        };

        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', openEditModal);
        }
        if (changeAvatarBtn) {
            changeAvatarBtn.addEventListener('click', openEditModal);
        }

        // Логика сохранения по клику на кнопку
        if (saveProfileChangesBtn) {
            saveProfileChangesBtn.addEventListener('click', () => {
                // 1. Получаем все значения из полей
                const newName = newDisplayNameInput.value.trim();
                const newAvatarURL = newPhotoURLInput.value.trim();
                const newBannerURL = newBannerURLInput.value.trim();

                if (newName.length < 3) {
                    alert("Имя должно быть не короче 3 символов.");
                    return;
                }

                saveProfileChangesBtn.disabled = true;
                saveProfileChangesBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Проверка...';

                // 2. Финальная функция сохранения данных в Firebase
                const proceedToSave = (finalAvatarURL, finalBannerURL) => {
                    saveProfileChangesBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Сохранение...';

                    const userDocRef = db.collection('users').doc(currentUser.uid);
                    
                    const dataToUpdateFirestore = {
                        displayName: newName,
                        photoURL: finalAvatarURL || null,
                        bannerURL: finalBannerURL || null
                    };

                    const dataToUpdateAuth = {
                        displayName: newName,
                        photoURL: finalAvatarURL || null,
                    };

                    // Обновляем данные одновременно
                    Promise.all([
                        userDocRef.update(dataToUpdateFirestore),
                        currentUser.updateProfile(dataToUpdateAuth)
                    ]).then(() => {
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

                // 3. Создаем цепочку проверок с помощью колбэков

                // Функция для проверки аватара
                const checkAvatar = (callback) => {
                    if (!newAvatarURL) {
                        callback(null); // URL пустой, передаем null дальше
                        return;
                    }
                    const img = new Image();
                    img.onload = () => callback(newAvatarURL); // Успех, передаем URL
                    img.onerror = () => {
                        alert('Не удалось загрузить АВАТАР по указанной ссылке. Проверьте URL.');
                        saveProfileChangesBtn.disabled = false;
                        saveProfileChangesBtn.textContent = 'Сохранить';
                    };
                    img.src = newAvatarURL;
                };

                // Функция для проверки баннера
                const checkBanner = (validatedAvatarURL, callback) => {
                    if (!newBannerURL) {
                        callback(validatedAvatarURL, null); // URL баннера пустой, передаем null
                        return;
                    }
                    const img = new Image();
                    img.onload = () => callback(validatedAvatarURL, newBannerURL); // Успех, передаем оба URL
                    img.onerror = () => {
                        alert('Не удалось загрузить БАННЕР по указанной ссылке. Проверьте URL.');
                        saveProfileChangesBtn.disabled = false;
                        saveProfileChangesBtn.textContent = 'Сохранить';
                    };
                    img.src = newBannerURL;
                };

                // 4. Запускаем цепочку проверок
                checkAvatar((validatedAvatarURL) => {
                    checkBanner(validatedAvatarURL, (finalAvatar, finalBanner) => {
                        // Эта функция будет вызвана только если ОБЕ проверки прошли успешно
                        proceedToSave(finalAvatar, finalBanner);
                    });
                });
            });
        }
    }
});