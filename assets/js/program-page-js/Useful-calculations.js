document.addEventListener('DOMContentLoaded', () => {
    const calculatorsGrid = document.getElementById('calculatorsGrid');

    const calculatorsData = [
        // --- СТАРЫЕ КАЛЬКУЛЯТОРЫ ---
        {
            id: 'squarePerimeter',
            title: 'Периметр квадрата',
            icon: 'fa-vector-square',
            inputs: [ { id: 'side', label: 'Длина стороны (a)', placeholder: 'Введите длину' } ],
            calculation: (values) => {
                const side = values.side || 0;
                const perimeter = 4 * side;
                return `P = 4 * ${side} = <strong>${perimeter.toFixed(2)}</strong>`;
            }
        },
        {
            id: 'cube',
            title: 'Объем и площадь куба',
            icon: 'fa-cube',
            inputs: [ { id: 'edge', label: 'Длина ребра (a)', placeholder: 'Введите длину' } ],
            calculation: (values) => {
                const edge = values.edge || 0;
                const volume = Math.pow(edge, 3);
                const surfaceArea = 6 * Math.pow(edge, 2);
                return `Объем: <strong>${volume.toFixed(2)}</strong><br>Площадь поверхности: <strong>${surfaceArea.toFixed(2)}</strong>`;
            }
        },
        {
            id: 'circleArea',
            title: 'Площадь круга',
            icon: 'fa-circle',
            inputs: [ { id: 'radius', label: 'Радиус (r)', placeholder: 'Введите радиус' } ],
            calculation: (values) => {
                const radius = values.radius || 0;
                const area = Math.PI * Math.pow(radius, 2);
                return `S = π * ${radius}² ≈ <strong>${area.toFixed(2)}</strong>`;
            }
        },
        {
            id: 'rectangleArea',
            title: 'Площадь прямоугольника',
            icon: 'fa-ruler-combined',
            inputs: [
                { id: 'rectLength', label: 'Длина (a)', placeholder: '10' },
                { id: 'rectWidth', label: 'Ширина (b)', placeholder: '5' }
            ],
            calculation: (values) => {
                const l = values.rectLength || 0;
                const w = values.rectWidth || 0;
                const area = l * w;
                return `S = ${l} * ${w} = <strong>${area.toFixed(2)}</strong>`;
            }
        },
        {
            id: 'hypotenuse',
            title: 'Гипотенуза треугольника',
            icon: 'fa-play',
            inputs: [
                { id: 'cathetus1', label: 'Катет 1 (a)', placeholder: 'Длина катета' },
                { id: 'cathetus2', label: 'Катет 2 (b)', placeholder: 'Длина катета' }
            ],
            calculation: (values) => {
                const c1 = values.cathetus1 || 0;
                const c2 = values.cathetus2 || 0;
                const hypotenuse = Math.sqrt(Math.pow(c1, 2) + Math.pow(c2, 2));
                return `c = √(${c1}² + ${c2}²) = <strong>${hypotenuse.toFixed(2)}</strong>`;
            }
        },
        {
            id: 'density',
            title: 'Плотность материала',
            icon: 'fa-weight-hanging',
            inputs: [
                { id: 'mass', label: 'Масса (кг)', placeholder: 'Введите массу' },
                { id: 'volume', label: 'Объем (м³)', placeholder: 'Введите объем' }
            ],
            calculation: (values) => {
                const mass = values.mass || 0;
                const volume = values.volume || 0;
                if (volume === 0) return 'Введите объем > 0';
                const density = mass / volume;
                return `ρ = ${mass} / ${volume} = <strong>${density.toFixed(2)}</strong> кг/м³`;
            }
        },
        // --- ФИНАНСОВАЯ ГРУППА ---
        {
            id: 'percentage',
            title: 'Калькулятор процентов',
            icon: 'fa-percent',
            inputs: [
                { id: 'percentVal', label: 'Процент (%)', placeholder: 'Например, 20' },
                { id: 'numberVal', label: 'Число', placeholder: 'Например, 150' }
            ],
            calculation: (values) => {
                const percent = values.percentVal || 0;
                const number = values.numberVal || 0;
                const result = (number * percent) / 100;
                return `${percent}% от ${number} = <strong>${result.toFixed(2)}</strong>`;
            }
        },
        {
            id: 'discount',
            title: 'Расчет скидки',
            icon: 'fa-tag',
            inputs: [
                { id: 'price', label: 'Исходная цена', placeholder: 'Например, 1000' },
                { id: 'discountPercent', label: 'Скидка (%)', placeholder: 'Например, 15' }
            ],
            calculation: (values) => {
                const price = values.price || 0;
                const discount = values.discountPercent || 0;
                const saved = (price * discount) / 100;
                const finalPrice = price - saved;
                return `Экономия: <strong>${saved.toFixed(2)}</strong><br>Итоговая цена: <strong>${finalPrice.toFixed(2)}</strong>`;
            }
        },
        {
            id: 'simpleInterest',
            title: 'Простые проценты по вкладу',
            icon: 'fa-piggy-bank',
            inputs: [
                { id: 'principal', label: 'Сумма вклада', placeholder: 'Например, 10000' },
                { id: 'rate', label: 'Годовая ставка (%)', placeholder: 'Например, 5' },
                { id: 'years', label: 'Срок (лет)', placeholder: 'Например, 1' }
            ],
            calculation: (values) => {
                const p = values.principal || 0;
                const r = values.rate || 0;
                const t = values.years || 0;
                const interest = p * (r / 100) * t;
                const total = p + interest;
                return `Доход: <strong>${interest.toFixed(2)}</strong><br>Итоговая сумма: <strong>${total.toFixed(2)}</strong>`;
            }
        },
        {
            id: 'vat',
            title: 'Калькулятор НДС',
            icon: 'fa-file-invoice-dollar',
            inputs: [
                { id: 'vatAmount', label: 'Сумма без НДС', placeholder: 'Например, 100' },
                { id: 'vatRate', label: 'Ставка НДС (%)', placeholder: 'Например, 20' }
            ],
            calculation: (values) => {
                const amount = values.vatAmount || 0;
                const rate = values.vatRate || 0;
                const vat = amount * (rate / 100);
                const total = amount + vat;
                return `НДС: <strong>${vat.toFixed(2)}</strong><br>Сумма с НДС: <strong>${total.toFixed(2)}</strong>`;
            }
        },
        // --- ГРУППА "ЗДОРОВЬЕ" ---
        {
            id: 'bmi',
            title: 'Индекс массы тела (ИМТ)',
            icon: 'fa-child',
            inputs: [
                { id: 'weight', label: 'Вес (кг)', placeholder: 'Например, 70' },
                { id: 'height', label: 'Рост (м)', placeholder: 'Например, 1.75' }
            ],
            calculation: (values) => {
                const weight = values.weight || 0;
                const height = values.height || 0;
                if (height === 0) return 'Введите рост';
                const bmi = weight / Math.pow(height, 2);
                if (isNaN(bmi) || !isFinite(bmi)) return '...';
                const bmiRounded = bmi.toFixed(1);
                let category = '';
                if (bmi < 16) category = 'Выраженный дефицит массы тела';
                else if (bmi < 18.5) category = 'Дефицит массы тела';
                else if (bmi < 25) category = 'Нормальная масса тела';
                else if (bmi < 30) category = 'Избыточная масса тела';
                else if (bmi < 35) category = 'Ожирение I степени';
                else if (bmi < 40) category = 'Ожирение II степени';
                else category = 'Ожирение III степени';
                return `ИМТ: <strong>${bmiRounded}</strong><br><span class="bmi-category">${category}</span>`;
            }
        },
        {
            id: 'calories',
            title: 'Суточная норма калорий',
            icon: 'fa-fire',
            inputs: [
                { id: 'calWeight', label: 'Вес (кг)', placeholder: '70' },
                { id: 'calHeight', label: 'Рост (см)', placeholder: '175' },
                { id: 'calAge', label: 'Возраст (лет)', placeholder: '30' }
            ],
            calculation: (values) => {
                const w = values.calWeight || 0;
                const h = values.calHeight || 0;
                const a = values.calAge || 0;
                if (w === 0 || h === 0 || a === 0) return 'Заполните все поля';
                const bmr = 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a); // Формула для мужчин
                return `Базовый метаболизм: <strong>${bmr.toFixed(0)}</strong> ккал<br><span class="bmi-category">(Сидячий образ жизни: ~${(bmr*1.2).toFixed(0)} ккал)</span>`;
            }
        },
        // --- ГРУППА "ФИЗИКА И ПОВСЕДНЕВНЫЕ РАСЧЕТЫ" ---
        {
            id: 'speed',
            title: 'Средняя скорость',
            icon: 'fa-tachometer-alt',
            inputs: [
                { id: 'distance', label: 'Расстояние (км)', placeholder: 'Например, 100' },
                { id: 'time', label: 'Время (часы)', placeholder: 'Например, 1.5' }
            ],
            calculation: (values) => {
                const distance = values.distance || 0;
                const time = values.time || 0;
                if (time === 0) return 'Введите время > 0';
                const speed = distance / time;
                return `V = ${distance} / ${time} = <strong>${speed.toFixed(2)}</strong> км/ч`;
            }
        },
        {
            id: 'fuelConsumption',
            title: 'Расход топлива',
            icon: 'fa-gas-pump',
            inputs: [
                { id: 'fuelAmount', label: 'Заправлено топлива (л)', placeholder: 'Например, 40' },
                { id: 'distanceTravelled', label: 'Пройденный путь (км)', placeholder: 'Например, 500' }
            ],
            calculation: (values) => {
                const fuel = values.fuelAmount || 0;
                const distance = values.distanceTravelled || 0;
                if (distance === 0) return 'Введите путь > 0';
                const consumption = (fuel / distance) * 100;
                return `Расход: <strong>${consumption.toFixed(2)}</strong> л/100 км`;
            }
        },
        {
            id: 'celsiusFahrenheit',
            title: 'Температура °C ↔ °F',
            icon: 'fa-thermometer-half',
            inputs: [ { id: 'celsius', label: 'Градусы Цельсия (°C)', placeholder: 'Например, 20' } ],
            calculation: (values) => {
                const celsius = values.celsius || 0;
                const fahrenheit = (celsius * 9/5) + 32;
                return `${celsius}°C = <strong>${fahrenheit.toFixed(2)}</strong>°F`;
            }
        },
        {
            id: 'power',
            title: 'Мощность тока',
            icon: 'fa-bolt',
            inputs: [
                { id: 'voltage', label: 'Напряжение (Вольт)', placeholder: '220' },
                { id: 'current', label: 'Сила тока (Ампер)', placeholder: '5' }
            ],
            calculation: (values) => {
                const v = values.voltage || 0;
                const i = values.current || 0;
                const power = v * i;
                return `P = ${v} * ${i} = <strong>${power.toFixed(2)}</strong> Ватт`;
            }
        },
        {
            id: 'dataTransferTime',
            title: 'Время загрузки файла',
            icon: 'fa-download',
            inputs: [
                { id: 'fileSize', label: 'Размер файла (ГБ)', placeholder: '10' },
                { id: 'speedMbps', label: 'Скорость (Мбит/с)', placeholder: '100' }
            ],
            calculation: (values) => {
                const sizeGb = values.fileSize || 0;
                const speedMbps = values.speedMbps || 0;
                if (speedMbps === 0) return 'Введите скорость > 0';
                const sizeMbit = sizeGb * 8 * 1024;
                const timeSec = sizeMbit / speedMbps;
                if (timeSec < 60) return `Время: <strong>${timeSec.toFixed(1)}</strong> сек`;
                const timeMin = timeSec / 60;
                return `Время: <strong>${timeMin.toFixed(1)}</strong> мин`;
            }
        },
        {
            id: 'ageCalc',
            title: 'Калькулятор возраста',
            icon: 'fa-birthday-cake',
            inputs: [
                { id: 'birthYear', label: 'Год рождения', placeholder: '1990' }
            ],
            calculation: (values) => {
                const birthYear = values.birthYear || 0;
                if (birthYear === 0 || birthYear > new Date().getFullYear()) return 'Введите год';
                const age = new Date().getFullYear() - birthYear;
                return `Ваш возраст: <strong>${age}</strong> лет/года`;
            }
        },
    ];

    // Функция для создания HTML одной карточки калькулятора
    const createCalculatorCard = (calc) => {
        const card = document.createElement('div');
        card.className = 'calc-card';
        card.id = `card-${calc.id}`;
        const inputsHTML = calc.inputs.map(input => `
            <div class="input-group">
                <label for="${input.id}">${input.label}</label>
                <input type="number" id="${input.id}" class="calc-input" data-calculator-id="${calc.id}" placeholder="${input.placeholder}">
            </div>
        `).join('');
        card.innerHTML = `
            <div class="calc-header">
                <i class="fas ${calc.icon} calc-icon"></i>
                <h3>${calc.title}</h3>
            </div>
            <div class="calc-body">
                ${inputsHTML}
            </div>
            <div class="calc-footer">
                <span class="result-label">Результат:</span>
                <span class="result-value" id="result-${calc.id}">...</span>
            </div>
        `;
        return card;
    };

    // Функция для выполнения расчетов
    const performCalculation = (calcId) => {
        const calculator = calculatorsData.find(c => c.id === calcId);
        if (!calculator) return;
        const values = {};
        calculator.inputs.forEach(input => {
            const inputElement = document.getElementById(input.id);
            values[input.id] = parseFloat(inputElement.value) || 0;
        });
        const resultHTML = calculator.calculation(values);
        const resultElement = document.getElementById(`result-${calcId}`);
        resultElement.innerHTML = resultHTML;
    };

    // Генерируем все карточки и добавляем их на страницу
    calculatorsData.forEach(calc => {
        const cardElement = createCalculatorCard(calc);
        calculatorsGrid.appendChild(cardElement);
        performCalculation(calc.id); // Первичный расчет с нулевыми значениями
    });

    // Добавляем один общий обработчик событий на всю сетку
    calculatorsGrid.addEventListener('input', (event) => {
        if (event.target.classList.contains('calc-input')) {
            const calcId = event.target.dataset.calculatorId;
            performCalculation(calcId);
        }
    });
});