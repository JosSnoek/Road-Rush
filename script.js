const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");
const levelText = document.getElementById("level");
const livesText = document.getElementById("lives");

const pauseButton = document.getElementById("pauseButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");


// ============================
// GAME
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
// BESTURING PC
// ============================

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


// ============================
// TELEFOON
// ============================

function leftDown(event) {

  event.preventDefault();

  keys.left = true;
}

function leftUp(event) {

  event.preventDefault();

  keys.left = false;
}

function rightDown(event) {

  event.preventDefault();

  keys.right = true;
}

function rightUp(event) {

  event.preventDefault();

  keys.right = false;
}


leftButton.addEventListener("pointerdown", leftDown);
leftButton.addEventListener("pointerup", leftUp);
leftButton.addEventListener("pointercancel", leftUp);
leftButton.addEventListener("pointerleave", leftUp);

rightButton.addEventListener("pointerdown", rightDown);
rightButton.addEventListener("pointerup", rightUp);
rightButton.addEventListener("pointercancel", rightUp);
rightButton.addEventListener("pointerleave", rightUp);


// ============================
// PAUZE
// ============================

pauseButton.addEventListener("click", togglePause);

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


// ============================
// UI
// ============================

function updateUI() {

  scoreText.textContent = "Score: " + score;

  levelText.textContent = "Level: " + level;

  if (lives === 3) {
    livesText.textContent = "❤️ ❤️ ❤️";
  }

  if (lives === 2) {
    livesText.textContent = "❤️ ❤️ 🖤";
  }

  if (lives === 1) {
    livesText.textContent = "❤️ 🖤 🖤";
  }

  if (lives <= 0) {
    livesText.textContent = "🖤 🖤 🖤";
  }
}


// ============================
// VIJAND MAKEN
// ============================

function createEnemy() {

  const lanes = [80, 180, 280];

  const lane =
    lanes[Math.floor(Math.random() * lanes.length)];

  enemies.push({

    x: lane,
    y: -80,
    width: 40,
    height: 70,

    // Elk level sneller
    speed: 2 + level * 0.8
  });
}


// ============================
// BOTSING
// ============================

function isCollision(a, b) {

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

  // Alle auto's weg na botsing
  enemies = [];

  // Speler terug naar midden
  player.x = 180;

  // Timer resetten
  spawnTimer = 0;

  if (lives <= 0) {

    gameOver = true;

    setTimeout(function() {

      alert(
        "💥 GAME OVER!\n\nScore: " + score
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
// WEG TEKENEN
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


  // Weg randen
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


  // Bewegende middenstrepen

  if (!paused) {

    roadOffset += 5 + level * 0.5;
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
    keys.left
  ) {

    player.x -= player.speed;
  }


  // Rechts

  if (
    keys.arrowright ||
    keys.d ||
    keys.right
  ) {

    player.x += player.speed;
  }


  // Binnen de weg blijven

  if (player.x < 45) {

    player.x = 45;
  }

  if (player.x > 315) {

    player.x = 315;
  }


  // Vijanden spawnen

  spawnTimer++;

  const spawnDelay =
    Math.max(35, 80 - level * 4);

  if (spawnTimer >= spawnDelay) {

    createEnemy();

    spawnTimer = 0;
  }


  // Vijanden bewegen

  for (
    let i = enemies.length - 1;
    i >= 0;
    i--
  ) {

    const enemy = enemies[i];

    enemy.y += enemy.speed;


    // Botsing

    if (isCollision(player, enemy)) {

      enemies.splice(i, 1);

      loseLife();

      return;
    }


    // Auto voorbij

    if (enemy.y > canvas.height) {

      enemies.splice(i, 1);

      score++;

      // Iedere 10 punten een level hoger

      level =
        Math.floor(score / 10) + 1;

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


  // Pauze

  if (paused) {

    ctx.fillStyle =
      "rgba(0,0,0,0.65)";

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
      "Druk op ▶️",
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
