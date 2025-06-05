import { createPlayer, createComputerPlayer } from '../src/player.js';
import { createGameboard } from '../src/gameboard.js';
import { createShip } from '../src/ship.js';

describe('Player', () => {
  let player;
  let enemyBoard;

  beforeEach(() => {
    player = createPlayer('Player 1');
    enemyBoard = createGameboard();
    // Place a test ship
    const ship = createShip(3);
    enemyBoard.placeShip(ship, 0, 0, 'horizontal');
  });

  test('can make an attack', () => {
    expect(player.attack(enemyBoard, 0, 0)).toBe('hit');
    expect(player.attack(enemyBoard, 5, 5)).toBe('miss');
  });

  test('cannot attack same position twice', () => {
    player.attack(enemyBoard, 0, 0);
    expect(() => player.attack(enemyBoard, 0, 0)).toThrow('Position already attacked');
  });
});

describe('Computer Player', () => {
  let computer;
  let playerBoard;
  let attackedPositions;

  beforeEach(() => {
    computer = createComputerPlayer();
    playerBoard = createGameboard();
    attackedPositions = new Set();
  });

  test('makes random valid moves', () => {
    const move = computer.makeRandomMove(playerBoard);
    expect(move).toEqual(expect.arrayContaining([
      expect.any(Number),
      expect.any(Number)
    ]));
    expect(move[0]).toBeLessThan(10);
    expect(move[1]).toBeLessThan(10);
  });

  test('never repeats the same move', () => {
    const moves = new Set();
    // Make 20 moves
    for (let i = 0; i < 20; i++) {
      const [x, y] = computer.makeRandomMove(playerBoard);
      const moveKey = `${x},${y}`;
      expect(moves.has(moveKey)).toBe(false);
      moves.add(moveKey);
      playerBoard.receiveAttack(x, y);
    }
  });

  test('makes intelligent moves after hitting a ship', () => {
    const ship = createShip(3);
    playerBoard.placeShip(ship, 3, 3, 'horizontal');
    
    // Simulate hitting the ship
    computer.attack(playerBoard, 3, 3);
    const nextMove = computer.makeRandomMove(playerBoard);
    
    // Next move should be adjacent to the hit
    const isAdjacent = (
      (nextMove[0] === 4 && nextMove[1] === 3) ||
      (nextMove[0] === 2 && nextMove[1] === 3) ||
      (nextMove[0] === 3 && nextMove[1] === 2) ||
      (nextMove[0] === 3 && nextMove[1] === 4)
    );
    expect(isAdjacent).toBe(true);
  });
});
