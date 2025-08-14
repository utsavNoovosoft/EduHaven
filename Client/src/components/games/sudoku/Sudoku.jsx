import React, { useEffect, useRef, useState } from "react";
import Board from "./components/Board";
import {
  generatePuzzle,
  DIFFICULTY_PRESETS,
  countEmptyCells,
  cloneBoard,
  boardsEqual,
} from "./sudokuUtils";
import "./Sudoku.css";

const formatTime = (s) => {
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
};

export default function Sudoku() {
  const [difficulty, setDifficulty] = useState("medium");
  const [puzzle, setPuzzle] = useState(() => generatePuzzle(difficulty));
  const [solution, setSolution] = useState(puzzle.solution);
  const [board, setBoard] = useState(puzzle.board);
  const [fixed, setFixed] = useState(puzzle.fixed);
  const [selected, setSelected] = useState({ r: 0, c: 0 });
  const [hintsLeft, setHintsLeft] = useState(
    DIFFICULTY_PRESETS[difficulty].hints
  );
  const [seconds, setSeconds] = useState(0);
  const [status, setStatus] = useState("");
  const timerRef = useRef(null);

  const emptyCount = countEmptyCells(board);

  // Start/reset timer on puzzle change
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSeconds(0);
    timerRef.current = setInterval(
      () => setSeconds((s) => s + 1),
      1000
    );
    return () => timerRef.current && clearInterval(timerRef.current);
  }, [puzzle]);

  // Keyboard input handling
  useEffect(() => {
    const onKey = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const { r, c } = selected;

      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
      ) {
        e.preventDefault();
        const dr = e.key === "ArrowUp" ? -1 : e.key === "ArrowDown" ? 1 : 0;
        const dc = e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0;
        setSelected({ r: (r + dr + 9) % 9, c: (c + dc + 9) % 9 });
        return;
      }
      if (fixed[r][c]) return;
      if (/^[1-9]$/.test(e.key)) {
        const val = Number(e.key);
        setBoard((prev) => {
          const next = cloneBoard(prev);
          next[r][c] = val;
          return next;
        });
        setStatus("");
      }
      if (["Backspace", "Delete", "0"].includes(e.key)) {
        setBoard((prev) => {
          const next = cloneBoard(prev);
          next[r][c] = 0;
          return next;
        });
        setStatus("");
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, fixed]);

  const handleNewPuzzle = (lvl) => {
    const newPuzzle = generatePuzzle(lvl);
    setDifficulty(lvl);
    setPuzzle(newPuzzle);
    setSolution(newPuzzle.solution);
    setBoard(newPuzzle.board);
    setFixed(newPuzzle.fixed);
    setHintsLeft(DIFFICULTY_PRESETS[lvl].hints);
    setStatus("");
  };

  const handleHint = () => {
    if (hintsLeft <= 0) return;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0) {
          setBoard((prev) => {
            const next = cloneBoard(prev);
            next[r][c] = solution[r][c];
            return next;
          });
          setHintsLeft((h) => h - 1);
          setStatus("");
          setTimeout(() => {
            if (boardsEqual(board, solution)) {
              setStatus("complete");
              if (timerRef.current) clearInterval(timerRef.current);
            }
          }, 0);
          return;
        }
      }
    }
  };

  const handleValidate = () => {
    const conflicts = validateConflicts(board, solution);
    if (conflicts) {
      setStatus("conflict");
    } else {
      if (boardsEqual(board, solution)) {
        setStatus("complete");
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        setStatus("correct");
      }
    }
  };

  const handleCheckSolution = () => {
    setBoard(cloneBoard(solution));
    setStatus("complete");
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const validateConflicts = (board, solution) => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] !== 0 && board[r][c] !== solution[r][c]) {
          return true;
        }
      }
    }
    return false;
  };

  const levelOptions = Object.keys(DIFFICULTY_PRESETS);

  return (
    <div className="flex w-full justify-center px-4 py-8">
      <div className="w-full max-w-4xl rounded-2xl border border-slate-700 bg-slate-900/60 p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-wide text-emerald-300">
            🧩 Sudoku Game
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-slate-300">
              ⏱ {formatTime(seconds)}
            </span>
            <span className="text-slate-400">• Empty: {emptyCount}</span>
            <span className="text-slate-400">• Hints: {hintsLeft}</span>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-3">
          <label className="text-slate-300">Select Difficulty:</label>
          <select
            value={difficulty}
            onChange={(e) => handleNewPuzzle(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100"
          >
            {levelOptions.map((lvl) => (
              <option value={lvl} key={lvl}>
                {DIFFICULTY_PRESETS[lvl].label}
              </option>
            ))}
          </select>
        </div>

        <Board
          board={board}
          fixed={fixed}
          selected={selected}
          onSelect={setSelected}
        />

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-slate-100 hover:bg-slate-700"
            onClick={() => handleNewPuzzle(difficulty)}
          >
            New Puzzle
          </button>
          <button
            className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
            onClick={handleHint}
            disabled={hintsLeft <= 0}
          >
            Hint
          </button>
          <button
            className="rounded-xl bg-amber-600 px-4 py-2 text-white hover:bg-amber-500"
            onClick={handleValidate}
          >
            Validate
          </button>
          <button
            className="rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-500"
            onClick={handleCheckSolution}
          >
            Check Solution
          </button>
          {status === "complete" && (
            <span className="ml-2 rounded-lg bg-emerald-700/40 px-3 py-1 text-emerald-300">
              Solved! 🎉
            </span>
          )}
          {status === "conflict" && (
            <span className="ml-2 rounded-lg bg-rose-700/30 px-3 py-1 text-rose-300">
              Conflicts found
            </span>
          )}
          {status === "correct" && (
            <span className="ml-2 rounded-lg bg-indigo-700/30 px-3 py-1 text-indigo-200">
              Looks good so far
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
