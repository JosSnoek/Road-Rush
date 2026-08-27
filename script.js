* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

body {
  margin: 0;
  background: #111;
  color: white;
  font-family: Arial, sans-serif;
  text-align: center;
  overflow: hidden;
  touch-action: none;
}

#game {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

#topbar {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
  position: relative;
  z-index: 2;
}

#score {
  font-size: 25px;
  font-weight: bold;
}

#lives {
  font-size: 24px;
  white-space: nowrap;
}

#pauseButton {
  width: 50px;
  height: 45px;
  font-size: 24px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  background: white;
  padding: 0;
}

#pauseButton:active {
  transform: scale(0.92);
}

canvas {
  display: block;
  width: 100%;
  height: auto;
  background: green;
  border: 3px solid white;
  border-radius: 5px;
}

#controls {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 15px 20px;
}

#controls button {
  width: 150px;
  height: 70px;
  font-size: 38px;
  border: none;
  border-radius: 15px;
  background: white;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

#controls button:active {
  transform: scale(0.92);
  background: #ccc;
}

/* TELEFOON */
@media (max-width: 420px) {

  #topbar {
    height: 55px;
    padding: 5px 12px;
    transform: translateY(15px);
  }

  #score {
    font-size: 21px;
  }

  #lives {
    font-size: 20px;
  }

  #pauseButton {
    width: 48px;
    height: 43px;
    font-size: 22px;
  }

  #controls {
    padding: 10px;
    gap: 10px;
    transform: translateY(-25px);
  }

  #controls button {
    width: 45%;
    height: 65px;
    font-size: 38px;
  }
}
