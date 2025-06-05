import { createGameController } from '../src/gameController.js';
import { createShip } from '../src/ship.js';
import {
  createBoardGrid,
  updateCell,
  showMessage,
  createShipPlacementInterface,
  showGameOver
} from './dom.js';

const game = createGameController();
let currentShipIndex = 0;
let currentOrientation = 'horizontal';

const standardShips = [
  { length: 5, name: 'Carrier' },
  { length: 4, name: 'Battleship' },
  { length: 3, name: 'Cruiser' },
  { length: 3, name: 'Submarine' },
  { length: 2, name: 'Destroyer' }
];

const initializeGame = () => {
  const app = document.getElementById('app');
  app.innerHTML = '';

  // Create game container
  const gameContainer = document.createElement('div');
  gameContainer.style.cssText = `
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 20px;
  `;

  // Create boards
  const playerBoard = createBoardGrid('player-board', false);
  const computerBoard = createBoardGrid('computer-board', true);
  
  // Create ship placement interface
  const placementInterface = createShipPlacementInterface(standardShips);
  
  // Add to container
  gameContainer.appendChild(playerBoard);
  gameContainer.appendChild(computerBoard);
  app.appendChild(placementInterface);
  app.appendChild(gameContainer);

  // Add ship placement event listeners
  playerBoard.addEventListener('click', handleShipPlacement);
  
  // Add orientation toggle
  const orientationToggle = document.querySelector('.orientation-toggle');
  orientationToggle.addEventListener('click', () => {
    currentOrientation = currentOrientation === 'horizontal' ? 'vertical' : 'horizontal';
    showMessage(`Orientation: ${currentOrientation}`, 'info');
  });
};

const handleShipPlacement = (event) => {
  if (currentShipIndex >= standardShips.length) return;

  const cell = event.target;
  if (!cell.classList.contains('cell')) return;

  const x = parseInt(cell.dataset.x);
  const y = parseInt(cell.dataset.y);
  const shipInfo = standardShips[currentShipIndex];
  const ship = createShip(shipInfo.length);

  if (game.placePlayerShip(ship, x, y, currentOrientation)) {
    // Mark ship cells
    for (let i = 0; i < shipInfo.length; i++) {
      const cellX = currentOrientation === 'horizontal' ? x + i : x;
      const cellY = currentOrientation === 'vertical' ? y + i : y;
      const shipCell = document.querySelector(`#player-board [data-x="${cellX}"][data-y="${cellY}"]`);
      updateCell(shipCell, 'ship');
    }

    currentShipIndex++;
    
    if (currentShipIndex >= standardShips.length) {
      startBattle();
    } else {
      showMessage(`Place your ${standardShips[currentShipIndex].name}`, 'info');
    }
  } else {
    showMessage('Invalid placement! Try again.', 'error');
  }
};

const startBattle = () => {
  // Remove placement interface
  document.querySelector('.ship-placement').remove();
  
  // Remove ship placement event listeners
  document.getElementById('player-board').removeEventListener('click', handleShipPlacement);
  
  // Start the game
  game.startGame();
  
  // Add attack event listeners
  document.getElementById('computer-board').addEventListener('click', handlePlayerAttack);
  
  showMessage('Game started! Attack the enemy board!', 'success');
};

const handlePlayerAttack = (event) => {
  if (game.getCurrentPlayer() !== 'player') return;

  const cell = event.target;
  if (!cell.classList.contains('cell')) return;

  const x = parseInt(cell.dataset.x);
  const y = parseInt(cell.dataset.y);

  const result = game.playerAttack(x, y);
  if (!result) return;

  updateCell(cell, result.result);

  if (result.gameOver) {
    showGameOver('player');
    return;
  }

  // Computer's turn
  setTimeout(() => {
    const computerMove = game.computerPlay();
    if (!computerMove) return;

    const targetCell = document.querySelector(
      `#player-board [data-x="${computerMove.x}"][data-y="${computerMove.y}"]`
    );
    updateCell(targetCell, computerMove.result);

    if (computerMove.gameOver) {
      showGameOver('computer');
    }
  }, 500);
};

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initializeGame);
