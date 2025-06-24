document.addEventListener('DOMContentLoaded', () => {
    // --- Элементы DOM ---
    const inputNumber = document.getElementById('inputNumber');
    const outputWords = document.getElementById('outputWords');
    const copyInputNumBtn = document.getElementById('copyInputNum');
    const copyOutputWordsBtn = document.getElementById('copyOutputWords');

    // --- Словари для конвертации ---
    const units = ["", "одна", "две", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять"];
    const unitsMale = ["", "один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять"];
    const teens = ["десять", "одиннадцать", "двенадцать", "тринадцать", "четырнадцать", "пятнадцать", "шестнадцать", "семнадцать", "восемнадцать", "девятнадцать"];
    const tens = ["", "", "двадцать", "тридцать", "сорок", "пятьдесят", "шестьдесят", "семьдесят", "восемьдесят", "девяносто"];
    const hundreds = ["", "сто", "двести", "триста", "четыреста", "пятьсот", "шестьсот", "семьсот", "восемьсот", "девятьсот"];

    const thousands = ["тысяча", "тысячи", "тысяч"];
    const millions = ["миллион", "миллиона", "миллионов"];
    const billions = ["миллиард", "миллиарда", "миллиардов"];
    const trillions = ["триллион", "триллиона", "триллионов"];

    // --- Основная функция конвертации ---
    function numberToWords(numStr) {
        numStr = numStr.replace(/ /g, '').replace(/,/g, '.');

        if (!/^\d+(\.\d{1,2})?$/.test(numStr) || parseFloat(numStr) > 999999999999999.99) {
            return '<span class="placeholder">Некорректный ввод или слишком большое число</span>';
        }

        const [integerPartStr, fractionalPartStr] = numStr.split('.');
        const integerPart = parseInt(integerPartStr, 10);
        
        if (integerPart === 0 && !fractionalPartStr) {
            return "Ноль гривен 00 копеек";
        }

        const integerWords = convertInteger(integerPart);
        const integerCurrency = getCurrencyWord(integerPart, ["гривна", "гривни", "гривен"]);
        
        const fractionalPart = parseInt(fractionalPartStr?.padEnd(2, '0') || '00', 10);
        const fractionalCurrency = getCurrencyWord(fractionalPart, ["копейка", "копейки", "копеек"]);
        
        let result = `${integerWords} ${integerCurrency} ${fractionalPart.toString().padStart(2, '0')} ${fractionalCurrency}`;
        
        // Делаем первую букву заглавной
        result = result.charAt(0).toUpperCase() + result.slice(1);
        return result;
    }
    
    function convertInteger(num) {
        if (num === 0) return 'ноль';
        
        const numArr = String(num).padStart(15, '0').match(/.{1,3}/g).map(Number);
        const [trills, bills, mills, thous, units] = numArr;

        let words = [];
        if (trills > 0) words.push(convertThreeDigits(trills, true) + ' ' + getCurrencyWord(trills, trillions));
        if (bills > 0) words.push(convertThreeDigits(bills, true) + ' ' + getCurrencyWord(bills, billions));
        if (mills > 0) words.push(convertThreeDigits(mills, true) + ' ' + getCurrencyWord(mills, millions));
        if (thous > 0) words.push(convertThreeDigits(thous, false) + ' ' + getCurrencyWord(thous, thousands));
        if (units > 0) words.push(convertThreeDigits(units, true));
        
        return words.join(' ');
    }
    
    function convertThreeDigits(num, isMale) {
        if (num === 0) return '';
        
        const h = Math.floor(num / 100);
        const t = Math.floor((num % 100) / 10);
        const u = num % 10;
        
        let words = hundreds[h] + ' ';
        const remainder = num % 100;
        
        if (remainder >= 10 && remainder <= 19) {
            words += teens[remainder - 10];
        } else {
            words += tens[t] + ' ';
            words += isMale ? unitsMale[u] : units[u];
        }
        return words.trim();
    }
    
    function getCurrencyWord(num, forms) {
        const lastTwo = num % 100;
        const lastOne = num % 10;
        if (lastTwo >= 11 && lastTwo <= 19) return forms[2];
        if (lastOne === 1) return forms[0];
        if (lastOne >= 2 && lastOne <= 4) return forms[1];
        return forms[2];
    }
    
    // --- Обработчики событий ---
    function handleInput() {
        const value = inputNumber.value;
        if (value.trim() === '') {
            outputWords.innerHTML = '<span class="placeholder">Результат появится здесь...</span>';
            return;
        }
        const result = numberToWords(value);
        outputWords.innerHTML = result;
    }

    inputNumber.addEventListener('input', handleInput);

    copyInputNumBtn.addEventListener('click', () => {
        copyToClipboard(inputNumber.value, copyInputNumBtn);
    });
    
    copyOutputWordsBtn.addEventListener('click', () => {
        const textToCopy = outputWords.textContent.replace(/\s+/g, ' ').trim();
        copyToClipboard(textToCopy, copyOutputWordsBtn);
    });

    function copyToClipboard(text, button) {
        if (!text || text.includes('...')) return;
        navigator.clipboard.writeText(text).then(() => {
            const originalIcon = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                button.innerHTML = originalIcon;
            }, 1500);
        }).catch(err => console.error('Ошибка копирования:', err));
    }
    
    // Инициализация
    handleInput();
});