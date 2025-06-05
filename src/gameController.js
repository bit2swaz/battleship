import { createPlayer, createComputerPlayer } from './player.js';
import { createGameboard } from './gameboard.js';
import { createShip } from './ship.js';

export const createGameController = () => {
  const player = createPlayer('Human');
  const computer = createComputerPlayer();
  const playerBoard = createGameboard();
  const computerBoard = createGameboard();
  let currentPlayer = player;
  let gameOver = false;

  const standardShips = [
    { length: 5, name: 'Carrier' },
    { length: 4, name: 'Battleship' },
    { length: 3, name: 'Cruiser' },
    { length: 3, name: 'Submarine' },
    { length: 2, name: 'Destroyer' }
  ];

  const placeComputerShips = () => {
    standardShips.forEach(shipInfo => {
      const ship = createShip(shipInfo.length);
      let placed = false;
      
      while (!placed) {
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);
        const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        placed = computerBoard.placeShip(ship, x, y, orientation);
      }
    });
  };

  return {
    placePlayerShip(ship, x, y, orientation) {
      return playerBoard.placeShip(ship, x, y, orientation);
    },

    startGame() {
      placeComputerShips();
      currentPlayer = player;
      gameOver = false;
    },

    playerAttack(x, y) {
      if (gameOver || currentPlayer !== player) {
        return false;
      }

      const result = player.attack(computerBoard, x, y);
      if (computerBoard.allShipsSunk()) {
        gameOver = true;
        return { result, gameOver: true, winner: 'player' };
      }

      currentPlayer = computer;
      return { result, gameOver: false };
    },

    computerPlay() {
      if (gameOver || currentPlayer !== computer) {
        return false;
      }

      const [x, y] = computer.makeRandomMove(playerBoard);
      const result = computer.attack(playerBoard, x, y);
      
      if (playerBoard.allShipsSunk()) {
        gameOver = true;
        return { x, y, result, gameOver: true, winner: 'computer' };
      }

      currentPlayer = player;
      return { x, y, result, gameOver: false };
    },

    getCurrentPlayer() {
      return currentPlayer === player ? 'player' : 'computer';
    },

    isGameOver() {
      return gameOver;
    },

    getPlayerBoard() {
      return playerBoard;
    },

    getComputerBoard() {
      return computerBoard;
    }
  };
};
