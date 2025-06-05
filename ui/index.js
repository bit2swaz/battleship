import { createGameBoard, createShipPlacement, updateCell, showMessage, createGameContainer, showWinScreen } from './dom.js';
import { GameController } from '../src/gameController.js';

const game = new GameController();
const app = document.getElementById('app');

// Create game container
const gameContainer = createGameContainer();

// Create player board
const playerBoard = createGameBoard('Player', (index) => {
    // This is for ship placement phase
    if (game.isPlacementPhase()) {
        const [x, y] = [index % 10, Math.floor(index / 10)];
        if (game.placePlayerShip(x, y)) {
            updateCell(playerBoard, index, 'ship');
        }
    }
});

// Create computer board
const computerBoard = createGameBoard('Computer', (index) => {
    if (!game.isPlacementPhase() && game.isPlayerTurn()) {
        const [x, y] = [index % 10, Math.floor(index / 10)];
        const result = game.playerAttack(x, y);
        
        if (result) {
            updateCell(computerBoard, index, result);
            
            if (game.isGameOver()) {
                showWinScreen(game.getWinner());
                return;
            }
            
            // Computer's turn
            setTimeout(() => {
                const [compX, compY] = game.computerAttack();
                const compIndex = compY * 10 + compX;
                const compResult = game.getLastComputerAttackResult();
                updateCell(playerBoard, compIndex, compResult);
                
                if (game.isGameOver()) {
                    showWinScreen(game.getWinner());
                }
            }, 500);
        }
    }
});

// Create ship placement interface
const shipPlacement = createShipPlacement(
    () => game.toggleShipOrientation(),
    (length) => {
        game.setCurrentShip(length);
        showMessage('Select a position on your board to place the ship');
    }
);

// Add elements to the container
gameContainer.appendChild(shipPlacement);
gameContainer.appendChild(playerBoard);
gameContainer.appendChild(computerBoard);

// Add container to app
app.appendChild(gameContainer);

// Initialize game
game.initialize();
