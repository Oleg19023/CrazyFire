let config = {
    containerColorBG: "#353336",
    contentColorBG: "#525053",

    countRows: 10,
    countCols: 20,

    offsetBorder: 10,
    borderRadius: 8,

    gemSize: 64,

    imagesCoin: [
        "/assets/images/Games-pages/Match-three/1.png",
        "/assets/images/Games-pages/Match-three/2.png",
        "/assets/images/Games-pages/Match-three/3.png",
        "/assets/images/Games-pages/Match-three/4.png",
        "/assets/images/Games-pages/Match-three/5.png",
        "/assets/images/Games-pages/Match-three/6.png",
        "/assets/images/Games-pages/Match-three/7.png",
        "/assets/images/Games-pages/Match-three/8.png",
        "/assets/images/Games-pages/Match-three/9.png",
        "/assets/images/Games-pages/Match-three/10.png", // Ракета (горизонтальная)
        "/assets/images/Games-pages/Match-three/11.png", // Ракета (вертикальная)
        "/assets/images/Games-pages/Match-three/12.png", // Бомба
        "/assets/images/Games-pages/Match-three/13.png", // Супер-гем
    ],

    gemClass: "gem",
    gemIdPrefix: "gem",
    gameStates: ["pick", "switch", "revert", "remove", "refill"],
    gameState: "",

    movingItems: 0,
}

let player = {
    selectedRow: -1,
    selectedCol: -1,
    posX: "",
    posY: ""
}

let components = {
    container: document.createElement("div"),
    content: document.createElement("div"),
    wrapper: document.createElement("div"),
    cursor: document.createElement("div"),
    score: document.createElement("div"),
    gems: new Array(),
}

// Загружаем сохраненный счет из localStorage
config.countScore = parseInt(localStorage.getItem("countScore")) || 0;
let lastSavedScore = config.countScore;
let saveInterval = 10;
let timeLeft = saveInterval;

let timerDisplay = document.createElement("div");
timerDisplay.style.cssText = `
    position: fixed;
    right: 100px;
    padding: 5px 10px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    font-size: 14px;
    border-radius: 5px;
    text-align: center;
`;
document.body.appendChild(timerDisplay);
updateTimerDisplay();

function saveScore() {
    if (config.countScore !== lastSavedScore) {
        localStorage.setItem("countScore", config.countScore);
        lastSavedScore = config.countScore;
    }
    timeLeft = saveInterval;
}

function resetScore() {
    if (confirm("Вы точно хотите обнулить счет?")) {
        config.countScore = 0;
        saveScore();
        updateScoreDisplay();
    }
}

setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
        saveScore();
    }
    updateTimerDisplay();
}, 1000);

function updateTimerDisplay() {
    timerDisplay.textContent = `Автосохранение через: ${timeLeft} сек.`;
}

function updateScoreDisplay() {
    let scoreElement = document.getElementById("scoreDisplay");
    if (scoreElement) scoreElement.textContent = config.countScore;
}

let resetButton = document.createElement("button");
resetButton.textContent = "⟲";
resetButton.style.cssText = `
    position: fixed;
    right: 15px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: none;
    background: #ff4d4d;
    color: white;
    font-size: 20px;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    transition: 0.3s;
`;
resetButton.onmouseover = () => resetButton.style.background = "#cc0000";
resetButton.onmouseleave = () => resetButton.style.background = "#ff4d4d";
resetButton.onclick = resetScore;

document.body.appendChild(resetButton);

// start Game
initGame();

function initGame() {
    document.body.style.margin = "0px";
    createPage();
    createContentPage();
    createWrapper();
    createCursor();
    createGrid();
    createScore();

    config.gameState = config.gameStates[0];
}

function createPage() {
    components.container.style.backgroundColor = config.containerColorBG;
    components.container.style.height = "100vh";
    components.container.style.overflow = "hidden";
    components.container.style.display = "flex";
    components.container.style.alignItems = "center";
    components.container.style.justifyContent = "center";

    document.body.append(components.container);
}

function createContentPage() {
    components.content.style.padding = config.offsetBorder + "px";
    components.content.style.width = (config.gemSize * config.countCols) +
        (config.offsetBorder * 2) + "px";
    components.content.style.height = (config.gemSize * config.countRows) +
        (config.offsetBorder * 2) + "px";
    components.content.style.backgroundColor = config.contentColorBG;
    components.content.style.boxShadow = config.offsetBorder + "px";
    components.content.style.borderRadius = config.borderRadius + "px";
    components.content.style.boxSizing = "border-box";

    components.container.append(components.content);
}

function createWrapper() {
    components.wrapper.style.position = "relative";
    components.wrapper.style.height = "100%";
    components.wrapper.addEventListener("click", function (event) { handlerTab(event, event.target) });

    components.content.append(components.wrapper);
}

function createCursor() {
    components.cursor.id = "marker";
    components.cursor.style.width = config.gemSize - 10 + "px";
    components.cursor.style.height = config.gemSize - 10 + "px";
    components.cursor.style.border = "2px solid gray";
    components.cursor.style.backgroundColor = "gray";
    components.cursor.style.marginLeft = "5px";
    components.cursor.style.borderRadius = "10px";
    components.cursor.style.position = "absolute";
    components.cursor.style.display = "none";

    components.wrapper.append(components.cursor);
}

function cursorShow() {
    components.cursor.style.display = "block";
}

function cursorHide() {
    components.cursor.style.display = "none";
}

function createScore() {
    components.score.style.width = 200 + "px";
    components.score.style.height = 50 + "px";
    components.score.style.display = "flex";
    components.score.style.justifyContent = "center";
    components.score.style.alignItems = "center";
    components.score.style.borderRadius = config.borderRadius + "px";
    components.score.style.backgroundColor = config.contentColorBG;
    components.score.style.position = "absolute";
    components.score.style.bottom = "calc(100% + " + 24 + "px)";
    components.score.style.left = "calc(50% - " + (parseInt(components.score.style.width) / 2) + "px)";

    components.score.style.fontFamily = "sans-serif";
    components.score.style.fontSize = "16px";
    components.score.style.color = "#ffffff";

    updateScore();
}

function updateScore() {
    components.score.innerHTML = config.countScore;
    components.wrapper.append(components.score);
}

function scoreInc(count) {
    if (count >= 4) {
        count *= 2;
    } else if (count >= 5) {
        count = (count + 1) * 2;
    } else if (count >= 6) {
        count *= (count + 2) * 2;
    }

    config.countScore += count;
    updateScore();
}

function createGem(t, l, row, col, img) {
    let coin = document.createElement("div");

    coin.classList.add(config.gemClass);
    coin.id = config.gemIdPrefix + '_' + row + '_' + col;
    coin.style.boxSizing = "border-box";
    coin.style.cursor = "pointer";
    coin.style.position = "absolute";
    coin.style.top = t + "px";
    coin.style.left = l + "px";
    coin.style.width = config.gemSize + "px";
    coin.style.height = config.gemSize + "px";
    coin.style.border = "1p solid transparent";
    coin.style.backgroundImage = "url(" + img + ")";
    coin.style.backgroundSize = "100%";

    components.wrapper.append(coin);
}

function createGrid() {
    for (i = 0; i < config.countRows; i++) {
        components.gems[i] = new Array();
        for (j = 0; j < config.countCols; j++) {
            components.gems[i][j] = -1;
        }
    }

    for (i = 0; i < config.countRows; i++) {
        for (j = 0; j < config.countCols; j++) {

            do {
                components.gems[i][j] = Math.floor(Math.random() * 9);
            } while (isStreak(i, j));

            createGem(i * config.gemSize, j * config.gemSize, i, j, config.imagesCoin[components.gems[i][j]]);
        }
    }
}

function isStreak(row, col) {
    return isVerticalStreak(row, col) || isHorizontalStreak(row, col);
}

function isVerticalStreak(row, col) {
    let gemValue = components.gems[row][col];
    let streak = 0;
    let tmp = row;

    while (tmp > 0 && components.gems[tmp - 1][col] == gemValue) {
        streak++;
        tmp--;
    }

    tmp = row;

    while (tmp < config.countRows - 1 && components.gems[tmp + 1][col] == gemValue) {
        streak++;
        tmp++;
    }

    return streak > 1;
}

function isHorizontalStreak(row, col) {
    let gemValue = components.gems[row][col];
    let streak = 0;
    let tmp = col;

    while (tmp > 0 && components.gems[row][tmp - 1] == gemValue) {
        streak++;
        tmp--;
    }

    tmp = col;

    while (tmp < config.countCols - 1 && components.gems[row][tmp + 1] == gemValue) {
        streak++;
        tmp++;
    }

    return streak > 1;
}

function handlerTab(event, target) {
    if (target.classList.contains(config.gemClass) && config.gameStates[0]) {
        let row = parseInt(target.getAttribute("id").split("_")[1]);
        let col = parseInt(target.getAttribute("id").split("_")[2]);

        cursorShow();
        components.cursor.style.top = parseInt(target.style.top) + "px";
        components.cursor.style.left = parseInt(target.style.left) + "px";

        if (player.selectedRow == -1) {
            player.selectedRow = row;
            player.selectedCol = col;
        } else {
            if ((Math.abs(player.selectedRow - row) == 1 && player.selectedCol == col) ||
                (Math.abs(player.selectedCol - col) == 1 && player.selectedRow == row)) {
                cursorHide();

                config.gameState = config.gameStates[1];

                player.posX = col;
                player.posY = row;

                gemSwitch();
            } else {
                player.selectedRow = row;
                player.selectedCol = col;
            }
        }
    }
}

function gemSwitch() {
    let yOffset = player.selectedRow - player.posY;
    let xOffset = player.selectedCol - player.posX;

    document.querySelector("#" + config.gemIdPrefix + "_" + player.selectedRow + "_" + player.selectedCol).classList.add("switch");
    document.querySelector("#" + config.gemIdPrefix + "_" + player.selectedRow + "_" + player.selectedCol).setAttribute("dir", "-1");

    document.querySelector("#" + config.gemIdPrefix + "_" + player.posY + "_" + player.posX).classList.add("switch");
    document.querySelector("#" + config.gemIdPrefix + "_" + player.posY + "_" + player.posX).setAttribute("dir", "1");

    $(".switch").each(function () {
        config.movingItems++;

        $(this).animate({
            left: "+=" + xOffset * config.gemSize * $(this).attr("dir"),
            top: "+=" + yOffset * config.gemSize * $(this).attr("dir")
        },
            {
                duration: 250,
                complete: function () {
                    checkMoving();
                }
            }
        );

        $(this).removeClass("switch");
    });

    document.querySelector("#" + config.gemIdPrefix + "_" + player.selectedRow + "_" + player.selectedCol).setAttribute("id", "temp");
    document.querySelector("#" + config.gemIdPrefix + "_" + player.posY + "_" + player.posX).setAttribute("id", config.gemIdPrefix + "_" + player.selectedRow + "_" + player.selectedCol);
    document.querySelector("#temp").setAttribute("id", config.gemIdPrefix + "_" + player.posY + "_" + player.posX);

    let temp = components.gems[player.selectedRow][player.selectedCol];
    components.gems[player.selectedRow][player.selectedCol] = components.gems[player.posY][player.posX];
    components.gems[player.posY][player.posX] = temp;
}

function checkMoving() {
    config.movingItems--;

    if (config.movingItems == 0) {

        switch (config.gameState) {

            case config.gameStates[1]:
            case config.gameStates[2]:
                if (!isStreak(player.selectedRow, player.selectedCol) && !isStreak(player.posY, player.posX)) {
                    if (config.gameState != config.gameStates[2]) {
                        config.gameState = config.gameStates[2];
                        gemSwitch();
                    } else {
                        config.gameState = config.gameStates[0];
                        player.selectedRow = -1;
                        player.selectedCol = -1;
                    }
                } else {
                    config.gameState = config.gameStates[3]

                    if (isStreak(player.selectedRow, player.selectedCol)) {
                        removeGems(player.selectedRow, player.selectedCol);
                    }

                    if (isStreak(player.posY, player.posX)) {
                        removeGems(player.posY, player.posX);
                    }

                    gemFade();
                }
                break;
            case config.gameStates[3]:
                checkFalling();
                break;
            case config.gameStates[4]:
                placeNewGems();
                break;
        }

    }

}

function removeGems(row, col) {
    let gemValue = components.gems[row][col];
    let tmp = row;

    document.querySelector("#" + config.gemIdPrefix + "_" + row + "_" + col).classList.add("remove");
    let countRemoveGem = document.querySelectorAll(".remove").length;

    if (isVerticalStreak(row, col)) {
        while (tmp > 0 && components.gems[tmp - 1][col] == gemValue) {
            document.querySelector("#" + config.gemIdPrefix + "_" + (tmp - 1) + "_" + col).classList.add("remove");
            components.gems[tmp - 1][col] = -1;
            tmp--;
            countRemoveGem++;
        }

        tmp = row;

        while (tmp < config.countRows - 1 && components.gems[tmp + 1][col] == gemValue) {
            document.querySelector("#" + config.gemIdPrefix + "_" + (tmp + 1) + "_" + col).classList.add("remove");
            components.gems[tmp + 1][col] = -1;
            tmp++;
            countRemoveGem++;
        }
    }

    if (isHorizontalStreak(row, col)) {
        tmp = col;

        while (tmp > 0 && components.gems[row][tmp - 1] == gemValue) {
            document.querySelector("#" + config.gemIdPrefix + "_" + row + "_" + (tmp - 1)).classList.add("remove");
            components.gems[row][tmp - 1] = -1;
            tmp--;
            countRemoveGem++;
        }

        tmp = col;

        while (tmp < config.countCols - 1 && components.gems[row][tmp + 1] == gemValue) {
            document.querySelector("#" + config.gemIdPrefix + "_" + row + "_" + (tmp + 1)).classList.add("remove");
            components.gems[row][tmp + 1] = -1;
            tmp++;
            countRemoveGem++;
        }
    }

    components.gems[row][col] = -1;

    scoreInc(countRemoveGem);
}

function gemFade() {
    $(".remove").each(function () {
        config.movingItems++;

        $(this).animate({
            opacity: 0
        },
            {
                duration: 200,
                complete: function () {
                    $(this).remove();
                    checkMoving();
                }
            }
        );
    });
}

function checkFalling() {
    let fellDown = 0;

    for (j = 0; j < config.countCols; j++) {
        for (i = config.countRows - 1; i > 0; i--) {

            if (components.gems[i][j] == -1 && components.gems[i - 1][j] >= 0) {
                document.querySelector("#" + config.gemIdPrefix + "_" + (i - 1) + "_" + j).classList.add("fall");
                document.querySelector("#" + config.gemIdPrefix + "_" + (i - 1) + "_" + j).setAttribute("id", config.gemIdPrefix + "_" + i + "_" + j);
                components.gems[i][j] = components.gems[i - 1][j];
                components.gems[i - 1][j] = -1;
                fellDown++;
            }

        }
    }

    $(".fall").each(function () {
        config.movingItems++;

        $(this).animate({
            top: "+=" + config.gemSize
        },
            {
                duration: 100,
                complete: function () {
                    $(this).removeClass("fall");
                    checkMoving();
                }
            }
        );
    });

    if (fellDown == 0) {
        config.gameState = config.gameStates[4];
        config.movingItems = 1;
        checkMoving();
    }
}

function placeNewGems() {
    let gemsPlaced = 0;

    for (i = 0; i < config.countCols; i++) {
        if (components.gems[0][i] == -1) {
            components.gems[0][i] = Math.floor(Math.random() * 8);

            createGem(0, i * config.gemSize, 0, i, config.imagesCoin[components.gems[0][i]]);
            gemsPlaced++;
        }
    }

    if (gemsPlaced) {
        config.gameState = config.gameStates[3];
        checkFalling();
    } else {
        let combo = 0

        for (i = 0; i < config.countRows; i++) {
            for (j = 0; j < config.countCols; j++) {

                if (j <= config.countCols - 3 && components.gems[i][j] == components.gems[i][j + 1] && components.gems[i][j] == components.gems[i][j + 2]) {
                    combo++;
                    removeGems(i, j);
                }
                if (i <= config.countRows - 3 && components.gems[i][j] == components.gems[i + 1][j] && components.gems[i][j] == components.gems[i + 2][j]) {
                    combo++;
                    removeGems(i, j);
                }

            }
        }

        if (combo > 0) {
            config.gameState = config.gameStates[3];
            gemFade();
        } else {
            config.gameState = config.gameStates[0];
            player.selectedRow = -1;
        }
    }
}

// Новые функции для механик

function createSpecialGem(row, col, type) {
    let specialGemIndex;
    switch (type) {
        case "rocket":
            specialGemIndex = 9 + Math.floor(Math.random() * 2); // Ракета (горизонтальная или вертикальная)
            break;
        case "bomb":
            specialGemIndex = 11; // Бомба
            break;
        case "super":
            specialGemIndex = 12; // Супер-гем
            break;
    }
    components.gems[row][col] = specialGemIndex;
    createGem(row * config.gemSize, col * config.gemSize, row, col, config.imagesCoin[specialGemIndex]);
}

function activateRocket(row, col, direction) {
    if (direction === "horizontal") {
        for (let i = 0; i < config.countCols; i++) {
            if (components.gems[row][i] !== -1) {
                removeGems(row, i);
            }
        }
    } else if (direction === "vertical") {
        for (let i = 0; i < config.countRows; i++) {
            if (components.gems[i][col] !== -1) {
                removeGems(i, col);
            }
        }
    }
}

function activateBomb(row, col) {
    for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < config.countRows && j >= 0 && j < config.countCols && components.gems[i][j] !== -1) {
                removeGems(i, j);
            }
        }
    }
}

function activateSuperGem(row, col) {
    let gemType = components.gems[row][col];
    for (let i = 0; i < config.countRows; i++) {
        for (let j = 0; j < config.countCols; j++) {
            if (components.gems[i][j] === gemType) {
                removeGems(i, j);
            }
        }
    }
}

function checkSpecialCombinations() {
    for (let i = 0; i < config.countRows; i++) {
        for (let j = 0; j < config.countCols; j++) {
            if (i <= config.countRows - 5 && components.gems[i][j] === components.gems[i + 1][j] && components.gems[i][j] === components.gems[i + 2][j] && components.gems[i][j] === components.gems[i + 3][j] && components.gems[i][j] === components.gems[i + 4][j]) {
                createSpecialGem(i + 2, j, "rocket");
            }
            if (j <= config.countCols - 5 && components.gems[i][j] === components.gems[i][j + 1] && components.gems[i][j] === components.gems[i][j + 2] && components.gems[i][j] === components.gems[i][j + 3] && components.gems[i][j] === components.gems[i][j + 4]) {
                createSpecialGem(i, j + 2, "rocket");
            }
            if (i <= config.countRows - 2 && j <= config.countCols - 2 && components.gems[i][j] === components.gems[i + 1][j] && components.gems[i][j] === components.gems[i][j + 1] && components.gems[i][j] === components.gems[i + 1][j + 1]) {
                createSpecialGem(i, j, "bomb");
            }
            if (i <= config.countRows - 7 && components.gems[i][j] === components.gems[i + 1][j] && components.gems[i][j] === components.gems[i + 2][j] && components.gems[i][j] === components.gems[i + 3][j] && components.gems[i][j] === components.gems[i + 4][j] && components.gems[i][j] === components.gems[i + 5][j] && components.gems[i][j] === components.gems[i + 6][j]) {
                createSpecialGem(i + 3, j, "super");
            }
            if (j <= config.countCols - 7 && components.gems[i][j] === components.gems[i][j + 1] && components.gems[i][j] === components.gems[i][j + 2] && components.gems[i][j] === components.gems[i][j + 3] && components.gems[i][j] === components.gems[i][j + 4] && components.gems[i][j] === components.gems[i][j + 5] && components.gems[i][j] === components.gems[i][j + 6]) {
                createSpecialGem(i, j + 3, "super");
            }
        }
    }
}

// Обновляем функцию handlerTab для обработки специальных гемов
function handlerTab(event, target) {
    if (target.classList.contains(config.gemClass) && config.gameStates[0]) {
        let row = parseInt(target.getAttribute("id").split("_")[1]);
        let col = parseInt(target.getAttribute("id").split("_")[2]);

        cursorShow();
        components.cursor.style.top = parseInt(target.style.top) + "px";
        components.cursor.style.left = parseInt(target.style.left) + "px";

        if (player.selectedRow == -1) {
            player.selectedRow = row;
            player.selectedCol = col;
        } else {
            if ((Math.abs(player.selectedRow - row) == 1 && player.selectedCol == col) ||
                (Math.abs(player.selectedCol - col) == 1 && player.selectedRow == row)) {
                cursorHide();

                config.gameState = config.gameStates[1];

                player.posX = col;
                player.posY = row;

                gemSwitch();
            } else {
                player.selectedRow = row;
                player.selectedCol = col;
            }
        }
    } else if (target.classList.contains(config.gemClass) && config.gameState === "pick") {
        let row = parseInt(target.getAttribute("id").split("_")[1]);
        let col = parseInt(target.getAttribute("id").split("_")[2]);

        let gemType = components.gems[row][col];
        if (gemType >= 9 && gemType <= 11) {
            if (gemType === 9 || gemType === 10) {
                activateRocket(row, col, gemType === 9 ? "horizontal" : "vertical");
            } else if (gemType === 11) {
                activateBomb(row, col);
            } else if (gemType === 12) {
                activateSuperGem(row, col);
            }
        }
    }
}