alert("SCRIPT WERKT!");

"use strict";

// ============================
// ELEMENTEN
// ============================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
const livesElement = document.getElementById("lives");

const pauseButton = document.getElementById("pauseButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");


// ============================
// GAME VARIABELEN
// ============================

let score = 0;
let level = 1;
let lives = 3;

let paused = false;
let gameOver = false;

let spawnTimer = 0;
let roadOffset = 0;

const keys = {};


// ============================
// SPELER
// ============================

const player = {
  x: 180,
  y: 500,
  width: 40,
  height: 70,
  speed: 6
};


// ============================
// VIJANDEN
// ============================

let enemies = [];


// ============================
// UI
// ============================

function updateUI() {

  scoreElement.textContent = "Score: " + score;

  levelElement.textContent = "Level: " + level;

  if (lives === 3) {
    livesElement.textContent = "❤️ ❤️ ❤️";
  } else if (lives === 2) {
    livesElement.textContent = "❤️ ❤️ 🖤";
  } else if (lives === 1) {
    livesElement.textContent = "❤️ 🖤 🖤";
  } else {
    livesElement.textContent = "🖤 🖤 🖤";
  }
}


// ============================
// PC BESTURING
// ============================

document.addEventListener("keydown", function (event) {

  keys[event.key.toLowerCase()] = true;

  if (event.code === "Space") {

    event.preventDefault();

    togglePause();
  }
});


document.addEventListener("keyup", function (event) {

  keys[event.key.toLowerCase()] = false;
});


// ============================
// TELEFOON BESTURING
// ============================

function leftStart(event) {

  event.preventDefault();

  keys.mobileLeft = true;
}

function leftStop(event) {

  event.preventDefault();

  keys.mobileLeft = false;
}

function rightStart(event) {

  event.preventDefault();

  keys.mobileRight = true;
}

function rightStop(event) {

  event.preventDefault();

  keys.mobileRight = false;
}


// Linker knop

leftButton.addEventListener("pointerdown", leftStart);
leftButton.addEventListener("pointerup", leftStop);
leftButton.addEventListener("pointercancel", leftStop);
leftButton.addEventListener("pointerleave", leftStop);


// Rechter knop

rightButton.addEventListener("pointerdown", rightStart);
rightButton.addEventListener("pointerup", rightStop);
rightButton.addEventListener("pointercancel", rightStop);
rightButton.addEventListener("pointerleave", rightStop);


// ============================
// PAUZE
// ============================

pauseButton.addEventListener("click", togglePause);

function togglePause() {

  if (gameOver) {
    return;
  }

  paused = !paused;

  pauseButton.textContent =
    paused ? "▶️" : "⏸️";
}


// ============================
// VIJAND MAKEN
// ============================

function spawnEnemy() {

  const lanes = [80, 180, 280];

  const lane =
    lanes[Math.floor(Math.random() * lanes.length)];

  /*
    Begin langzaam.

    Level 1 = langzaam
    Level 2 = sneller
    Level 3 = nog sneller
    enz.
  */

  const enemySpeed =
    2 + (level - 1) * 0.7 + Math.random() * 0.8;

  enemies.push({

    x: lane,
    y: -80,

    width: 40,
    height: 70,

    speed: enemySpeed
  });
}


// ============================
// BOTSING
// ============================

function collision(a, b) {

  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}


// ============================
// LEVEN VERLIEZEN
// ============================

function loseLife() {

  lives--;

  updateUI();

  // Vijanden verwijderen
  enemies = [];

  // Speler terug naar het midden
  player.x = 180;

  // Nieuwe vijanden iets later
  spawnTimer = 0;

  if (lives <= 0) {

    gameOver = true;

    setTimeout(function () {

      alert(
        "💥 GAME OVER!\n\n" +
        "Score: " + score +
        "\nLevel: " + level
      );

      location.reload();

    }, 100);
  }
}


// ============================
// AUTO TEKENEN
// ============================

function drawCar(car, color) {

  // Schaduw

  ctx.fillStyle = "rgba(0,0,0,0.35)";

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


// ============================
// WEG
// ============================

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


  // Witte randen

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


  // Middenstrepen

  if (!paused) {

    roadOffset += 4 + level * 0.4;
  }

  if (roadOffset >= 60) {

    roadOffset = 0;
  }


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


// ============================
// GAME UPDATE
// ============================

function update() {

  if (paused || gameOver) {
    return;
  }


  // Links

  if (
    keys.arrowleft ||
    keys.a ||
    keys.mobileLeft
  ) {

    player.x -= player.speed;
  }


  // Rechts

  if (
    keys.arrowright ||
    keys.d ||
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


  // ==========================
  // VIJANDEN SPAWNEN
  // ==========================

  spawnTimer++;

  // Hogere levels = sneller nieuwe auto's

  const spawnDelay =
    Math.max(35, 90 - level * 5);

  if (spawnTimer >= spawnDelay) {

    spawnEnemy();

    spawnTimer = 0;
  }


  // ==========================
  // VIJANDEN BEWEGEN
  // ==========================

  for (
    let i = enemies.length - 1;
    i >= 0;
    i--
  ) {

    const enemy = enemies[i];

    enemy.y += enemy.speed;


    // Botsing

    if (collision(player, enemy)) {

      enemies.splice(i, 1);

      loseLife();

      return;
    }


    // Auto voorbij

    if (enemy.y > canvas.height) {

      enemies.splice(i, 1);

      score++;


      // Elke 10 punten een level omhoog

      const newLevel =
        Math.floor(score / 10) + 1;

      if (newLevel !== level) {

        level = newLevel;
      }

      updateUI();
    }
  }
}


// ============================
// TEKENEN
// ============================

function draw() {

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  drawRoad();


  // Vijanden

  for (const enemy of enemies) {

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


  // ==========================
  // PAUZE SCHERM
  // ==========================

  if (paused) {

    ctx.fillStyle =
      "rgba(0,0,0,0.7)";

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


// ============================
// GAME LOOP
// ============================

function gameLoop() {

  update();

  draw();

  requestAnimationFrame(gameLoop);
}


// ============================
// START
// ============================

updateUI();

gameLoop();
