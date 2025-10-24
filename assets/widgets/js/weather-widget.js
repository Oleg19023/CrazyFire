document.addEventListener('DOMContentLoaded', () => {

    const WEATHER_API_KEY = "6fe40f4a8db6a62e84380caf541c5c42";

    // --- Элементы виджета погоды ---
    const weatherStatus = document.getElementById('weather-status');
    const weatherDataContainer = document.getElementById('weather-data');
    const weatherIcon = document.getElementById('weather-icon'); // ДОБАВЛЕНО: Получаем элемент иконки

    // --- Функция для получения и отображения погоды ---
    async function fetchWeather(lat, lon) {
        if (!WEATHER_API_KEY) {
            weatherStatus.textContent = "Ошибка: API ключ не указан.";
            if (weatherIcon) weatherIcon.style.display = 'none'; // ДОБАВЛЕНО: Скрываем иконку и здесь на всякий случай
            return;
        }
        weatherStatus.textContent = 'Загрузка погоды...';

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=ru`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("API ключ недействителен или неактивен.");
                }
                throw new Error(`Ошибка сети: ${response.statusText}`);
            }
            const data = await response.json();
            updateWeatherWidget(data);
        } catch (error) {
            console.error("Ошибка при загрузке погоды:", error);
            weatherStatus.textContent = `Ошибка: ${error.message}`;
            if (weatherIcon) weatherIcon.style.display = 'none'; // ДОБАВЛЕНО: Скрываем иконку при ошибке API
        }
    }

    // --- Функция для обновления HTML-элементов виджета ---
    function updateWeatherWidget(data) {
        document.getElementById('weather-city').textContent = data.name;
        document.getElementById('weather-temp').textContent = `${Math.round(data.main.temp)}°C`;
        document.getElementById('weather-desc').textContent = data.weather[0].description;
        
        if (weatherIcon) {
            weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            weatherIcon.style.display = ''; // Убедимся что иконка видима, если она была скрыта
        }
        
        weatherStatus.classList.add('hidden');
        weatherDataContainer.classList.remove('hidden');
    }

    // --- Основная функция, запрашивающая геолокацию ---
    function getWeather() {
        if (!navigator.geolocation) {
            weatherStatus.textContent = 'Геолокация не поддерживается.';
            if (weatherIcon) weatherIcon.style.display = 'none'; // ДОБАВЛЕНО: Скрываем иконку
            return;
        }

        const locationSuccess = (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeather(latitude, longitude);
        };

        const locationError = (error) => {
            let message = "Произошла неизвестная ошибка.";
            if (error.code === error.PERMISSION_DENIED) {
                message = "Вы запретили доступ к геолокации.";
            } else if (error.code === error.POSITION_UNAVAILABLE) {
                message = "Информация о местоположении недоступна.";
            } else if (error.code === error.TIMEOUT) {
                message = "Тайм-аут запроса геолокации.";
            }
            weatherStatus.textContent = message;
            if (weatherIcon) weatherIcon.style.display = 'none'; // ДОБАВЛЕНО: Скрываем иконку
        };

        navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
    }

    getWeather();
});