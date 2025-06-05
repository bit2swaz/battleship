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
