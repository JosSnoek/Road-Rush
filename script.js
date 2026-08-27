```javascript
"use strict";


// ================================
// ELEMENTEN
// ================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
const livesElement = document.getElementById("lives");
const pauseButton = document.getElementById("pauseButton");

const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");


// ================================
// GAME STATUS
// ================================

let score = 0;
let level = 1;
let lives = 3;

let paused = false;
let gameOver = false;

let spawnTimer = 0;
let roadOffset = 0;


// ================================
// BESTURING
// ================================

const keys = {};


// ================================
// SPELER
// ================================

const player = {
  x: 180,
  y: 500,
  width: 40,
  height: 70,
  speed: 6
};


// ================================
// VIJANDEN
// ================================

let enemies = [];


// ================================
// SNELHEID
// ================================

function getEnemySpeed() {

  // Begin langzaam.
  // Elk level wordt sneller.
  // Elk verloren leven geeft extra snelheid.

  return 2.5 + ((level - 1) * 0.7) + ((3 - lives) * 0.8);
}


// ================================
// SCORE
// ================================

function updateScore() {

  scoreElement.textContent =
    "Score: " + score;
}


// ================================
// LEVEL
// ================================

function updateLevel() {

  level =
    Math.floor(score / 10) + 1;

  levelElement.textContent =
    "Level: " + level;
}


// ================================
// LEVENS
// ================================

function updateLives() {

  if (lives === 3) {

    livesElement.textContent =
      "❤️ ❤️ ❤️";

  } else if (lives === 2) {

    livesElement.textContent =
      "❤️ ❤️ 🖤";

  } else if (lives === 1) {

    livesElement.textContent =
      "❤️ 🖤 🖤";

  } else {

    livesElement.textContent =
      "🖤 🖤 🖤";
  }
}


// ================================
// PAUZE
// ================================

function togglePause() {

  if (gameOver) {
    return;
  }

  paused = !paused;

  if (paused) {

    pauseButton.textContent = "▶️";

  } else {

    pauseButton.textContent = "⏸️";
  }
}


pauseButton.addEventListener(
  "click",
  togglePause
);


// ================================
// PC BESTURING
// ================================

document.addEventListener("keydown", function(event) {

  keys[event.key.toLowerCase()] = true;

  if (event.code === "Space") {

    event.preventDefault();

    togglePause();
  }
});


document.addEventListener("keyup", function(event) {

  keys[event.key.toLowerCase()] = false;
});


// ================================
// TELEFOON BESTURING
// ================================

function pressLeft(event) {

  event.preventDefault();

  keys.mobileLeft = true;
}


function releaseLeft(event) {

  event.preventDefault();

  keys.mobileLeft = false;
}


function pressRight(event) {

  event.preventDefault();

  keys.mobileRight = true;
}


function releaseRight(event) {

  event.preventDefault();

  keys.mobileRight = false;
}


// Linker knop

leftButton.addEventListener(
  "pointerdown",
  pressLeft
);

leftButton.addEventListener(
  "pointerup",
  releaseLeft
);

leftButton.addEventListener(
  "pointercancel",
  releaseLeft
);

leftButton.addEventListener(
  "pointerleave",
  releaseLeft
);


// Rechter knop

rightButton.addEventListener(
  "pointerdown",
  pressRight
);

rightButton.addEventListener(
  "pointerup",
  releaseRight
);

rightButton.addEventListener(
  "pointercancel",
  releaseRight
);

rightButton.addEventListener(
  "pointerleave",
  releaseRight
);


// ================================
// VIJAND MAKEN
// ================================

function spawnEnemy() {

  const lanes = [80, 180, 280];

  const lane =
    lanes[
      Math.floor(
        Math.random() * lanes.length
      )
    ];

  enemies.push({

    x: lane,

    y: -80,

    width: 40,

    height: 70,

    speed:
      getEnemySpeed() +
      Math.random() * 1.2
  });
}


// ================================
// BOTSING
// ================================

function collision(a, b) {

  return (

    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y

  );
}


// ================================
// LEVEN VERLIEZEN
// ================================

function loseLife() {

  lives--;

  updateLives();

  // Alle vijanden verwijderen
  // zodat je niet direct nogmaals botst.

  enemies = [];

  spawnTimer = 0;

  // Speler terug naar midden.

  player.x = 180;


  if (lives <= 0) {

    gameOver = true;

    setTimeout(function() {

      alert(
        "💥 GAME OVER!\n\n" +
        "Score: " + score
      );

      location.reload();

    }, 100);

  }
}


// ================================
// AUTO TEKENEN
// ================================

function drawCar(car, color) {

  // Schaduw

  ctx.fillStyle =
    "rgba(0, 0, 0, 0.4)";

  ctx.fillRect(
    car.x + 4,
    car.y + 5,
    car.width,
    car.height
  );


  // Auto

  ctx.fillStyle = color;

  ctx.fillRect(
    car.x,
    car.y,
    car.width,
    car.height
  );


  // Voorruit

  ctx.fillStyle = "#111";

  ctx.fillRect(
    car.x + 7,
    car.y + 10,
    car.width - 14,
    20
  );


  // Achterruit

  ctx.fillRect(
    car.x + 7,
    car.y + 40,
    car.width - 14,
    15
  );


  // Wielen

  ctx.fillStyle = "#000";

  ctx.fillRect(
    car.x - 5,
    car.y + 10,
    6,
    20
  );

  ctx.fillRect(
    car.x + car.width - 1,
    car.y + 10,
    6,
    20
  );

  ctx.fillRect(
    car.x - 5,
    car.y + 45,
    6,
    20
  );

  ctx.fillRect(
    car.x + car.width - 1,
    car.y + 45,
    6,
    20
  );
}


// ================================
// WEG TEKENEN
// ================================

function drawRoad() {

  // Gras

  ctx.fillStyle = "#198a35";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  // Weg

  ctx.fillStyle = "#3d3d3d";

  ctx.fillRect(
    35,
    0,
    330,
    canvas.height
  );


  // Randen

  ctx.fillStyle = "white";

  ctx.fillRect(
    35,
    0,
    5,
    canvas.height
  );

  ctx.fillRect(
    360,
    0,
    5,
    canvas.height
  );


  // Middenstreep

  if (!paused) {

    roadOffset +=
      5 + (level * 0.6);

  }

  if (roadOffset >= 60) {

    roadOffset = 0;
  }


  ctx.fillStyle = "white";

  for (
    let y = -60 + roadOffset;
    y < canvas.height;
    y += 60
  ) {

    ctx.fillRect(
      195,
      y,
      10,
      35
    );
  }
}


// ================================
// GAME UPDATEN
// ================================

function update() {

  if (paused || gameOver) {
    return;
  }


  // Links

  if (
    keys["arrowleft"] ||
    keys["a"] ||
    keys.mobileLeft
  ) {

    player.x -= player.speed;
  }


  // Rechts

  if (
    keys["arrowright"] ||
    keys["d"] ||
    keys.mobileRight
  ) {

    player.x += player.speed;
  }


  // Binnen de weg

  if (player.x < 45) {

    player.x = 45;
  }

  if (player.x > 315) {

    player.x = 315;
  }


  // ==============================
  // VIJANDEN SPAWNEN
  // ==============================

  spawnTimer++;


  const spawnDelay =
    Math.max(
      38,
      75 - (level * 3)
    );


  if (spawnTimer >= spawnDelay) {

    spawnEnemy();

    spawnTimer = 0;
  }


  // ==============================
  // VIJANDEN BEWEGEN
  // ==============================

  for (
    let i = enemies.length - 1;
    i >= 0;
    i--
  ) {

    const enemy = enemies[i];


    enemy.y += enemy.speed;


    // Botsing

    if (
      collision(
        player,
        enemy
      )
    ) {

      enemies.splice(i, 1);

      loseLife();

      return;
    }


    // Auto voorbij

    if (
      enemy.y >
      canvas.height + 20
    ) {

      enemies.splice(i, 1);

      score++;

      updateScore();

      updateLevel();
    }
  }
}


// ================================
// TEKENEN
// ================================

function draw() {

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  // Weg

  drawRoad();


  // Vijanden

  for (
    const enemy of enemies
  ) {

    drawCar(
      enemy,
      "#e53935"
    );
  }


  // Speler

  drawCar(
    player,
    "#00e676"
  );


  // ==============================
  // PAUZE SCHERM
  // ==============================

  if (paused) {

    ctx.fillStyle =
      "rgba(0, 0, 0, 0.65)";

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    ctx.fillStyle = "white";

    ctx.textAlign = "center";

    ctx.font =
      "bold 45px Arial";

    ctx.fillText(
      "PAUZE",
      canvas.width / 2,
      280
    );


    ctx.font =
      "20px Arial";

    ctx.fillText(
      "Druk op ▶️ om verder te gaan",
      canvas.width / 2,
      325
    );


    ctx.textAlign = "left";
  }
}


// ================================
// GAME LOOP
// ================================

function gameLoop() {

  update();

  draw();

  requestAnimationFrame(
    gameLoop
  );
}


// ================================
// START
// ================================

updateScore();
updateLevel();
updateLives();

gameLoop();
```
