function calculateLoan() {
    // Ввод
    const loanTermMonths = parseFloat(document.getElementById('loanTermMonths').value);
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const annualInterestRate = parseFloat(document.getElementById('annualInterestRate').value);

    // Расчет месяц-платеж
    const monthlyInterestRate = (annualInterestRate / 100) / 12;
    let monthlyPayment = loanAmount * monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -loanTermMonths));
    let totalPayment = 0;
    let totalPrincipalPayment = 0;
    let totalInterestPayment = 0;
    let balance = loanAmount;

    const resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = '';

    // Табличка 
    const table = document.createElement('table');
    table.className = 'table';
    table.innerHTML = '<tr><th>Месяц</th><th>Задолженность по кредиту</th><th>Погашение кредита</th><th>Проценты по кредиту</th><th>Выплаты в месяц</th><th>Остаток долга</th></tr>';
    resultContainer.appendChild(table);

    // Расчет-вывод погаш. кредита
    for (let i = 1; i <= loanTermMonths; i++) {
        let initialBalance = balance;
        let interestPayment = balance * monthlyInterestRate;
        let principalPayment = monthlyPayment - interestPayment;
        balance -= principalPayment;

        // Проверка на -баланс
        if (balance < 0) {
            principalPayment += balance;
            monthlyPayment = principalPayment + interestPayment;
            balance = 0;
        }

        // Корректировка
        if (i === loanTermMonths) {
            monthlyPayment = initialBalance + interestPayment;
            principalPayment = initialBalance;
        }

        // Рассчет выплат в месяц
        totalPrincipalPayment += principalPayment;
        totalInterestPayment += interestPayment;
        monthlyPayment = Number(monthlyPayment.toFixed(2));
        totalPayment += +monthlyPayment.toFixed(2);

        const row = document.createElement('tr');
        row.innerHTML = '<td>' + i + '</td><td>' + initialBalance.toFixed(2) + '</td><td>' + principalPayment.toFixed(2) + '</td><td>' + interestPayment.toFixed(2) + '</td><td>' + monthlyPayment.toFixed(2) + '</td><td>' + balance.toFixed(2) + '</td>';
        table.appendChild(row);
    }

    // Итого
    const totalRow = document.createElement('tr');
    totalRow.innerHTML = '<td>Итого</td><td></td><td>' + totalPrincipalPayment.toFixed(2) + '</td><td>' + totalInterestPayment.toFixed(2) + '</td><td>' + totalPayment.toFixed(2) + '</td><td></td>';
    table.appendChild(totalRow);
}