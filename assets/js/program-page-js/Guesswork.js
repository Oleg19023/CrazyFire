const secretNumber = Math.floor(Math.random() * 100) + 1;

let attempts = 10;
let roundNumber = 0;
const guessedNumbers = [];

function guessNumber() {
    const guessInput = document.getElementById("guessInput");
    const guessButton = document.querySelector("button");
    const resultMessage = document.getElementById("result");
    const roundNumberElement = document.getElementById("roundNumber");
    const imageElement = document.getElementById("resultImage");

    if (guessButton.disabled) {
        resultMessage.textContent = "Игра окончена.";
        return;
    }

    const userGuess = parseInt(guessInput.value);

    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
        resultMessage.textContent = "Введите корректное число от 1 до 100.";
        return;
    }

    if (guessedNumbers.includes(userGuess)) {
        resultMessage.textContent = "Вы уже вводили это число. Попробуйте другое.";
        return;
    }

    guessedNumbers.push(userGuess);
    attempts--;

    if (userGuess === secretNumber) {
        resultMessage.textContent = `Поздравляем! Вы угадали число ${secretNumber}!`;
        disableInputAndButton();
        imageElement.src = "/assets/images/Program-pages/Guesswork/right.png";
    } else {
        const hint = userGuess < secretNumber ? "больше" : "меньше";
        resultMessage.textContent = `Неверно. Загаданное число ${hint} вашего.`;
        imageElement.src = "/assets/images/Program-pages/Guesswork/wrong.png";

        if (attempts === 0) {
            resultMessage.textContent = `К сожалению, вы проиграли. Загаданное число было: ${secretNumber}.`;
            disableInputAndButton();
            imageElement.src = "/assets/images/Program-pages/Guesswork/wrong.png";
        }
    }
    roundNumber++;
    roundNumberElement.textContent = roundNumber;
    guessInput.value = "";
    
    if (roundNumber > 10) {
        disableInputAndButton();
    }
}

function disableInputAndButton() {
    const guessInput = document.getElementById("guessInput");
    const guessButton = document.querySelector("button");

    guessInput.disabled = true;
    guessButton.disabled = true;
}

document.getElementById("totalRounds").textContent = 10;