// Загрузка курса валюты
fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
    .then(response => response.json())
    .then(currencies => {
        // Вывод даты курса
        const date = currencies[0].exchangedate;
        const titleElement = document.querySelector('h1');
        titleElement.textContent += ` на ${date}`;

        // На каждую валюту - элемент
        currencies.forEach(currency => {
            const currencyElement = document.createElement('div');
            currencyElement.style.display = 'flex';
            currencyElement.style.flexWrap = 'wrap';
            currencyElement.style.alignItems = 'center';
            currencyElement.style.border = '1px solid black';
            currencyElement.style.backgroundColor = 'rgba(235, 235, 235)';
            currencyElement.style.padding = '10px';
            currencyElement.style.margin = '10px auto';
            currencyElement.style.maxWidth = '1500px';

            const infoElement = document.createElement('div');
            infoElement.innerHTML = `
                <h2>${currency.txt} (${currency.cc})</h2>
                <p>Курс: ${currency.rate} грн</p>
            `;
            infoElement.style.marginRight = '10px';
            currencyElement.appendChild(infoElement);

            // Загрузка флагов
            fetch(`https://restcountries.com/v3.1/currency/${currency.cc}`)
                .then(response => response.json())
                .then(countries => {
                    countries.forEach((country, index) => {
                        const flagElement = document.createElement('img');
                        flagElement.src = country.flags.png;
                        flagElement.title = country.name.common;
                        flagElement.style.height = '60px';
                        flagElement.style.width = '90px';
                        flagElement.style.marginRight = '10px';
                        flagElement.style.marginBottom = '10px';

                        // Перенос
                        if (index % 5 === 0) {
                            flagElement.style.flexBasis = 0;
                        }
                        currencyElement.appendChild(flagElement);
                    });
                });

            document.body.appendChild(currencyElement);
            console.log(currency);
        });
    });

fetch('https://restcountries.com/v3.1/all')
    .then(response => response.json())
    .then(countries => {
        countries.forEach(country => {
            if (country.flags) {
                console.log(country.flags.png);
            }
        });
    });