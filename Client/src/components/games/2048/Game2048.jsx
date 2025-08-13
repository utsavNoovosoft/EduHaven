import React, { useState, useEffect } from 'react';
import styles from './Game2048.module.css';

const Game2048 = () => {
  const [board, setBoard] = useState(getInitialBoard());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  function getInitialBoard() {
    const board = Array(4).fill().map(() => Array(4).fill(0));
    addNewTile(board);
    addNewTile(board);
    return board;
  }

  function addNewTile(board) {
    const emptyTiles = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) {
          emptyTiles.push({ x: i, y: j });
        }
      }
    }
    if (emptyTiles.length > 0) {
      const { x, y } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      board[x][y] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  function moveBoard(direction) {
    if (gameOver) return;
    let newBoard = JSON.parse(JSON.stringify(board));
    let moved = false;
    let newScore = score;

    // Helper to move and merge a single row left
    function moveRowLeft(row) {
      let arr = row.filter(cell => cell !== 0);
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
          arr[i] *= 2;
          newScore += arr[i];
          arr[i + 1] = 0;
          moved = true;
        }
      }
      arr = arr.filter(cell => cell !== 0);
      while (arr.length < 4) arr.push(0);
      return arr;
    }

    // Correct direction mapping
    // left: 0, up: 3, right: 2, down: 1
    const directionMap = { left: 0, up: 3, right: 2, down: 1 };
    let times = directionMap[direction];
    let rotated = board;
    for (let t = 0; t < times; t++) {
      rotated = rotate(rotated);
    }
    let result = rotated.map(moveRowLeft);
    // Rotate back
    for (let t = 0; t < (4 - times) % 4; t++) {
      result = rotate(result);
    }
    let finalBoard = result;

    // Check if board changed
    if (JSON.stringify(finalBoard) !== JSON.stringify(board)) {
      moved = true;
    }

    if (moved) {
      addNewTile(finalBoard);
      setBoard(finalBoard);
      setScore(newScore);
      checkGameOver(finalBoard);
    }
  }

  // Rotate 90 degrees clockwise
  function rotate(board) {
    return board[0].map((_, i) => board.map(row => row[i]).reverse());
  }

  function rotateBoard(board, times = 1) {
    for (let t = 0; t < times; t++) {
      const N = board.length;
      for (let i = 0; i < N / 2; i++) {
        for (let j = i; j < N - i - 1; j++) {
          const temp = board[i][j];
          board[i][j] = board[N - 1 - j][i];
          board[N - 1 - j][i] = board[N - 1 - i][N - 1 - j];
          board[N - 1 - i][N - 1 - j] = board[j][N - 1 - i];
          board[j][N - 1 - i] = temp;
        }
      }
    }
  }

  function checkGameOver(board) {
    // Check if board is full
    let isFull = true;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) {
          isFull = false;
          break;
        }
      }
    }

    if (!isFull) return;

    // Check for possible merges
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          (i < 3 && board[i][j] === board[i + 1][j]) ||
          (j < 3 && board[i][j] === board[i][j + 1])
        ) {
          return;
        }
      }
    }

    setGameOver(true);
  }

function handleKeyDown(e) {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault(); // ✅ stops page scrolling
  }
  switch (e.key) {
    case 'ArrowUp':
      moveBoard('up');
      break;
    case 'ArrowDown':
      moveBoard('down');
      break;
    case 'ArrowLeft':
      moveBoard('left');
      break;
    case 'ArrowRight':
      moveBoard('right');
      break;
    default:
      break;
  }
}


  function resetGame() {
    setBoard(getInitialBoard());
    setScore(0);
    setGameOver(false);
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [board, gameOver]);

  return (
    <div className={styles.game2048}>
      <div className={styles.header}>
        <h1 style={{ color: '#edc22e', fontWeight: 'bold', fontSize: '2.5rem', letterSpacing: '2px', textShadow: '1px 1px 2px #bba14f' }}>2048</h1>
        <div className={styles.scoreContainer}>
          <div className={styles.score}>Score: {score}</div>
          <button onClick={resetGame} className={styles.resetButton}>
            New Game
          </button>
        </div>
      </div>
      <div className={styles.board}>
        {board.map((row, i) => (
          <div key={i} className={styles.row}>
            {row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`${styles.cell} ${cell ? styles['tile' + cell] : ''}`}
                style={{
                  boxShadow: cell ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                  border: cell ? '2px solid #edc22e' : '2px solid #eee4da',
                  color: cell >= 8 ? '#f9f6f2' : '#776e65',
                  fontWeight: cell >= 128 ? 'bold' : 'normal',
                  fontSize: cell >= 1024 ? '1.1rem' : '1.3rem',
                  background: cell ? undefined : '#faf8ef',
                  transition: 'all 0.2s',
                }}
              >
                {cell !== 0 && cell}
              </div>
            ))}
          </div>
        ))}
      </div>
     {gameOver && (
  <div className={styles.gameOver}>
    <div className={styles.gameOverContent}>
      <h2>Game Over!</h2>
      <p>Final Score: {score}</p>
      <button onClick={resetGame}>Try Again</button>
    </div>
  </div>
)}

    </div>
  );
};

export default Game2048;
