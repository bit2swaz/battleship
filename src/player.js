/**
 * Creates a human player
 * @param {string} name - The player's name
 */
export const createPlayer = (name) => {
  return {
    name,
    attack(gameboard, x, y) {
      return gameboard.receiveAttack(x, y);
    }
  };
};

/**
 * Creates a computer player with AI capabilities
 */
export const createComputerPlayer = () => {
  const BOARD_SIZE = 10;
  const attackedPositions = new Set();
  let lastHit = null;
  let potentialMoves = [];

  const isValidMove = (x, y) => {
    return x >= 0 && x < BOARD_SIZE && 
           y >= 0 && y < BOARD_SIZE && 
           !attackedPositions.has(`${x},${y}`);
  };

  const getAdjacentMoves = (x, y) => {
    return [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1]
    ].filter(([x, y]) => isValidMove(x, y));
  };

  const makeRandomValidMove = () => {
    let x, y;
    do {
      x = Math.floor(Math.random() * BOARD_SIZE);
      y = Math.floor(Math.random() * BOARD_SIZE);
    } while (!isValidMove(x, y));
    return [x, y];
  };

  return {
    attack(gameboard, x, y) {
      const result = gameboard.receiveAttack(x, y);
      attackedPositions.add(`${x},${y}`);
      
      if (result === 'hit') {
        lastHit = [x, y];
        potentialMoves = getAdjacentMoves(x, y);
      }
      
      return result;
    },

    makeRandomMove(gameboard) {
      let move;
      
      if (lastHit && potentialMoves.length > 0) {
        // Try adjacent positions to last hit
        move = potentialMoves.pop();
      } else {
        // Make a random move
        move = makeRandomValidMove();
      }
      
      const [x, y] = move;
      attackedPositions.add(`${x},${y}`);
      return move;
    }
  };
};

/**
 * Player class that combines both human and computer player functionality
 */
export class Player {
  constructor(targetBoard, isComputer = false) {
    this.targetBoard = targetBoard;
    this.isComputer = isComputer;
    
    // Computer player properties
    if (isComputer) {
      this.BOARD_SIZE = 10;
      this.attackedPositions = new Set();
      this.lastHit = null;
      this.potentialMoves = [];
    }
  }
  
  attack(x, y) {
    try {
      return this.targetBoard.receiveAttack(x, y);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  
  makeRandomAttack() {
    let x, y;
    let move;
    
    if (this.lastHit && this.potentialMoves.length > 0) {
      // Try adjacent positions to last hit
      move = this.potentialMoves.pop();
    } else {
      // Make a random move
      do {
        x = Math.floor(Math.random() * this.BOARD_SIZE);
        y = Math.floor(Math.random() * this.BOARD_SIZE);
      } while (this.attackedPositions.has(`${x},${y}`));
      move = [x, y];
    }
    
    const [moveX, moveY] = move;
    this.attackedPositions.add(`${moveX},${moveY}`);
    
    // Update last hit and potential moves if this was a hit
    const result = this.attack(moveX, moveY);
    if (result === 'hit') {
      this.lastHit = [moveX, moveY];
      this.potentialMoves = this.getAdjacentMoves(moveX, moveY);
    }
    
    return move;
  }
  
  getAdjacentMoves(x, y) {
    return [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1]
    ].filter(([x, y]) => this.isValidMove(x, y));
  }
  
  isValidMove(x, y) {
    return x >= 0 && x < this.BOARD_SIZE && 
           y >= 0 && y < this.BOARD_SIZE && 
           !this.attackedPositions.has(`${x},${y}`);
  }
}
