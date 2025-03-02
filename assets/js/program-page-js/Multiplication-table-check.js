document.addEventListener("DOMContentLoaded", function () {
    generateQuiz();
});

function generateQuiz() {
    const quizForm = document.getElementById("multiplicationQuizForm");
    
    // Разбивка примеров на уровни сложности
    const difficultyLevels = [
        { min: 1, max: 5 },
        { min: 5, max: 10 },
        { min: 10, max: 20 },
        { min: 20, max: 50 },
        { min: 50, max: 99 }
    ];

    let questionIndex = 1;
    
    for (let level = 0; level < difficultyLevels.length; level++) {
        for (let j = 0; j < 3; j++) {
            if (questionIndex > 12) return;
            
            const { min, max } = difficultyLevels[level];
            const randomNumber1 = getRandomNumber(min, max);
            const randomNumber2 = getRandomNumber(min, max);
            const correctAnswer = randomNumber1 * randomNumber2;

            const questionContainer = document.createElement("div");
            questionContainer.className = "mb-3";
            questionContainer.innerHTML = `
                <label for="answer${questionIndex}">${randomNumber1} &times; ${randomNumber2} = </label>
                <input type="number" class="form-control" id="answer${questionIndex}" name="answer${questionIndex}" 
                    placeholder="Введите ответ" required>
                <input type="hidden" name="correctAnswer${questionIndex}" value="${correctAnswer}">
            `;

            quizForm.appendChild(questionContainer);
            questionIndex++;
        }
    }
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkAnswers() {
    const quizForm = document.getElementById("multiplicationQuizForm");
    const resultContainer = document.getElementById("resultContainer");

    let correctCount = 0;
    let incorrectAnswers = [];
    let correctAnswers = [];

    for (let i = 1; i <= 12; i++) {
        const userAnswer = quizForm.elements[`answer${i}`].value.trim();
        const correctAnswer = quizForm.elements[`correctAnswer${i}`].value.trim();

        if (userAnswer === correctAnswer) {
            correctCount++;
            correctAnswers.push({
                question: `${quizForm.elements[`answer${i}`].previousElementSibling.textContent.trim()} ${correctAnswer}`,
                userAnswer: userAnswer,
            });
        } else {
            incorrectAnswers.push({
                question: `${quizForm.elements[`answer${i}`].previousElementSibling.textContent.trim()} ${correctAnswer}`,
                userAnswer: userAnswer,
            });
        }
    }

    displayResult(correctCount, incorrectAnswers, correctAnswers);
}

function displayResult(correctCount, incorrectAnswers, correctAnswers) {
    const resultContainer = document.getElementById("resultContainer");
    resultContainer.innerHTML = `
        <h3>Результаты теста:</h3>
        <p>Правильных ответов: ${correctCount} из 12</p>
    `;

    if (correctCount === 12) {
        resultContainer.innerHTML += `<p>Вы молодец! Отличный результат!</p>`;
    }

    if (correctAnswers.length > 0) {
        resultContainer.innerHTML += `
            <h4 class="mt-3">Правильные ответы:</h4>
            <ul>
                ${correctAnswers.map(answer => `<li>Вопрос: ${answer.question}, Ваш ответ: ${answer.userAnswer}</li>`).join("")}
            </ul>
        `;
    }

    if (incorrectAnswers.length > 0) {
        resultContainer.innerHTML += `
            <h4 class="mt-3">Неправильные ответы:</h4>
            <ul>
                ${incorrectAnswers.map(answer => `<li>Вопрос: ${answer.question}, Ваш ответ: ${answer.userAnswer}</li>`).join("")}
            </ul>
        `;
    }
}