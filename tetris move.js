const canvasElement = document.createElement('canvas');

with (canvasElement.style) {
  width = '100%';
  height = '100%';
  border = '3px solid #ccc';
}
document.body.appendChild(canvasElement);

canvasElement.width = canvasElement.clientWidth;
canvasElement.height = canvasElement.clientHeight;

const canvasContext = canvasElement.getContext('2d');

function drawPixel(x, y) {
  canvasContext.fillStyle = '#000';
  canvasContext.fillRect(x * 20, y * 20, 20, 20);
}

const widthOfPixels = 20,
  heightOfPixels = 40;

function clearScreen() {
  canvasContext.fillStyle = '#fff';
  canvasContext.fillRect(0, 0, widthOfPixels * 20, heightOfPixels * 20);
}

function createTetris() {
  let tetris = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ],
  checkedPixels = [[3, 3]];

  for (let i = 0; i < 3; ++i) {
    let selectedPoint =
      checkedPixels[Math.round(Math.random() * (checkedPixels.length - 1))];
    for (;;) {
      let vector = Math.round(Math.random() * 3);
      switch (vector) {
        case 0: // top
          if (tetris[selectedPoint[1] - 1][selectedPoint[0]]) continue;
          tetris[selectedPoint[1] - 1][selectedPoint[0]] = 1;
          checkedPixels.push([selectedPoint[0], selectedPoint[1] - 1]);
          break;

        case 1: //right
          if (tetris[selectedPoint[1]][selectedPoint[0] + 1]) continue;
          tetris[selectedPoint[1]][selectedPoint[0] + 1] = 1;
          checkedPixels.push([selectedPoint[0] + 1, selectedPoint[1]]);
          break;

        case 2: //bottom
          if (tetris[selectedPoint[1] + 1][selectedPoint[0]]) continue;
          tetris[selectedPoint[1] + 1][selectedPoint[0]] = 1;
          checkedPixels.push([selectedPoint[0], selectedPoint[1] + 1]);
          break;

        case 3: //left
          if (tetris[selectedPoint[1]][selectedPoint[0] - 1]) continue;
          tetris[selectedPoint[1]][selectedPoint[0] - 1] = 1;
          checkedPixels.push([selectedPoint[0] - 1, selectedPoint[1]]);
          break;
      }

      break;
    }
  }

  return tetris;
}

function maxY(tetris) {
  for (let i = 6; i >= 0; --i) {
    for (let j = 0; j < 7; j++) {
      if (tetris[i][j]) return i;
    }
  }
}

function minX(tetris) {
  for (let i = 0; i < 7; ++i) {
    for (let j = 0; j < 7; ++j) {
      if (tetris[j][i]) return i;
    }
  }
}

function maxX(tetris) {
  for (let i = 6; i >= 0; --i) {
    for (let j = 0; j < 7; ++j) {
      if (tetris[j][i]) return i;
    }
  }
}

function drawTetris(tetris, x, y) {
  clearScreen();

  let xStart = minX(tetris),
    xEnd = maxX(tetris),
    yEnd = maxY(tetris);

  for (let i = yEnd; i >= 0; --i) {
    for (let j = xStart; j <= xEnd; ++j) {
      if (tetris[i][j]) drawPixel(j - xStart + x, y - i);
    }
  }
}

function rotateTetris(tetris) {
  let newTetris = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ];

  for (let i = 0; i < tetris.length; i++) {
    for (let j = 0; j < tetris.length; j++) {
      newTetris[i][j] = tetris[tetris.length - j - 1][i];
    }
  }
  return newTetris;
}

let tetrisArray = [];

let x = 6,
  y = 5;
let tetris = createTetris();
window.onkeydown = (event) => {
  switch (event.key) {
    case 'ArrowLeft':
      if (x) --x;
      drawTetris(tetris, x, y);
      break;

    case 'ArrowRight':
      if (x + maxX(tetris) - minX(tetris) < widthOfPixels - 1) ++x;
      drawTetris(tetris, x, y);
      break;

    case 'ArrowDown':
      ++y;
      if (y <= Math.round(canvasElement.height / 20)) {
        drawTetris(tetris, x, y);
      };
      break;

    case ' ':
     tetris = rotateTetris(tetris);
     drawTetris(tetris, x, y);
     break;
  }
};

let interval = setInterval(() => {
  ++y;
  drawTetris(tetris, x, y)
}, 1000);
