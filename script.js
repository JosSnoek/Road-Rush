const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");
const pauseButton = document.getElementById("pauseButton");

const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");

let score = 0;
let lives = 3;
let gameOver = false;
let paused = false;

const keys = {};

const player = {
  x: 180,
  y: 500,
  width: 40,
  height: 70,
  speed: 6
};

let enemies = [];
let spawnTimer = 0;
let roadOffset = 0;


// =========================
// LEVENS
// =========================

function updateLives() {
  livesElement.textContent = "❤️".repeat(lives) + "🖤".repeat(3 - lives);
}


// =========================
// PC BESTURING
// =========================

document.addEventListener("keydown", function(e) {

  keys[e.key.toLowerCase()] = true;

  if (e.code === "Space") {
    e.preventDefault();
    togglePause();
  }

});

document.addEventListener("keyup", function(e) {

  keys[e.key.toLowerCase()] = false;

});


// =========================
// PAUZE
// =========================

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


// =========================
// TELEFOON BESTURING
// =========================

function startLeft(e) {
  e.preventDefault();
  keys["mobileleft"] = true;
}

function stopLeft(e) {
  e.preventDefault();
  keys["mobileleft"] = false;
}

function startRight(e) {
  e.preventDefault();
  keys["mobileright"] = true;
}

function stopRight(e) {
  e.preventDefault();
  keys["mobileright"] = false;
}


leftButton.addEventListener("touchstart", startLeft, { passive: false });
leftButton.addEventListener("touchend", stopLeft, { passive: false });
leftButton.addEventListener("touchcancel", stopLeft, { passive: false });

rightButton.addEventListener("touchstart", startRight, { passive: false });
rightButton.addEventListener("touchend", stopRight, { passive: false });
rightButton.addEventListener("touchcancel", stopRight, { passive: false });

leftButton.addEventListener("mousedown", startLeft);
leftButton.addEventListener("mouseup", stopLeft);
leftButton.addEventListener("mouseleave", stopLeft);

rightButton.addEventListener("mousedown", startRight);
rightButton.addEventListener("mouseup", stopRight);
rightButton.addEventListener("mouseleave", stopRight);


// =========================
// VIJANDAUTO
// =========================

function spawnEnemy() {

  const lanes = [80, 180, 280];

  const randomLane =
    lanes[Math.floor(Math.random() * lanes.length)];

  enemies.push({

    x: randomLane,
    y: -80,

    width: 40,
    height: 70,

    speed: 4 + Math.random() * 2

  });

}


// =========================
// BOTSING
// =========================

function collision(a, b) {

  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );

}


// =========================
// BOTSING VERWERKEN
// =========================

function hitPlayer(enemy, index) {

  // Vijand verwijderen
  enemies.splice(index, 1);

  // 1 leven eraf
  lives--;

  updateLives();

  // Auto terug naar het midden
  player.x = 180;

  // Als alle levens op zijn
  if (lives <= 0) {

    lives = 0;
    updateLives();

    gameOver = true;

    setTimeout(function() {

      alert(
        "💥 GAME OVER!\n\nScore: " +
        score
      );

      location.reload();

    }, 100);

  }

}


// =========================
// AUTO TEKENEN
// =========================

function drawCar(car, color) {

  // Schaduw
  ctx.fillStyle = "rgba(0,0,0,0.4)";

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


// =========================
// RACEBAAN
// =========================

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
  ctx.fillStyle = "white";

  if (!paused) {
    roadOffset += 7;
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


// =========================
// GAME UPDATEN
// =========================

function update() {

  if (gameOver || paused) {
    return;
  }


  // Links
  if (
    keys["arrowleft"] ||
    keys["a"] ||
    keys["mobileleft"]
  ) {

    player.x -= player.speed;

  }


  // Rechts
  if (
    keys["arrowright"] ||
    keys["d"] ||
    keys["mobileright"]
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


  // Vijanden spawnen
  spawnTimer++;

  if (spawnTimer > 60) {

    spawnEnemy();

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
    if (collision(player, enemy)) {

      hitPlayer(enemy, i);

      // Alleen stoppen als game over is
      if (gameOver) {
        return;
      }

      continue;

    }


    // Vijand voorbij
    if (enemy.y > canvas.height) {

      enemies.splice(i, 1);

      score++;

      scoreElement.textContent =
        "Score: " + score;

    }

  }

}


// =========================
// TEKENEN
// =========================

function draw() {

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  drawRoad();


  // Vijanden
  enemies.forEach(function(enemy) {

    drawCar(
      enemy,
      "#e53935"
    );

  });


  // Speler
  drawCar(
    player,
    "#00e676"
  );


  // Pauze
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

    ctx.font =
      "bold 45px Arial";

    ctx.textAlign = "center";

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


// =========================
// GAME LOOP
// =========================

function gameLoop() {

  update();

  draw();

  requestAnimationFrame(gameLoop);

}


// =========================
// START
// =========================

updateLives();

gameLoop();
