const gameContainer = document.getElementById("game-container");
const snake = document.querySelector(".snake");
const snakeHead = document.querySelector(".snake-head");
const food = document.querySelector(".food");
const scoreElement = document.getElementById("score");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const moveUpButton = document.getElementById("move-up-button");
const moveDownButton = document.getElementById("move-down-button");
const moveLeftButton = document.getElementById("move-left-button");
const moveRightButton = document.getElementById("move-right-button");

let snakeLeft = 0;
let snakeTop = 0;
let foodLeft = Math.floor(Math.random() * 20) * 20;
let foodTop = Math.floor(Math.random() * 20) * 20;
let snakeBody = [{ left: 0, top: 0 }];
let direction = "right";
let score = 0;
let gameInterval;

//Adicione eventos de clique para os botões de seta
moveUpButton.addEventListener("click", () => {
  direction = "up";
});

moveDownButton.addEventListener("click", () => {
  direction = "down";
});

moveLeftButton.addEventListener("click", () => {
  direction = "left";
});

moveRightButton.addEventListener("click", () => {
  direction = "right";
});

function updateScore() {
  scoreElement.textContent = score;
}

function updateSnakePosition() {
  snake.style.left = snakeLeft + "px";
  snake.style.top = snakeTop + "px";
}

function updateFoodPosition() {
  food.style.left = foodLeft + "px";
  food.style.top = foodTop + "px";
}

function updateSnakeBody() {
  snakeBody.push({ left: snakeLeft, top: snakeTop });
}

document.addEventListener("keydown", (event) => {
  if (
    (event.key === "ArrowLeft" || event.key === "a") &&
    direction !== "right" // Evitar voltar à direita
  ) {
    if (snakeBody.length === 1 || direction !== "left") {
      direction = "left";
    }
  } else if (
    (event.key === "ArrowRight" || event.key === "d") &&
    direction !== "left" // Evitar voltar à esquerda
  ) {
    if (snakeBody.length === 1 || direction !== "right") {
      direction = "right";
    }
  } else if (
    (event.key === "ArrowUp" || event.key === "w") &&
    direction !== "down" // Evitar voltar para baixo
  ) {
    if (snakeBody.length === 1 || direction !== "up") {
      direction = "up";
    }
  } else if (
    (event.key === "ArrowDown" || event.key === "s") &&
    direction !== "up" // Evitar voltar para cima
  ) {
    if (snakeBody.length === 1 || direction !== "down") {
      direction = "down";
    }
  }
});

function moveSnake() {
  if (direction === "left") {
    snakeLeft -= 20;
  } else if (direction === "right") {
    snakeLeft += 20;
  } else if (direction === "up") {
    snakeTop -= 20;
  } else if (direction === "down") {
    snakeTop += 20;
  }
}

function moveSnakeBody() {
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = { ...snakeBody[i - 1] };
  }
  snakeBody[0] = { left: snakeLeft, top: snakeTop };
}

function renderSnakeBody() {
  document.querySelectorAll(".snake-body").forEach((bodyElement) => {
    bodyElement.remove();
  });

  snakeBody.forEach((part) => {
    const bodyElement = document.createElement("div");
    bodyElement.classList.add("snake-body");
    bodyElement.style.left = part.left + "px";
    bodyElement.style.top = part.top + "px";
    gameContainer.appendChild(bodyElement);
  });
}

function checkCollision() {
  if (snakeLeft < 0 || snakeTop < 0 || snakeLeft >= 400 || snakeTop >= 400) {
    clearInterval(gameInterval);
    alert("Game Over! Your Score: " + score + "\nleozou");
    restartButton.style.display = "block";
  }
}

function checkSelfCollision() {
  for (let i = 1; i < snakeBody.length; i++) {
    if (snakeBody[i].left === snakeLeft && snakeBody[i].top === snakeTop) {
      clearInterval(gameInterval);
      alert("Game Over! Your Score: " + score + "\nleozou");
      restartButton.style.display = "block";
    }
  }
}

function generateRandomFoodPosition() {
  let newFoodLeft, newFoodTop;

  do {
    newFoodLeft = Math.floor(Math.random() * 20) * 20;
    newFoodTop = Math.floor(Math.random() * 20) * 20;
  } while (
    snakeBody.some(
      (part) => part.left === newFoodLeft && part.top === newFoodTop
    )
  );

  return { left: newFoodLeft, top: newFoodTop };
}

function updateFoodPosition() {
  const newFoodPosition = generateRandomFoodPosition();
  foodLeft = newFoodPosition.left;
  foodTop = newFoodPosition.top;

  food.style.left = foodLeft + "px";
  food.style.top = foodTop + "px";
}

function updateGame() {
  moveSnake();
  moveSnakeBody();
  renderSnakeBody();

  // Verifique a colisão com a cobra
  checkSelfCollision();

  // Verifique se a cobra comeu a comida
  if (snakeLeft === foodLeft && snakeTop === foodTop) {
    foodLeft = Math.floor(Math.random() * 20) * 20;
    foodTop = Math.floor(Math.random() * 20) * 20;
    updateFoodPosition();
    updateSnakeBody();
    score += 10;
    updateScore();
  }

  // Lógica para permitir atravessar as paredes
  if (snakeLeft < 0) {
    snakeLeft = 380; // Aparecer no lado direito
  } else if (snakeLeft >= 400) {
    snakeLeft = 0; // Aparecer no lado esquerdo
  }

  if (snakeTop < 0) {
    snakeTop = 380; // Aparecer na parte inferior
  } else if (snakeTop >= 400) {
    snakeTop = 0; // Aparecer na parte superior
  }

  // Atualize a cor da cabeça da cobra
  const newSnakeHead = document.querySelector(
    `[style="left: ${snakeLeft}px; top: ${snakeTop}px;"]`
  );
  if (newSnakeHead) {
    newSnakeHead.style.backgroundColor = "blue"; // ou a cor desejada
  }

  // Atualize a posição da cobra
  updateSnakePosition();
}

startButton.addEventListener("click", () => {
  startButton.style.display = "none";
  gameInterval = setInterval(updateGame, 100);
  updateFoodPosition();
});

restartButton.addEventListener("click", () => {
  restartButton.style.display = "none";
  snakeLeft = 0;
  snakeTop = 0;
  foodLeft = Math.floor(Math.random() * 20) * 20;
  foodTop = Math.floor(Math.random() * 20) * 20;
  snakeBody = [{ left: 0, top: 0 }];
  direction = "right";
  score = 0;
  updateScore();
  updateSnakePosition();
  updateFoodPosition();
  gameInterval = setInterval(updateGame, 100);
});

updateFoodPosition();
