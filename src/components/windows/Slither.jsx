import React, { useState, useEffect, useRef } from "react";

export default function Slither() {
  const canvasRef = useRef(null);
  const timerRef = useRef(null);

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const gameState = useRef({
    snake: [
      { x: 150, y: 150 },
      { x: 140, y: 150 },
      { x: 130, y: 150 },
      { x: 120, y: 150 },
      { x: 110, y: 150 },
    ],
    score: 0,
    changingDirection: false,
    foodX: 0,
    foodY: 0,
    dx: 10,
    dy: 0,
    isOver: false,
  });

  const randomTen = (min, max) => {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
  };

  const createFood = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let fx = randomTen(0, canvas.width - 10);
    let fy = randomTen(0, canvas.height - 10);

    const onSnake = gameState.current.snake.some(
      (part) => part.x === fx && part.y === fy
    );

    if (onSnake) {
      createFood();
    } else {
      gameState.current.foodX = fx;
      gameState.current.foodY = fy;
    }
  };

  const clearCanvas = (ctx) => {
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.fillRect(0, 0, 300, 300);
    ctx.strokeRect(0, 0, 300, 300);
  };

  const drawFood = (ctx) => {
    ctx.fillStyle = "#ECA72C";
    ctx.strokeStyle = "#EE5622";
    ctx.fillRect(gameState.current.foodX, gameState.current.foodY, 10, 10);
    ctx.strokeRect(gameState.current.foodX, gameState.current.foodY, 10, 10);
  };

  const drawSnakePart = (ctx, part) => {
    ctx.fillStyle = "white";
    ctx.strokeStyle = "darkred";
    ctx.fillRect(part.x, part.y, 10, 10);
    ctx.strokeRect(part.x, part.y, 10, 10);
  };

  const drawSnake = (ctx) => {
    gameState.current.snake.forEach((part) => drawSnakePart(ctx, part));
  };

  const advanceSnake = () => {
    const head = {
      x: gameState.current.snake[0].x + gameState.current.dx,
      y: gameState.current.snake[0].y + gameState.current.dy,
    };
    gameState.current.snake.unshift(head);

    const didEatFood =
      gameState.current.snake[0].x === gameState.current.foodX &&
      gameState.current.snake[0].y === gameState.current.foodY;

    if (didEatFood) {
      gameState.current.score += 10;
      setScore(gameState.current.score);
      createFood();
    } else {
      gameState.current.snake.pop();
    }
  };

  const didGameEnd = () => {
    const s = gameState.current.snake;
    for (let i = 4; i < s.length; i++) {
      if (s[i].x === s[0].x && s[i].y === s[0].y) return true;
    }

    const hitLeft = s[0].x < 0;
    const hitRight = s[0].x > 290;
    const hitTop = s[0].y < 0;
    const hitBottom = s[0].y > 290;

    return hitLeft || hitRight || hitTop || hitBottom;
  };

  const runTick = () => {
    if (gameState.current.isOver) return;

    if (didGameEnd()) {
      gameState.current.isOver = true;
      setGameOver(true);
      return;
    }

    timerRef.current = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");

      gameState.current.changingDirection = false;
      clearCanvas(ctx);
      drawFood(ctx);
      advanceSnake();
      drawSnake(ctx);

      runTick();
    }, 100);
  };

  const startGame = () => {
    setHasStarted(true);
    runTick();
  };

  const restartGame = () => {
    clearTimeout(timerRef.current);
    gameState.current = {
      snake: [
        { x: 150, y: 150 },
        { x: 140, y: 150 },
        { x: 130, y: 150 },
        { x: 120, y: 150 },
        { x: 110, y: 150 },
      ],
      score: 0,
      changingDirection: false,
      foodX: 0,
      foodY: 0,
      dx: 10,
      dy: 0,
      isOver: false,
    };
    setScore(0);
    setGameOver(false);

    createFood();
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      clearCanvas(ctx);
      drawFood(ctx);
      drawSnake(ctx);
    }
    runTick();
  };

  useEffect(() => {
    createFood();
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      clearCanvas(ctx);
      drawFood(ctx);
      drawSnake(ctx);
    }

    const handleKeyDown = (event) => {
      if (gameState.current.changingDirection) return;

      const goingUp = gameState.current.dy === -10;
      const goingDown = gameState.current.dy === 10;
      const goingRight = gameState.current.dx === 10;
      const goingLeft = gameState.current.dx === -10;

      const code = event.code;
      const key = event.key.toLowerCase();

      if (
        code === "ArrowLeft" ||
        code === "ArrowRight" ||
        code === "ArrowUp" ||
        code === "ArrowDown"
      ) {
        event.preventDefault();
      }

      if ((code === "ArrowLeft" || key === "a") && !goingRight) {
        gameState.current.changingDirection = true;
        gameState.current.dx = -10;
        gameState.current.dy = 0;
      }
      if ((code === "ArrowUp" || key === "w") && !goingDown) {
        gameState.current.changingDirection = true;
        gameState.current.dx = 0;
        gameState.current.dy = -10;
      }
      if ((code === "ArrowRight" || key === "d") && !goingLeft) {
        gameState.current.changingDirection = true;
        gameState.current.dx = 10;
        gameState.current.dy = 0;
      }
      if ((code === "ArrowDown" || key === "s") && !goingUp) {
        gameState.current.changingDirection = true;
        gameState.current.dx = 0;
        gameState.current.dy = 10;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timerRef.current);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-between p-3 select-none h-full"
      style={{
        backgroundColor: "#c0c0c0",
        fontFamily: "'Courier New', monospace",
        boxSizing: "border-box",
      }}
    >
      <div
        className="w-full flex justify-between items-center px-2 py-1 mb-2"
        style={{
          backgroundColor: "#ffffff",
          borderTop: "2px solid #808080",
          borderLeft: "2px solid #808080",
          borderRight: "2px solid #ffffff",
          borderBottom: "2px solid #ffffff",
          fontSize: "12px",
          fontWeight: "bold",
        }}
      >
        <span>SCORE: {score}</span>
        <span>KEYS: ARROWS / WASD</span>
      </div>

      <div
        className="relative"
        style={{
          width: "300px",
          height: "300px",
          borderTop: "2px solid #808080",
          borderLeft: "2px solid #808080",
          borderRight: "2px solid #ffffff",
          borderBottom: "2px solid #ffffff",
        }}
      >
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          style={{ display: "block" }}
        />

        {/* Start Game Screen */}
        {!hasStarted && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4"
            style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
          >
            <span
              style={{
                color: "#ffffff",
                fontWeight: "900",
                fontSize: "26px",
                letterSpacing: "4px",
                textTransform: "lowercase",
              }}
            >
              slither
            </span>
            <button
              onClick={startGame}
              style={{
                backgroundColor: "#c0c0c0",
                color: "#000000",
                borderTop: "2px solid #ffffff",
                borderLeft: "2px solid #ffffff",
                borderRight: "2px solid #000000",
                borderBottom: "2px solid #000000",
                padding: "4px 16px",
                fontWeight: "bold",
                fontSize: "12px",
                cursor: "pointer",
                fontFamily: "'Courier New', monospace",
              }}
            >
              Play ↵
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameOver && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
          >
            <span
              style={{ color: "#ff4444", fontWeight: "bold", fontSize: "16px" }}
            >
              GAME OVER
            </span>
            <button
              onClick={restartGame}
              style={{
                backgroundColor: "#c0c0c0",
                color: "#000000",
                borderTop: "2px solid #ffffff",
                borderLeft: "2px solid #ffffff",
                borderRight: "2px solid #000000",
                borderBottom: "2px solid #000000",
                padding: "4px 14px",
                fontWeight: "bold",
                fontSize: "12px",
                cursor: "pointer",
                fontFamily: "'Courier New', monospace",
              }}
            >
              Restart ↵
            </button>
          </div>
        )}
      </div>

      <div className="w-full text-center text-[11px] text-neutral-600 mt-2">
        Crafted with HTML5 Canvas and vanilla JavaScript logic. Enjoy!
      </div>
    </div>
  );
}