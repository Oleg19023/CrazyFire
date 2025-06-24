document.addEventListener('DOMContentLoaded', async () => {
    const currencyGrid = document.getElementById('currencyGrid');
    const exchangeDateElement = document.getElementById('exchangeDate');
    const loader = document.getElementById('loader');

    const amountFromInput = document.getElementById('amountFrom');
    const currencyFromSelect = document.getElementById('currencyFrom');
    const amountToInput = document.getElementById('amountTo');
    const currencyToSelect = document.getElementById('currencyTo');
    const swapButton = document.querySelector('.swap-icon');

    loader.style.display = 'block';
    currencyGrid.style.display = 'none';

    try {
        const response = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
        if (!response.ok) throw new Error('Не удалось загрузить курсы валют');
        let currencies = await response.json();

        // ИСПРАВЛЕНИЕ: Сортировка валют
        const popularCurrencies = ['USD', 'EUR', 'PLN', 'GBP', 'CHF', 'JPY', 'CNY'];
        currencies.sort((a, b) => {
            const aIsPopular = popularCurrencies.includes(a.cc);
            const bIsPopular = popularCurrencies.includes(b.cc);

            if (aIsPopular && !bIsPopular) return -1;
            if (!aIsPopular && bIsPopular) return 1;
            
            // Если обе популярные, сортируем по списку
            if (aIsPopular && bIsPopular) {
                return popularCurrencies.indexOf(a.cc) - popularCurrencies.indexOf(b.cc);
            }
            // Если обе не популярные, сортируем по алфавиту
            return a.txt.localeCompare(b.txt);
        });

        const allCurrenciesForConverter = [
            { cc: 'UAH', txt: 'Українська гривня', rate: 1 },
            ...currencies
        ];

        const date = currencies[0]?.exchangedate;
        if (date) {
            exchangeDateElement.textContent = `Данные актуальны на ${date}`;
        }

        currencyGrid.innerHTML = '';
        populateSelects(allCurrenciesForConverter);

        currencies.forEach(currency => {
            const card = createCurrencyCard(currency);
            currencyGrid.appendChild(card);
        });

        setupConverter(allCurrenciesForConverter);

    } catch (error) {
        console.error('Ошибка:', error);
        currencyGrid.innerHTML = `<p style="text-align: center; color: #ff4d4d;">Не удалось загрузить данные. Попробуйте обновить страницу.</p>`;
    } finally {
        loader.style.display = 'none';
        currencyGrid.style.display = 'grid';
    }

    function createCurrencyCard(currency) {
        const card = document.createElement('div');
        card.className = 'currency-card';
        const countryCode = currency.cc.substring(0, 2).toLowerCase();
        const flagUrl = `https://flagcdn.com/w80/${countryCode}.png`;
        card.innerHTML = `
            <div class="card-header">
                <img src="${flagUrl}" alt="Флаг" class="flag-icon" onerror="this.style.display='none'">
                <div class="currency-info">
                    <span class="currency-code">${currency.cc}</span>
                    <span class="currency-name">${currency.txt}</span>
                </div>
            </div>
            <div class="card-body">
                1 ${currency.cc} = <span class="rate-value">${currency.rate.toFixed(4)}</span> UAH
            </div>
        `;
        return card;
    }
    
    function populateSelects(currencies) {
        const sortedForSelect = [...currencies].sort((a, b) => a.txt.localeCompare(b.txt));

        sortedForSelect.forEach(currency => {
            const optionFrom = new Option(`${currency.cc} - ${currency.txt}`, currency.cc);
            const optionTo = new Option(`${currency.cc} - ${currency.txt}`, currency.cc);
            currencyFromSelect.add(optionFrom);
            currencyToSelect.add(optionTo);
        });
        currencyFromSelect.value = 'USD';
        currencyToSelect.value = 'UAH';
    }

    function setupConverter(currencies) {
        const rates = {};
        currencies.forEach(c => { rates[c.cc] = c.rate; });

        const convert = () => {
            const fromCurrency = currencyFromSelect.value;
            const toCurrency = currencyToSelect.value;
            const amount = parseFloat(amountFromInput.value);
            if (isNaN(amount)) {
                amountToInput.value = '';
                return;
            }
            const rateFrom = rates[fromCurrency];
            const rateTo = rates[toCurrency];
            const result = (amount * rateFrom) / rateTo;
            amountToInput.value = result.toFixed(2);
        };

        amountFromInput.addEventListener('input', convert);
        currencyFromSelect.addEventListener('change', convert);
        currencyToSelect.addEventListener('change', convert);
        
        swapButton.addEventListener('click', () => {
            const temp = currencyFromSelect.value;
            currencyFromSelect.value = currencyToSelect.value;
            currencyToSelect.value = temp;
            convert();
        });

        convert();
    }
});