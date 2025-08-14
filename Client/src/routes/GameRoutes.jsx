import { Route, Routes } from "react-router-dom";
import GameRoom from "../components/gameRoomComponents/GameRoom";
import TicTacToe from "../components/games/tic-tac-toe/TicTacToe.jsx";
import Snake from "../components/games/SnakeGame.jsx";
import SpaceType from "../components/games/SpaceType";
import Whacamole from "@/components/games/whac-a-mole/Whacamole";
import Sudoku from "@/components/games/sudoku/Sudoku";



const GameRoutes = () => {
  return (
    <Routes>
      <Route index element={<GameRoom />} />
      <Route path="tic-tac-toe" element={<TicTacToe />} />
      <Route path="sudoku" element={<Sudoku />} />
      <Route path="snake" element={<Snake />} />
      <Route path="space-type" element={<SpaceType />} />
      <Route path="whac-a-mole" element={<Whacamole/>}/>
    </Routes>
  );
};

export default GameRoutes;
