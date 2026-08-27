```javascript
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
const livesElement = document.getElementById("lives");
const pauseButton = document.getElementById("pauseButton");

const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");


// =========================
// GAME
// =========================

let score = 0;
let level = 1;
let lives = 3;

let gameOver = false;
let paused = false;

const keys = {};


// =========================
// SPELER
// =========================

const player = {

  x: 180,
  y: 500,

  width: 40,
  height: 70,

  speed: 6

};


// =========================
// SNELHEID
// =========================

// Begin langzaam
let baseEnemySpeed = 2.5;

// Wordt hoger naarmate je score stijgt
let levelSpeed = 0;

// Elk verloren leven maakt alles sneller
let lifeSpeed = 0;


// =========================
// VIJANDEN
// =========================

let enemies = [];

let spawnTimer = 0;

let roadOffset = 0;


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

pauseButton.addEventListener(
  "click",
  togglePause
);


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


// Linker knop

leftButton.addEventListener(
  "touchstart",
  startLeft,
  { passive: false }
);

leftButton.addEventListener(
  "touchend",
  stopLeft,
  { passive: false }
);

leftButton.addEventListener(
  "touchcancel",
  stopLeft,
  { passive: false }
);

leftButton.addEventListener(
  "mousedown",
  startLeft
);

leftButton.addEventListener(
  "mouseup",
  stopLeft
);

leftButton.addEventListener(
  "mouseleave",
  stopLeft
);


// Rechter knop

rightButton.addEventListener(
  "touchstart",
  startRight,
  { passive: false }
);

rightButton.addEventListener(
  "touchend",
  stopRight,
  { passive: false }
);

rightButton.addEventListener(
  "touchcancel",
  stopRight,
  { passive: false }
);

rightButton.addEventListener(
  "mousedown",
  startRight
);

rightButton.addEventListener(
  "mouseup",
  stopRight
);

rightButton.addEventListener(
  "mouseleave",
  stopRight
);


// =========================
// LEVENS
// =========================

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


// =========================
// LEVEL
// =========================

function updateLevel() {

  // Iedere 5 punten een level hoger

  level =
    Math.floor(score / 5) + 1;

  levelElement.textContent =
    "Level: " + level;

  // Elke level wordt sneller

  levelSpeed =
    (level - 1) * 0.5;

}


// =========================
// AUTO'S SPAWNEN
// =========================

function spawnEnemy() {

  const lanes = [
    80,
    180,
    280
  ];

  const randomLane =
    lanes[
      Math.floor(
        Math.random() * lanes.length
      )
    ];

  enemies.push({

    x: randomLane,

    y: -80,

    width: 40,
    height: 70,

    speed:
      baseEnemySpeed +
      levelSpeed +
      lifeSpeed +
      Math.random() * 1.2

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
// AUTO TEKENEN
// =========================

function drawCar(car, color) {

  // Schaduw

  ctx.fillStyle =
    "rgba(0,0,0,0.4)";

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

    roadOffset +=
      4 + levelSpeed + lifeSpeed;

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


  // =========================
  // SPELER BEWEGEN
  // =========================

  if (

    keys["arrowleft"] ||
    keys["a"] ||
    keys["mobileleft"]

  ) {

    player.x -= player.speed;

  }


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


  // =========================
  // VIJANDEN SPAWNEN
  // =========================

  spawnTimer++;


  // Langzaam beginnen met spawnen

  const spawnDelay =
    Math.max(
      35,
      70 - (level - 1) * 4
    );


  if (spawnTimer > spawnDelay) {

    spawnEnemy();

    spawnTimer = 0;

  }


  // =========================
  // VIJANDEN BEWEGEN
  // =========================

  for (
    let i = enemies.length - 1;
    i >= 0;
    i--
  ) {

    const enemy = enemies[i];


    enemy.y += enemy.speed;


    // =========================
    // BOTSING
    // =========================

    if (collision(player, enemy)) {

      // Vijand verwijderen

      enemies.splice(i, 1);


      // 1 leven verliezen

      lives--;


      // Elk verloren leven maakt
      // de auto's sneller

      lifeSpeed += 1.5;


      updateLives();


      // Auto van speler terugzetten

      player.x = 180;


      // Als alle levens op zijn

      if (lives <= 0) {

        gameOver = true;

        setTimeout(function() {

          alert(

            "💥 GAME OVER!\n\n" +
            "Score: " + score +
            "\nLevel: " + level

          );

          location.reload();

        }, 100);

      }

      continue;

    }


    // =========================
    // AUTO VOORBIJ
    // =========================

    if (enemy.y > canvas.height) {

      enemies.splice(i, 1);


      score++;


      scoreElement.textContent =
        "Score: " + score;


      updateLevel();

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


  // =========================
  // PAUZE SCHERM
  // =========================

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
// GAME OVER SCHERM
// =========================

function drawGameOver() {

  if (!gameOver) {
    return;
  }


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
    "bold 42px Arial";


  ctx.fillText(

    "GAME OVER",

    canvas.width / 2,
    270

  );


  ctx.font =
    "22px Arial";


  ctx.fillText(

    "Score: " + score,

    canvas.width / 2,
    315

  );


  ctx.fillText(

    "Level: " + level,

    canvas.width / 2,
    350

  );


  ctx.textAlign = "left";

}


// =========================
// GAME LOOP
// =========================

function gameLoop() {

  update();

  draw();

  drawGameOver();

  requestAnimationFrame(
    gameLoop
  );

}


// =========================
// START
// =========================

updateLives();

updateLevel();

gameLoop();
```
