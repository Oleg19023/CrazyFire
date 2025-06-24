document.addEventListener('DOMContentLoaded', () => {
    // --- Элементы DOM ---
    const startScreen = document.getElementById('startScreen');
    const quizScreen = document.getElementById('quizScreen');
    const resultScreen = document.getElementById('resultScreen');

    const startButton = document.getElementById('startButton');
    const restartButton = document.getElementById('restartButton');
    const submitAnswerButton = document.getElementById('submitAnswerButton');

    const questionCounter = document.getElementById('questionCounter');
    const timerElement = document.getElementById('timer');
    const progressBarFill = document.getElementById('progressBarFill');
    const questionText = document.getElementById('questionText');
    const answerInput = document.getElementById('answerInput');
    const feedback = document.getElementById('feedback');
    
    const resultTitle = document.getElementById('resultTitle');
    const resultSummary = document.getElementById('resultSummary');
    const finalTime = document.getElementById('finalTime');
    const finalAccuracy = document.getElementById('finalAccuracy');
    const mistakesList = document.getElementById('mistakesList');

    // --- Параметры викторины ---
    const TOTAL_QUESTIONS = 10;
    let currentQuestionIndex = 0;
    let questions = [];
    let userAnswers = [];
    let timerInterval;
    let secondsElapsed = 0;

    // --- Функции ---
    function generateQuestions() {
        const generated = [];
        for (let i = 0; i < TOTAL_QUESTIONS; i++) {
            const num1 = Math.floor(Math.random() * 9) + 2; // от 2 до 10
            const num2 = Math.floor(Math.random() * 9) + 2; // от 2 до 10
            generated.push({
                text: `${num1} × ${num2} = ?`,
                answer: num1 * num2
            });
        }
        return generated;
    }

    function displayQuestion() {
        if (currentQuestionIndex >= TOTAL_QUESTIONS) {
            endQuiz();
            return;
        }
        const question = questions[currentQuestionIndex];
        questionText.innerHTML = question.text;
        questionCounter.textContent = `Вопрос ${currentQuestionIndex + 1}/${TOTAL_QUESTIONS}`;
        progressBarFill.style.width = `${((currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100}%`;
        answerInput.value = '';
        answerInput.focus();
    }

    function checkAnswer() {
        const userAnswer = parseInt(answerInput.value, 10);
        const correctAnswer = questions[currentQuestionIndex].answer;
        
        userAnswers.push({
            question: questions[currentQuestionIndex].text,
            userAnswer: userAnswer,
            correctAnswer: correctAnswer,
            isCorrect: userAnswer === correctAnswer
        });

        feedback.textContent = userAnswer === correctAnswer ? "Правильно!" : `Неправильно! Ответ: ${correctAnswer}`;
        feedback.className = userAnswer === correctAnswer ? "feedback correct" : "feedback incorrect";

        setTimeout(() => {
            feedback.textContent = '';
            currentQuestionIndex++;
            displayQuestion();
        }, 1200);
    }
    
    function startTimer() {
        secondsElapsed = 0;
        timerElement.textContent = `Время: 0с`;
        timerInterval = setInterval(() => {
            secondsElapsed++;
            timerElement.textContent = `Время: ${secondsElapsed}с`;
        }, 1000);
    }

    function startQuiz() {
        currentQuestionIndex = 0;
        questions = generateQuestions();
        userAnswers = [];
        startScreen.style.display = 'none';
        resultScreen.style.display = 'none';
        quizScreen.style.display = 'block';
        startTimer();
        displayQuestion();
    }

    function endQuiz() {
        clearInterval(timerInterval);
        quizScreen.style.display = 'none';
        resultScreen.style.display = 'block';

        const correctCount = userAnswers.filter(a => a.isCorrect).length;
        const accuracy = (correctCount / TOTAL_QUESTIONS) * 100;

        // Определяем заголовок результата
        if (accuracy === 100) resultTitle.textContent = "Идеально!";
        else if (accuracy >= 70) resultTitle.textContent = "Хороший результат!";
        else resultTitle.textContent = "Можно и лучше!";

        resultSummary.textContent = `Вы ответили на ${correctCount} из ${TOTAL_QUESTIONS} вопросов правильно.`;
        finalTime.textContent = `${secondsElapsed}с`;
        finalAccuracy.textContent = `${accuracy.toFixed(0)}%`;

        mistakesList.innerHTML = '';
        const mistakes = userAnswers.filter(a => !a.isCorrect);
        if (mistakes.length > 0) {
            mistakes.forEach(mistake => {
                const li = document.createElement('li');
                li.innerHTML = `${mistake.question.replace(' = ?', '')} = <strong>${mistake.correctAnswer}</strong> (ваш ответ: ${isNaN(mistake.userAnswer) ? 'пусто' : mistake.userAnswer})`;
                mistakesList.appendChild(li);
            });
        }
    }

    // --- Обработчики событий ---
    startButton.addEventListener('click', startQuiz);
    restartButton.addEventListener('click', startQuiz);
    submitAnswerButton.addEventListener('click', checkAnswer);
    answerInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });

});