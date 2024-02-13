"use client";

import { Point, Direction } from "@/app/types/customTypes";
import { KeyboardEvent, useEffect, useState } from "react";

const GRID_SIZE = 20;
const SPEED = 100;


const randomNumberForFoodCoordinates = () => {
  return Math.floor(Math.random() * GRID_SIZE);
};

export default function SnakeGrid() {
  const [snake, setSnake] = useState<Point[]>([
    { y: 0, x: 2 },
    { y: 0, x: 1 },
    { y: 0, x: 0 },
  ]);
  const [food, setFood] = useState<Point>({ x: 16, y: 14 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [gameOver, setGameOver] = useState<boolean>(false);

  const generateFood = () => {
    const x = randomNumberForFoodCoordinates();
    const y = randomNumberForFoodCoordinates();
    setFood({ x, y });
  };

  const moveSnake = (snakeHead: Point) => {
    switch (direction) {
      case "UP":
        snakeHead.y -= 1;
        break;
      case "DOWN":
        snakeHead.y += 1;
        break;
      case "LEFT":
        snakeHead.x -= 1;
        break;
      case "RIGHT":
        snakeHead.x += 1;
        break;
    }
    return snakeHead;
  }

  const gameHandler = () => {
    const newSnake = [...snake];
    let snakeHead = { ...newSnake[0] };

    snakeHead = moveSnake(snakeHead);
    if (
      snakeHead.x < 0 ||
      snakeHead.x >= GRID_SIZE ||
      snakeHead.y < 0 ||
      snakeHead.y >= GRID_SIZE ||
      newSnake.some(
        (snakePart) =>
          snakePart.x === snakeHead.x && snakePart.y === snakeHead.y
      )
    ) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(snakeHead);
    if (snakeHead.x === food.x && snakeHead.y === food.y) {
      generateFood();
    } else {
      newSnake.pop();
    }
    setSnake(newSnake);
  };

  useEffect(() => {
    const interval = setInterval(gameHandler, SPEED);
    return () => clearInterval(interval);
  }, [snake, direction]);

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowUp" && direction !== "DOWN") {
      setDirection("UP");
    }
    if (event.key === "ArrowDown" && direction !== "UP") {
      setDirection("DOWN");
    }
    if (event.key === "ArrowRight" && direction !== "LEFT") {
      setDirection("RIGHT");
    }
    if (event.key === "ArrowLeft" && direction !== "RIGHT") {
      setDirection("LEFT");
    }
  };

  const handleGameOver = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      window.location.reload();
    }
  };

  return (
    <div
      onKeyDown={gameOver ? handleGameOver : handleKeyPress}
      tabIndex={0}
      autoFocus
      className="grid grid-cols-20 grid-rows-20 border-2 border-black focus:outline-none"
    >
      {gameOver && (
        <div className="absolute inset-0 flex flex-col justify-center items-center text-red-700">
          <h1 className="text-4xl font-bold">Game Over !</h1>
          <p className="text-xl">
            Score : <span className="font-bold">{snake.length - 3}</span>
          </p>
          <p>Press Enter to restart the game</p>
        </div>
      )}
      {Array.from({ length: GRID_SIZE }).map((_, y) => (
        <div className="flex" key={y}>
          {Array.from({ length: GRID_SIZE }).map((_, x) => (
            <div
              key={x}
              className={`w-5 h-5 border border-gray-100
              ${
                snake.some(
                  (snakePart) => snakePart.x === x && snakePart.y === y
                ) && "bg-green-400"
              }
              ${food.x === x && food.y === y && "bg-blue-600"}
              `}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}
