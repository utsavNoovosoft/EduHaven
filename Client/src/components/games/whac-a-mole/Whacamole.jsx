// Whacamole.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import useSound from "use-sound";
import bonkSfx from "./assets/Miss.wav";
import missSfx from "./assets/Bonk.wav";

const NUM_HOLES = 9;
const GAME_DURATION = 30; // sec
const MIN_MOLE_UP = 600; // ms
const MAX_MOLE_UP = 1200; // ms

const Whacamole = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [activeMole, setActiveMole] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  // sound hooks 
  const [playBonk] = useSound(bonkSfx, { volume: 0.5, interrupt: true, html5: true });
  const [playMiss] = useSound(missSfx, { volume: 0.5, interrupt: true, html5: true });

  const countdownRef = useRef(null);
  const moleTimeoutRef = useRef(null);
  const nextMoleTimeoutRef = useRef(null);

  const endGame = useCallback(() => {
    setGameOver(true);
    clearInterval(countdownRef.current);
    clearTimeout(moleTimeoutRef.current);
    clearTimeout(nextMoleTimeoutRef.current);
    setActiveMole(null);
  }, []);

  // Countdown clock
  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          endGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(countdownRef.current);
  }, [endGame]);

  // Mole spawn logic using recursive timeout
  const spawnMole = useCallback(() => {
    const hole = Math.floor(Math.random() * NUM_HOLES);
    setActiveMole(hole);

    // hide mole after random up time
    const upTime = Math.random() * (MAX_MOLE_UP - MIN_MOLE_UP) + MIN_MOLE_UP;
    moleTimeoutRef.current = setTimeout(() => {
      setActiveMole(null);
      // schedule next mole
      const wait = Math.random() * 800 + 300;
      nextMoleTimeoutRef.current = setTimeout(spawnMole, wait);
    }, upTime);
  }, []);

  // start spawning on mount
  useEffect(() => {
    spawnMole();
    return () => {
      clearTimeout(moleTimeoutRef.current);
      clearTimeout(nextMoleTimeoutRef.current);
    };
  }, [spawnMole]);

  const handleClick = (index) => {
    if (gameOver) return;
    if (index === activeMole) {
      playBonk();
      setScore((s) => s + 1);
      setActiveMole(null);
      clearTimeout(moleTimeoutRef.current);
      // immediately spawn next
      nextMoleTimeoutRef.current = setTimeout(spawnMole, 200);
    } else {
      playMiss();
      setScore((s) => Math.max(s - 1, 0));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black flex flex-col items-center justify-center p-4 text-white">
      <h1 className="text-4xl mb-4 font-bold">Whac-A-Mole</h1>
      <div className="flex gap-10 text-lg mb-6">
        <div>Score: {score}</div>
        <div>Time Left: {timeLeft}s</div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {Array.from({ length: NUM_HOLES }).map((_, i) => (
          <div
            key={i}
            className="w-24 h-24 bg-purple-800 rounded-full flex items-center justify-center cursor-pointer relative hover:ring-2 hover:ring-purple-400"
            onClick={() => handleClick(i)}
          >
            <AnimatePresence>
              {activeMole === i && (
                <motion.div
                  key={"mole" + i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.15 }}
                  className="w-16 h-16 bg-purple-400 rounded-full shadow-md"
                />
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl font-bold text-purple-300 mb-4">Game Over</h2>
          <p className="mb-4">Final Score: {score}</p>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg"
            >
              <RefreshCw size={20} /> Play Again
            </button>
            <Link
              to="/games"
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg"
            >
              <ArrowLeft size={20} /> Exit
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Whacamole;
