const resultElement = document.getElementById('result');

const additionalInputs0 = document.getElementById('additionalInputs0'); // #0
const additionalInputs = document.getElementById('additionalInputs'); // #1
const additionalInputs2 = document.getElementById('additionalInputs2'); // #2
const additionalInputs3 = document.getElementById('additionalInputs3'); // #3
const additionalInputs4 = document.getElementById('additionalInputs4'); // #4

function UpdateInput() {
    const selectedValue = document.getElementById('question').value;
    additionalInputs0.style.display = (selectedValue === '1'|| selectedValue === '2'|| selectedValue === '3'|| selectedValue === '7') ? 'block' : 'none'; // #0
    additionalInputs.style.display = (selectedValue === '4') ? 'block' : 'none'; // #1
    additionalInputs2.style.display = (selectedValue === '5') ? 'block' : 'none'; // #2
    additionalInputs3.style.display = (selectedValue === '6') ? 'block' : 'none'; // #3
    additionalInputs4.style.display = (selectedValue === '8') ? 'block' : 'none'; // #4

}

function calculate() {
    const selectedValue = document.getElementById('question').value;
    const inputValue = parseFloat(document.getElementById('Input1').value);


    switch (selectedValue) {
        // Задачи ʕ ᵔᴥᵔ ʔ
        case '1':
            // Рассчет периметра квадрата
            const perimeter = 4 * inputValue;
            resultElement.innerHTML = `Периметр квадрата: ${perimeter.toFixed(2)}`;
            break;
        case '2':
            // Рассчет объема куба и площади его боковой поверхности
            const volume = Math.pow(inputValue, 3);
            const surfaceArea = 6 * Math.pow(inputValue, 2);
            resultElement.innerHTML = `Объем куба: ${volume.toFixed(2)}<br>Площадь боковой поверхности куба: ${surfaceArea.toFixed(2)}`;
            break;
        case '3':
            // Рассчет длины окружности и площади круга
            const circumference = 2 * Math.PI * inputValue;
            const area = Math.PI * Math.pow(inputValue, 2);
            resultElement.innerHTML = `Длина окружности: ${circumference.toFixed(2)}<br>Площадь круга: ${area.toFixed(2)}`;
            break;
        case '4':
            // Рассчет плотности материала
            const volumeInput = parseFloat(document.getElementById('Input2').value);
            const massInput = parseFloat(document.getElementById('Input3').value);

            if (isNaN(volumeInput) || isNaN(massInput)) {
                resultElement.innerHTML = 'Введите корректные значения для объема и массы.';
                return;
            }

            const materialDensity = massInput / volumeInput;
            resultElement.innerHTML = `Объем: ${volumeInput.toFixed(2)} м³<br>Масса: ${massInput.toFixed(2)} кг<br>Плотность материала: ${materialDensity.toFixed(2)} кг/м³`;
            break;
        case '5':
            // Рассчет плотности населения
            const populationInput = parseFloat(document.getElementById('Input4').value);
            const areaInput = parseFloat(document.getElementById('Input5').value);

            if (isNaN(populationInput) || isNaN(areaInput)) {
                resultElement.innerHTML = 'Введите корректные значения для населения и площади.';
                return;
            }

            const populationDensity = populationInput / areaInput;
            resultElement.innerHTML = `Население: ${populationInput.toFixed(2)} чел.<br>Площадь: ${areaInput.toFixed(2)} км²<br>Плотность населения: ${populationDensity.toFixed(2)} чел./км²`;
            break;
        case '6':
            // Рассчет гипотенузы прямоугольного треугольника
            const cathetus1Input = parseFloat(document.getElementById('Input6').value);
            const cathetus2Input = parseFloat(document.getElementById('Input7').value);

            if (isNaN(cathetus1Input) || isNaN(cathetus2Input)) {
                resultElement.innerHTML = 'Введите корректные значения для длины катетов.';
                return;
            }

            const hypotenuse = Math.sqrt(Math.pow(cathetus1Input, 2) + Math.pow(cathetus2Input, 2));
            resultElement.innerHTML = `Гипотенуза прямоугольного треугольника: ${hypotenuse.toFixed(2)}`;
            break;
        case '7':
            // Рассчет значения Y
            const aValue = parseFloat(document.getElementById('Input1').value);
            
            if (isNaN(aValue)) {
                resultElement.innerHTML = 'Введите корректное значение для a.';
                return;
            }
            
            const yValue = (Math.pow(aValue, 2) + 10) / Math.sqrt(Math.pow(aValue, 2) + 1);
            resultElement.innerHTML = `Значение y: ${yValue.toFixed(2)}`;
            break;
        case '8':
            // Рассчет ИМТ
            const weightInput = parseFloat(document.getElementById('Input8').value);
            const heightInput = parseFloat(document.getElementById('Input9').value);

            if (isNaN(weightInput) || isNaN(heightInput) || heightInput <= 0) {
                alert('Введите корректные значения для веса и роста.');
            } else {
                const bmi = weightInput / Math.pow(heightInput, 2);
                const roundedbmi = Math.round(bmi * 10) / 10;

                let bmiCategory;

                if (roundedbmi < 1) {
                    bmiCategory = 'Введите рост в метрах :)';
                }
                else if (roundedbmi < 16) {
                    bmiCategory = 'Выраженный дефицит массы тела';
                } else if (roundedbmi >= 16 && roundedbmi < 18.5) {
                    bmiCategory = 'Дефицит массы тела';
                } else if (roundedbmi >= 18.5 && roundedbmi < 25) {
                    bmiCategory = 'Нормальная масса тела';
                } else if (roundedbmi >= 25 && roundedbmi < 30) {
                    bmiCategory = 'Избыточная масса тела (предожирение)';
                } else if (roundedbmi >= 30 && roundedbmi < 35) {
                    bmiCategory = 'Ожирение I степени';
                } else if (roundedbmi >= 35 && roundedbmi < 40) {
                    bmiCategory = 'Ожирение II степени';
                } else {
                    bmiCategory = 'Ожирение III степени';
                }
                    resultElement.innerHTML = `Индекс массы тела (ИМТ): ${roundedbmi} - ${bmiCategory}`;
                }
            break;
        default:
            alert('Выберите вариант для вычисления.');
    }
}