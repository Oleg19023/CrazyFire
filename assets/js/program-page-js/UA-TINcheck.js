const app = Vue.createApp({
    data() {
        return {
            tin: '',
            errorMessage: ''
        };
    },
    computed: {
        isTinValid() {
            return /^\d{10}$/.test(this.tin) && this.checkControlSum(this.tin);
        },
        inputStatusClass() {
            if (this.tin.length === 0) return '';
            return this.isTinValid ? 'valid' : 'invalid';
        },
        result() {
            if (!this.isTinValid) {
                return null;
            }

            const birthDays = parseInt(this.tin.substring(0, 5));
            const birthDate = new Date(1899, 11, 31);
            birthDate.setDate(birthDate.getDate() + birthDays);

            const gender = parseInt(this.tin.substring(8, 9)) % 2 === 0 ? "Женский" : "Мужской";

            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            const zodiacSigns = ["Козерог 🐐", "Водолей ♒", "Рыбы ♓", "Овен ♈", "Телец ♉", "Близнецы ♊", "Рак ♋", "Лев ♌", "Дева ♍", "Весы ♎", "Скорпион ♏", "Стрелец ♐"];
            const day = birthDate.getDate();
            const month = birthDate.getMonth();
            let signIndex;
            if((month==0 && day >=20)||(month==1 && day<=18)) {signIndex=1;}
            else if((month==1 && day >=19)||(month==2 && day<=20)) {signIndex=2;}
            else if((month==2 && day >=21)||(month==3 && day<=19)) {signIndex=3;}
            else if((month==3 && day >=20)||(month==4 && day<=20)) {signIndex=4;}
            else if((month==4 && day >=21)||(month==5 && day<=20)) {signIndex=5;}
            else if((month==5 && day >=21)||(month==6 && day<=22)) {signIndex=6;}
            else if((month==6 && day >=23)||(month==7 && day<=22)) {signIndex=7;}
            else if((month==7 && day >=23)||(month==8 && day<=22)) {signIndex=8;}
            else if((month==8 && day >=23)||(month==9 && day<=22)) {signIndex=9;}
            else if((month==9 && day >=23)||(month==10 && day<=21)) {signIndex=10;}
            else if((month==10 && day >=22)||(month==11 && day<=21)) {signIndex=11;}
            else {signIndex=0;}
            const zodiacSign = zodiacSigns[signIndex];

            const chineseZodiac = ["Крыса 🐀", "Бык 🐂", "Тигр 🐅", "Кролик 🐇", "Дракон 🐉", "Змея 🐍", "Лошадь 🐎", "Овца 🐑", "Обезьяна 🐒", "Петух 🐓", "Собака 🐕", "Свинья 🐖"];
            const chineseSign = chineseZodiac[(birthDate.getFullYear() - 4) % 12];

            return {
                birthDate: birthDate.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                gender,
                age,
                zodiacSign,
                chineseSign
            };
        }
    },
    methods: {
        validateInput() {
            // Оставляем только цифры
            this.tin = this.tin.replace(/\D/g, '');
            // Обновляем сообщение об ошибке
            if (this.tin.length > 0 && this.tin.length < 10) {
                this.errorMessage = 'ИНН должен состоять из 10 цифр';
            } else if (this.tin.length === 10 && !this.isTinValid) {
                this.errorMessage = 'Некорректная контрольная сумма ИНН';
            } else {
                this.errorMessage = '';
            }
        },
        checkControlSum(tin) {
            const coefficients = [-1, 5, 7, 9, 4, 6, 10, 5, 7];
            let sum = 0;
            for (let i = 0; i < 9; i++) {
                sum += parseInt(tin[i]) * coefficients[i];
            }
            const controlDigit = sum % 11 % 10;
            return controlDigit === parseInt(tin[9]);
        }
    }
});

app.mount('#app');