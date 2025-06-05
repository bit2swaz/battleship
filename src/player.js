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
    // Don't try to attack positions we've already attacked
    const posKey = `${x},${y}`;
    if (this.isComputer && this.attackedPositions.has(posKey)) {
      return null;
    }
    
    const result = this.targetBoard.receiveAttack(x, y);
    
    // Mark as attacked for computer player
    if (this.isComputer && result !== null) {
      this.attackedPositions.add(posKey);
    }
    
    return result;
  }
  
  makeRandomAttack() {
    // Try to use potential moves from previous hits first
    let move;
    
    if (this.lastHit && this.potentialMoves.length > 0) {
      // Filter out any invalid moves
      this.potentialMoves = this.potentialMoves.filter(([x, y]) => this.isValidMove(x, y));
      
      if (this.potentialMoves.length > 0) {
        move = this.potentialMoves.pop();
      } else {
        // No valid potential moves, make a random move
        move = this.getRandomValidMove();
      }
    } else {
      // Make a random move
      move = this.getRandomValidMove();
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
  
  getRandomValidMove() {
    let x, y;
    let attempts = 0;
    const maxAttempts = 100; // Safety limit
    
    do {
      x = Math.floor(Math.random() * this.BOARD_SIZE);
      y = Math.floor(Math.random() * this.BOARD_SIZE);
      attempts++;
      
      if (attempts > maxAttempts) {
        // Fallback: scan the board for any valid move
        for (let scanX = 0; scanX < this.BOARD_SIZE; scanX++) {
          for (let scanY = 0; scanY < this.BOARD_SIZE; scanY++) {
            if (this.isValidMove(scanX, scanY)) {
              return [scanX, scanY];
            }
          }
        }
        console.error("No valid moves found on the board");
        // Emergency fallback - return a random position
        return [Math.floor(Math.random() * this.BOARD_SIZE), 
                Math.floor(Math.random() * this.BOARD_SIZE)];
      }
    } while (!this.isValidMove(x, y));
    
    return [x, y];
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
