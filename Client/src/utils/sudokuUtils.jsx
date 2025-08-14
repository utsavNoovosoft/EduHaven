export const copyBoard = (b) => b.map((r) => [...r]);

export const boardsEqual = (a, b) => {
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++)
      if ((a[r][c] || 0) !== (b[r][c] || 0)) return false;
  return true;
};

const emptyBoard = () => Array.from({ length: 9 }, () => Array(9).fill(0));

const shuffled = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const isSafe = (board, row, col, num) => {
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
    if (board[x][col] === num) return false;
  }
  const sr = row - (row % 3);
  const sc = col - (col % 3);
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++)
      if (board[sr + r][sc + c] === num) return false;
  return true;
};

const solve = (board) => {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (!board[r][c]) {
        for (const num of shuffled([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
          if (isSafe(board, r, c, num)) {
            board[r][c] = num;
            if (solve(board)) return true;
            board[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

const fillDiagonalBoxes = (board) => {
  for (let box = 0; box < 9; box += 3) {
    const nums = shuffled([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    let i = 0;
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 3; c++)
        board[box + r][box + c] = nums[i++];
  }
};

const cellsToRemoveFor = (difficulty) => {
  switch (difficulty) {
    case "easy": return 36;   // ~45 givens
    case "medium": return 45; // ~36 givens
    case "hard": return 54;   // ~27 givens
    default: return 45;
  }
};

const removeCells = (board, removeCount) => {
  const holes = new Set();
  while (holes.size < removeCount) {
    const r = Math.floor(Math.random() * 9);
    const c = Math.floor(Math.random() * 9);
    holes.add(r * 9 + c);
  }
  for (const key of holes) {
    const r = Math.floor(key / 9);
    const c = key % 9;
    board[r][c] = 0;
  }
};

export const generateGame = (difficulty = "easy") => {
  const solved = emptyBoard();
  fillDiagonalBoxes(solved);
  solve(solved);
  const puzzle = copyBoard(solved);
  removeCells(puzzle, cellsToRemoveFor(difficulty));

  // Generate fixed cells boolean grid
  const fixed = puzzle.map((row) =>
    row.map((cell) => cell !== 0)
  );

  return { puzzle, solution: solved, fixed };
};
