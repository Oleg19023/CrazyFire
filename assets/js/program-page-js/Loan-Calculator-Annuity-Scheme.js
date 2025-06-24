document.addEventListener('DOMContentLoaded', () => {
    // --- Элементы DOM ---
    const loanAmountInput = document.getElementById('loanAmount');
    const annualInterestRateInput = document.getElementById('annualInterestRate');
    const loanTermMonthsInput = document.getElementById('loanTermMonths');
    
    const monthlyPaymentEl = document.getElementById('monthlyPayment');
    const totalPaymentEl = document.getElementById('totalPayment');
    const totalInterestEl = document.getElementById('totalInterest');
    
    const resultContainer = document.getElementById('resultContainer');
    const chartCanvas = document.getElementById('loanChart');
    const downloadCsvButton = document.getElementById('downloadCsvButton'); // Новая кнопка

    let loanChart;
    let paymentData = []; // Массив для хранения данных графика

    // --- Функция форматирования чисел ---
    const formatCurrency = (value) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'UAH' }).format(value);
    const formatNumber = (value) => new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

    // --- Основная функция расчета ---
    function calculateAndDisplay() {
        const amount = parseFloat(loanAmountInput.value) || 0;
        const rate = parseFloat(annualInterestRateInput.value) || 0;
        const months = parseInt(loanTermMonthsInput.value) || 0;

        paymentData = []; // Очищаем данные при каждом расчете

        if (amount <= 0 || rate <= 0 || months <= 0) {
            resetDisplay();
            return;
        }

        const monthlyRate = (rate / 100) / 12;
        const monthlyPayment = amount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
        
        let balance = amount;
        let totalPrincipalPayment = 0;
        let totalInterestPayment = 0;
        let paymentScheduleHTML = `
            <table class="table">
                <thead><tr><th>Месяц</th><th>Платеж</th><th>Основной долг</th><th>Проценты</th><th>Остаток</th></tr></thead>
                <tbody>`;

        for (let i = 1; i <= months; i++) {
            const interestPayment = balance * monthlyRate;
            let principalPayment = monthlyPayment - interestPayment;
            
            if (balance < monthlyPayment) {
                principalPayment = balance;
            }
            
            balance -= principalPayment;
            
            totalPrincipalPayment += principalPayment;
            totalInterestPayment += interestPayment;
            
            const currentPayment = {
                month: i,
                payment: monthlyPayment,
                principal: principalPayment,
                interest: interestPayment,
                balance: balance > 0 ? balance : 0
            };
            paymentData.push(currentPayment); // Сохраняем данные для CSV

            paymentScheduleHTML += `
                <tr>
                    <td>${currentPayment.month}</td>
                    <td>${formatCurrency(currentPayment.payment)}</td>
                    <td>${formatCurrency(currentPayment.principal)}</td>
                    <td>${formatCurrency(currentPayment.interest)}</td>
                    <td>${formatCurrency(currentPayment.balance)}</td>
                </tr>`;
        }
        paymentScheduleHTML += `</tbody></table>`;
        
        monthlyPaymentEl.textContent = formatCurrency(monthlyPayment);
        totalPaymentEl.textContent = formatCurrency(totalPrincipalPayment + totalInterestPayment);
        totalInterestEl.textContent = formatCurrency(totalInterestPayment);

        resultContainer.innerHTML = paymentScheduleHTML;
        downloadCsvButton.disabled = false; // Активируем кнопку
        
        updateChart(totalPrincipalPayment, totalInterestPayment);
    }

    function updateChart(principal, interest) {
        const data = {
            labels: ['Основной долг', 'Переплата по процентам'],
            datasets: [{
                data: [principal, interest],
                backgroundColor: ['#0d6efd', '#dc3545'],
                borderColor: document.body.classList.contains('dark-theme') ? '#2c2c2e' : '#fff',
                borderWidth: 2,
            }]
        };
        if (loanChart) {
            loanChart.data = data;
            loanChart.update();
        } else {
            loanChart = new Chart(chartCanvas, {
                type: 'doughnut',
                data: data,
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: { position: 'bottom', labels: { color: document.body.classList.contains('dark-theme') ? '#fff' : '#333' } }
                    }
                }
            });
        }
    }

    function resetDisplay() {
        monthlyPaymentEl.textContent = formatCurrency(0);
        totalPaymentEl.textContent = formatCurrency(0);
        totalInterestEl.textContent = formatCurrency(0);
        resultContainer.innerHTML = '<p style="text-align:center; color: #6c757d;">Введите данные для расчета.</p>';
        downloadCsvButton.disabled = true; // Деактивируем кнопку
        if (loanChart) {
            loanChart.destroy();
            loanChart = null;
        }
    }

    // --- НОВАЯ ФУНКЦИЯ ДЛЯ СКАЧИВАНИЯ CSV ---
    function downloadCSV() {
        if (paymentData.length === 0) return;

        const headers = ["Месяц", "Сумма платежа", "Погашение основного долга", "Погашение процентов", "Остаток долга"];
        // Преобразуем данные в строки, используя точку как десятичный разделитель для совместимости с Excel
        const rows = paymentData.map(row => [
            row.month,
            formatNumber(row.payment).replace(',', '.'),
            formatNumber(row.principal).replace(',', '.'),
            formatNumber(row.interest).replace(',', '.'),
            formatNumber(row.balance).replace(',', '.')
        ].join(';')); // Используем точку с запятой как разделитель

        // Собираем CSV файл
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(';'), ...rows].join('\n');
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "loan_payment_schedule.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }


    // --- Обработчики событий ---
    [loanAmountInput, annualInterestRateInput, loanTermMonthsInput].forEach(input => {
        input.addEventListener('input', calculateAndDisplay);
    });

    downloadCsvButton.addEventListener('click', downloadCSV);

    // Первоначальный расчет при загрузке страницы
    calculateAndDisplay();
});