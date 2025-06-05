/**
 * Creates a new game board
 * @returns {Object} Gameboard object
 */
export const createGameboard = () => {
  const BOARD_SIZE = 10;
  const board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
  const ships = [];
  const missedShots = [];
  const attackedPositions = new Set();

  const isValidPosition = (x, y) => {
    return x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;
  };

  const isPositionFree = (x, y) => {
    return isValidPosition(x, y) && board[y][x] === null;
  };

  const canPlaceShip = (ship, x, y, orientation) => {
    const length = ship.length;
    
    for (let i = 0; i < length; i++) {
      const posX = orientation === 'horizontal' ? x + i : x;
      const posY = orientation === 'vertical' ? y + i : y;
      
      if (!isPositionFree(posX, posY)) {
        return false;
      }
    }
    return true;
  };

  return {
    placeShip(ship, x, y, orientation) {
      if (!canPlaceShip(ship, x, y, orientation)) {
        return false;
      }

      ships.push(ship);
      
      for (let i = 0; i < ship.length; i++) {
        const posX = orientation === 'horizontal' ? x + i : x;
        const posY = orientation === 'vertical' ? y + i : y;
        board[posY][posX] = ship;
      }
      
      return true;
    },

    receiveAttack(x, y) {
      if (!isValidPosition(x, y)) {
        throw new Error('Invalid position');
      }

      const posKey = `${x},${y}`;
      if (attackedPositions.has(posKey)) {
        throw new Error('Position already attacked');
      }
      
      attackedPositions.add(posKey);
      
      const ship = board[y][x];
      if (ship) {
        ship.hit();
        return 'hit';
      } else {
        missedShots.push([x, y]);
        return 'miss';
      }
    },

    getShipAt(x, y) {
      return isValidPosition(x, y) ? board[y][x] : null;
    },

    getMissedShots() {
      return [...missedShots];
    },

    allShipsSunk() {
      return ships.length > 0 && ships.every(ship => ship.isSunk());
    }
  };
};

/**
 * Gameboard class that wraps the factory function
 */
export class Gameboard {
  constructor() {
    const gameboard = createGameboard();
    
    // Copy all methods from the factory function
    for (const key in gameboard) {
      this[key] = gameboard[key];
    }
  }
}
