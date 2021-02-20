import React, { useCallback, useEffect, useState } from "react";
import Snake from "./Component/Snake/Snake";
import Food from "./Component/Food/Food";

import "./App.css";

const getRandomCoordinates = () => {
  let min = 1;
  let max = 98;
  let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  return [x, y];
};

const App = () => {
  const [food, setFood] = useState(getRandomCoordinates);
  const [speed, setSpeed] = useState(200);
  const [direction, setDirection] = useState("RIGHT");
  const [snakeDots, setSnakeDots] = useState([
    [0, 0],
    [2, 0],
  ]);
  const [pause, setPause] = useState(true);

  useEffect(() => {
    if (pause) return;
    checkIfOutOfBorders();
    checkIfCollapsed();
    setTimeout(() => moveSnake(snakeDots, checkIfEat()), speed);
  }, [snakeDots, pause]);

  useEffect(() => {
    // document.onkeydown = onKeyDown;
    const onKeyDown = (e) => {
      e = e || window.event;
      switch (e.keyCode) {
        case 38:
          console.log("direction", direction);
          !["DOWN", "UP"].includes(direction) && setDirection("UP");
          break;
        case 40:
          !["DOWN", "UP"].includes(direction) && setDirection("DOWN");
          break;
        case 37:
          !["LEFT", "RIGHT"].includes(direction) && setDirection("LEFT");
          break;
        case 39:
          !["LEFT", "RIGHT"].includes(direction) && setDirection("RIGHT");
          break;

        default:
          break;
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      console.log("direction return", direction); // useEffect precedente
    };
  }, [direction, setDirection]);

  // const onKeyDown = useCallback(
  //   (e) => {
  //     e = e || window.event;
  //     switch (e.keyCode) {
  //       case 38:
  //         console.log('direction', direction)
  //       !["DOWN", "UP"].includes(direction) && setDirection("UP");
  //         break;
  //       case 40:
  //         setDirection("DOWN");
  //         break;
  //       case 37:
  //         setDirection("LEFT");
  //         break;
  //       case 39:
  //         setDirection("RIGHT");
  //         break;

  //       default:
  //         break;
  //     }
  //   },
  //   [setDirection, direction]
  // );
  const moveSnake = useCallback(
    (snakeDots, eaten) => {
      let dots = [...snakeDots];
      let head = dots[dots.length - 1];
      // [0, 0],
      // [2, 0], head

      switch (direction) {
        case "RIGHT":
          head = [head[0] + 2, head[1]];
          break;
        case "LEFT":
          head = [head[0] - 2, head[1]];
          break;
        case "DOWN":
          head = [head[0], head[1] + 2];
          break;
        case "UP":
          head = [head[0], head[1] - 2];
          break;

        default:
          break;
      }
      if (direction) {
        dots.push(head);

        eaten ? setFood(getRandomCoordinates()) : dots.shift();

        setSnakeDots([...dots]);
      }
    },
    [direction]
  );

  const checkIfOutOfBorders = () => {
    let head = snakeDots[snakeDots.length - 1];
    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
      onGameOver();
    }
  };

  const checkIfCollapsed = () => {
    let snake = [...snakeDots];
    let head = snake[snake.length - 1];
    snake.pop();
    snake.forEach((dot) => {
      if (head[0] === dot[0] && head[1] === dot[1]) {
        onGameOver();
      }
    });
  };

  const checkIfEat = () => {
    let head = snakeDots[snakeDots.length - 1];

    return head[0] === food[0] && head[1] === food[1];
  };

  const onGameOver = () => {
    setSnakeDots([
      [0, 0],
      [2, 0],
    ]);
    setDirection(null);
    // setFood(getRandomCoordinates());
  };
  return (
    <>
      <div className="game-area">
        <Snake snakeDots={snakeDots} />
        <Food dot={food} />
      </div>
      <div className="btn">
        <button onClick={() => setPause((p) => !p)}>
          {pause ? "Play" : "Pause"}
        </button>
      </div>
    </>
  );
};

export default App;
