/**
 * Creates a game board grid in the DOM
 * @param {string} playerId - ID for the board container
 * @param {boolean} isEnemy - If true, this is the enemy's board
 * @returns {HTMLElement} The created board element
 */
export function createGameBoard(player, onClick) {
    const board = document.createElement('div');
    board.classList.add('game-board');
    board.dataset.player = player;

    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = `repeat(10, var(--grid-cell-size))`;
    grid.style.gap = 'var(--grid-gap)';
    grid.classList.add('grid');

    for (let i = 0; i < 100; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.style.width = 'var(--grid-cell-size)';
        cell.style.height = 'var(--grid-cell-size)';
        cell.dataset.index = i;
        cell.addEventListener('click', () => onClick(i));
        grid.appendChild(cell);
    }

    const label = document.createElement('h2');
    label.textContent = `${player}'s Board`;
    label.style.marginBottom = '1rem';
    label.style.textAlign = 'center';
    label.style.fontFamily = 'Orbitron, sans-serif';

    board.appendChild(label);
    board.appendChild(grid);
    return board;
}

/**
 * Updates a cell's appearance based on game state
 * @param {HTMLElement} cell - The cell to update
 * @param {string} state - 'hit', 'miss', or 'ship'
 */
export function updateCell(boardElement, index, state) {
    const cell = boardElement.querySelector(`[data-index="${index}"]`);
    if (!cell) return;

    cell.classList.remove('ship', 'hit', 'miss');
    
    if (state === 'ship') {
        cell.classList.add('ship');
    } else if (state === 'hit') {
        cell.classList.add('hit');
    } else if (state === 'miss') {
        cell.classList.add('miss');
    }
}

/**
 * Shows a message to the player
 * @param {string} message - The message to display
 * @param {string} type - 'info', 'success', or 'error'
 */
export function showMessage(message, isError = false) {
    const container = document.createElement('div');
    container.classList.add('message');
    container.style.padding = '1rem';
    container.style.marginBottom = '1rem';
    container.style.borderRadius = '5px';
    container.style.backgroundColor = isError ? '#ff4444' : 'var(--accent-primary)';
    container.style.color = 'var(--text-primary)';
    container.style.textAlign = 'center';
    container.style.fontFamily = 'Orbitron, sans-serif';
    container.textContent = message;
    
    const app = document.getElementById('app');
    app.insertBefore(container, app.firstChild);

    setTimeout(() => {
        container.style.opacity = '0';
        container.style.transition = 'opacity 0.3s ease-out';
        setTimeout(() => container.remove(), 300);
    }, 3000);
}

/**
 * Creates the ship placement interface
 * @param {Array} ships - Array of ship objects with length and name
 * @returns {HTMLElement} The ship placement interface
 */
export function createShipPlacement(onOrientationToggle, onShipSelect) {
    const container = document.createElement('div');
    container.classList.add('ship-placement');

    const title = document.createElement('h2');
    title.textContent = 'Place Your Ships';
    title.style.marginBottom = '1rem';
    title.style.fontFamily = 'Orbitron, sans-serif';
    title.style.textAlign = 'center';

    const orientationBtn = document.createElement('button');
    orientationBtn.classList.add('orientation-toggle');
    orientationBtn.textContent = 'Rotate Ship';
    orientationBtn.addEventListener('click', onOrientationToggle);

    const shipList = document.createElement('div');
    shipList.classList.add('ship-list');

    const ships = [
        { name: 'Carrier', length: 5 },
        { name: 'Battleship', length: 4 },
        { name: 'Cruiser', length: 3 },
        { name: 'Submarine', length: 3 },
        { name: 'Destroyer', length: 2 }
    ];

    ships.forEach(ship => {
        const shipItem = document.createElement('div');
        shipItem.classList.add('ship-item');
        shipItem.textContent = `${ship.name} (${ship.length})`;
        shipItem.addEventListener('click', () => onShipSelect(ship.length));
        shipList.appendChild(shipItem);
    });

    container.appendChild(title);
    container.appendChild(orientationBtn);
    container.appendChild(shipList);
    return container;
}

/**
 * Shows the game over screen
 * @param {string} winner - 'player' or 'computer'
 */
export function showWinScreen(winner) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000';

    const content = document.createElement('div');
    content.style.backgroundColor = 'var(--bg-secondary)';
    content.style.padding = '2rem';
    content.style.borderRadius = '10px';
    content.style.textAlign = 'center';
    content.style.animation = 'slideDown 0.5s ease-out';

    const title = document.createElement('h2');
    title.textContent = `${winner} Wins!`;
    title.style.color = 'var(--accent-secondary)';
    title.style.fontFamily = 'Orbitron, sans-serif';
    title.style.fontSize = '2.5rem';
    title.style.marginBottom = '1rem';

    const playAgainBtn = document.createElement('button');
    playAgainBtn.textContent = 'Play Again';
    playAgainBtn.classList.add('orientation-toggle');
    playAgainBtn.addEventListener('click', () => {
        window.location.reload();
    });

    content.appendChild(title);
    content.appendChild(playAgainBtn);
    overlay.appendChild(content);
    document.body.appendChild(overlay);
}
