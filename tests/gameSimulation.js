import { Ship } from '../src/ship.js';
import { Gameboard } from '../src/gameboard.js';
import { Player } from '../src/player.js';
import { GameController } from '../src/gameController.js';

console.log('=== BATTLESHIP GAME SIMULATION ===');

// Create a game controller
const game = new GameController();
console.log('Game controller initialized');

// Verify initial state
console.log(`Initial placement phase: ${game.isPlacementPhase()}`);
console.log(`Initial player turn: ${game.isPlayerTurn()}`);

// Initialize the game (place computer ships)
game.initialize();
console.log('Game initialized (computer ships placed)');

// Place player ships
const shipTypes = [
    { length: 5, name: 'Carrier' },
    { length: 4, name: 'Battleship' },
    { length: 3, name: 'Cruiser' },
    { length: 3, name: 'Submarine' },
    { length: 2, name: 'Destroyer' }
];

// Place ships at predefined positions
const shipPositions = [
    { x: 0, y: 0 },
    { x: 0, y: 2 },
    { x: 0, y: 4 },
    { x: 0, y: 6 },
    { x: 0, y: 8 }
];

console.log('\n=== PLACING PLAYER SHIPS ===');
shipTypes.forEach((ship, index) => {
    game.setCurrentShip(ship.length);
    const position = shipPositions[index];
    const result = game.placePlayerShip(position.x, position.y);
    console.log(`Placed ${ship.name} at (${position.x}, ${position.y}): ${result ? 'SUCCESS' : 'FAILED'}`);
});

console.log(`\nPlacement phase after placing all ships: ${game.isPlacementPhase()}`);
console.log(`Player turn after placing all ships: ${game.isPlayerTurn()}`);

// Simulate game play
console.log('\n=== GAME SIMULATION ===');

// Function to make a player attack
function simulatePlayerAttack(x, y) {
    console.log(`\nPlayer attacks (${x}, ${y})`);
    const result = game.playerAttack(x, y);
    console.log(`Attack result: ${result}`);
    console.log(`Game over: ${game.isGameOver()}`);
    
    if (game.isGameOver()) {
        console.log(`Winner: ${game.getWinner()}`);
        return true;
    }
    return false;
}

// Function to make a computer attack
function simulateComputerAttack() {
    console.log('\nComputer attacks');
    const [x, y] = game.computerAttack();
    console.log(`Computer attacked (${x}, ${y})`);
    const result = game.getLastComputerAttackResult();
    console.log(`Attack result: ${result}`);
    console.log(`Game over: ${game.isGameOver()}`);
    
    if (game.isGameOver()) {
        console.log(`Winner: ${game.getWinner()}`);
        return true;
    }
    return false;
}

// Simulate 10 rounds of attacks or until game over
let gameOver = false;
let round = 1;

// Predefined player attacks to target computer ships
const playerAttacks = [
    [0, 0], [0, 1], [0, 2], [0, 3], [0, 4],  // Try to find ships along top row
    [1, 0], [1, 1], [1, 2], [1, 3], [1, 4],  // Try second row
    [2, 0], [2, 1], [2, 2], [2, 3], [2, 4],  // Try third row
    [3, 0], [3, 1], [3, 2], [3, 3], [3, 4],  // Try fourth row
    [4, 0], [4, 1], [4, 2], [4, 3], [4, 4],  // Try fifth row
    [5, 0], [5, 1], [5, 2], [5, 3], [5, 4],  // Try sixth row
    [6, 0], [6, 1], [6, 2], [6, 3], [6, 4],  // Try seventh row
    [7, 0], [7, 1], [7, 2], [7, 3], [7, 4],  // Try eighth row
    [8, 0], [8, 1], [8, 2], [8, 3], [8, 4],  // Try ninth row
    [9, 0], [9, 1], [9, 2], [9, 3], [9, 4],  // Try tenth row
];

while (!gameOver && round <= 50) {
    console.log(`\n--- ROUND ${round} ---`);
    
    // Player's turn
    if (game.isPlayerTurn()) {
        const attackIndex = (round - 1) % playerAttacks.length;
        const [x, y] = playerAttacks[attackIndex];
        gameOver = simulatePlayerAttack(x, y);
    }
    
    // Computer's turn (if game not over)
    if (!gameOver && !game.isPlayerTurn()) {
        gameOver = simulateComputerAttack();
    }
    
    round++;
    
    // Safety check to prevent infinite loops
    if (round > 50) {
        console.log('Maximum rounds reached. Ending simulation.');
        break;
    }
}

console.log('\n=== GAME SIMULATION COMPLETE ===');
console.log(`Final game state - Game over: ${game.isGameOver()}`);
if (game.isGameOver()) {
    console.log(`Winner: ${game.getWinner()}`);
} 