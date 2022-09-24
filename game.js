var canvas = document.getElementById("canvas"); //Получение холста из DOM
var ctx = canvas.getContext("2d"); //Получение контекста — через него можно работать с холстом
ctx.lineWidth = 2;

var maxTableSize = 3;

var colors = [
    "orange",
    "green",
    "blue",
    "magenta"
];

var fonts = [
    "20px Comic Sans MS",
    "30px Comic Sans MS",
    "40px Comic Sans MS"
];

var pos = 0;
var score = 0;
var total_score = 0;

var maxCount;

var x = canvas.width/2;
var y = canvas.height-30;

var playerX = 60 + 1;
var playerY = 60 + 1;

var array = [];
var color_array = [];
var font_array = [];

var lives = 0;

var gameIsRunning = false;
var isBlocked = false;

var leftPressed = false;
var upPressed = false;
var rightPressed = false;
var downPressed = false;
var enterPressed = false;

var h1 = document.getElementsByTagName('h1')[0];
var start = document.getElementById('start_btn');
var stop = document.getElementById('stop_btn');
var scr = document.getElementById('score_tbl');
var lvs = document.getElementById('lives_tbl');

var timerIsRunning = false;
var sec = 0;
var min = 0;
var hrs = 0;
var t;

function clearTimer() {
    clearTimeout(t);
    sec = 0; min = 0; hrs = 0;
    h1.textContent = (hrs > 9 ? hrs : "0" + hrs)
            	 + ":" + (min > 9 ? min : "0" + min)
           		 + ":" + (sec > 9 ? sec : "0" + sec);
}

function tick(){
    sec++;
    if (sec >= 60) {
        sec = 0;
        min++;
        if (min >= 60) {
            min = 0;
            hrs++;
        }
    }
}

function add() {
    tick();
    h1.textContent = (hrs > 9 ? hrs : "0" + hrs)
        	 + ":" + (min > 9 ? min : "0" + min)
       		 + ":" + (sec > 9 ? sec : "0" + sec);
    timer();
}

function timer() {
        t = setTimeout(add, 1000);
}

start.onclick = function() {
    // Уровень сложности
    var difficulty_level = document.getElementById("level_selector").value;

    if (difficulty_level == 0) {
        maxTableSize = 3;
    }
    else if (difficulty_level == 1) {
        maxTableSize = 5;
    }
    else if (difficulty_level == 2) {
        maxTableSize = 7;
    }

    startGame();

    maxCount = maxTableSize * maxTableSize;

    playerX = 60 + 1;
    playerY = 60 + 1;

    // Запуск таймера
    timer();
    // Запуск
    gameIsRunning = true;
}

stop.onclick = function() {
    clearTimer();
    timerIsRunning = false;
    endGame();
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

// Управление
document.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 37) {
        leftPressed = true;
        }
    else if(e.keyCode == 38) {
        upPressed = true;
        }
    else if(e.keyCode == 39) {
        rightPressed = true;
        }
    else if(e.keyCode == 40) {
        downPressed = true;
    }
    else if(e.keyCode == 13){
        e.preventDefault();
        enterPressed = true;
    }
}

function drawPlayer() {
    ctx.beginPath();
        ctx.rect(playerX, playerY, 58, 58);
        ctx.strokeStyle = "red";
        ctx.stroke();
    ctx.closePath();
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function drawField() {
    for (i = 0; i < maxTableSize; i++) {
       for (j = 0; j < maxTableSize; j++) {
         ctx.beginPath();
         ctx.rect(60+(i*60), 60+(j*60), 60, 60);
         ctx.strokeStyle = "black";
         ctx.stroke();
         ctx.closePath();
       }
    }

    ctx.beginPath();
    ctx.rect(60-4, 60-4, (maxTableSize*60)+8, (maxTableSize*60)+8);
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();
}

function drawNumbers() {
    if (!isBlocked){
                for (i = 0; i < maxTableSize * maxTableSize; i++) {
                    array[i] = i;
                    color_array[i] = colors[getRandomInt(colors.length)];
                    font_array[i] = fonts[getRandomInt(fonts.length)];
                }
                shuffle(array);
                isBlocked = true;
    }

        for (i = 0; i < maxTableSize; i++) {
              for (j = 0; j < maxTableSize; j++) {
                if (array[i*maxTableSize+j] != -1) {
                    ctx.font = font_array[i*maxTableSize+j];
                    ctx.fillStyle = color_array[i*maxTableSize+j];
                    ctx.textAlign = "center";
                    ctx.fillText(array[i*maxTableSize+j], 90+(j*60), 100+(i*60));
                }
                else {
                    ctx.beginPath();
                    ctx.rect(62 + (((j * 62) - 2 * j)), 62 + (((i * 62) - 2 * i)), 56, 56);
                    ctx.fillStyle = color_array[i*maxTableSize+j];
                    ctx.fill();
                    ctx.closePath();
                }
              }
            }
}

function startGame () {
    start.disabled = true;
    stop.disabled = false;

    stop.focus();

    lives = 3;

    pos = 0;
    score = 0;
    total_score = 0;
}

function endGame () {

    start.disabled = false;
    stop.disabled = true;

    if (score == maxCount) {
        alert("Ты победил!\n\n" + "Общий счет: " + (score * lives) + "\n\nВремя: " + h1.innerHTML);
    } else {
        alert("Ты проиграл!");
    }

    clearTimer();
    gameIsRunning = false;
    isBlocked = false;
    array = [];
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawField();

    if (gameIsRunning) {
        drawNumbers();
        drawPlayer();
        controller();

        scr.textContent = score;
        lvs.textContent = lives;
        //ctx.fillText(array[pos], 500, 500);

        if (lives == 0)
            endGame();
    }
}

setInterval(draw, 10);

function controller () {
    if(leftPressed) {
                if (playerX - 60 > 60) {
                                playerX -= 60 ;
                                pos -= 1;
                            }
                            leftPressed = false;
                    }
                else if(upPressed) {
                            if (playerY - 60 > 60) {
                                playerY -= 60;
                                pos -= maxTableSize;
                            }
                            upPressed = false;
                    }
                else if(rightPressed) {
                            if (playerX + 60 < 60+(maxTableSize*60)) {
                                playerX += 60 ;
                                pos += 1;
                            }
                            rightPressed = false;
                    }
                else if(downPressed) {
                            if (playerY + 60 < 60+(maxTableSize*60)) {
                                playerY += 60 ;
                                pos += maxTableSize;
                            }
                            downPressed = false;
                    }
                else if(enterPressed) {
                            if (array[pos] == score) {
                                score += 1;
                                array[pos] = -1;
                            } else
                                lives -= 1;

                            if(score == maxCount){
                                endGame();
                            }

                            enterPressed = false;
                    }
}