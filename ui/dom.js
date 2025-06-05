/**
 * Creates a game board grid in the DOM
 * @param {string} playerId - ID for the board container
 * @param {boolean} isEnemy - If true, this is the enemy's board
 * @returns {HTMLElement} The created board element
 */
export const createBoardGrid = (playerId, isEnemy) => {
  const board = document.createElement('div');
  board.id = playerId;
  board.className = 'game-board';
  board.style.cssText = `
    display: grid;
    grid-template-columns: repeat(10, 40px);
    gap: 2px;
    margin: 20px;
  `;

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.style.cssText = `
        width: 40px;
        height: 40px;
        border: 1px solid #ccc;
        background: #fff;
        cursor: pointer;
      `;
      board.appendChild(cell);
    }
  }

  return board;
};

/**
 * Updates a cell's appearance based on game state
 * @param {HTMLElement} cell - The cell to update
 * @param {string} state - 'hit', 'miss', or 'ship'
 */
export const updateCell = (cell, state) => {
  cell.classList.remove('hit', 'miss', 'ship');
  cell.classList.add(state);

  switch (state) {
    case 'hit':
      cell.style.backgroundColor = '#ff4444';
      break;
    case 'miss':
      cell.style.backgroundColor = '#cccccc';
      break;
    case 'ship':
      cell.style.backgroundColor = '#666666';
      break;
  }
};

/**
 * Shows a message to the player
 * @param {string} message - The message to display
 * @param {string} type - 'info', 'success', or 'error'
 */
export const showMessage = (message, type = 'info') => {
  const messageDiv = document.getElementById('message') || document.createElement('div');
  messageDiv.id = 'message';
  messageDiv.textContent = message;
  messageDiv.className = `message ${type}`;
  messageDiv.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 20px;
    border-radius: 5px;
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white;
    z-index: 1000;
  `;

  if (!messageDiv.parentElement) {
    document.body.appendChild(messageDiv);
  }

  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
};

/**
 * Creates the ship placement interface
 * @param {Array} ships - Array of ship objects with length and name
 * @returns {HTMLElement} The ship placement interface
 */
export const createShipPlacementInterface = (ships) => {
  const container = document.createElement('div');
  container.className = 'ship-placement';
  container.style.cssText = `
    padding: 20px;
    background: #f5f5f5;
    border-radius: 5px;
    margin: 20px;
  `;

  const orientationToggle = document.createElement('button');
  orientationToggle.textContent = 'Rotate Ship';
  orientationToggle.className = 'orientation-toggle';
  container.appendChild(orientationToggle);

  const shipList = document.createElement('div');
  shipList.className = 'ship-list';
  ships.forEach(ship => {
    const shipElement = document.createElement('div');
    shipElement.className = 'ship-item';
    shipElement.textContent = `${ship.name} (${ship.length})`;
    shipElement.dataset.length = ship.length;
    shipList.appendChild(shipElement);
  });
  container.appendChild(shipList);

  return container;
};

/**
 * Shows the game over screen
 * @param {string} winner - 'player' or 'computer'
 */
export const showGameOver = (winner) => {
  const overlay = document.createElement('div');
  overlay.className = 'game-over';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `;

  const message = document.createElement('div');
  message.style.cssText = `
    background: white;
    padding: 40px;
    border-radius: 10px;
    text-align: center;
  `;
  message.innerHTML = `
    <h2>Game Over!</h2>
    <p>${winner === 'player' ? 'Congratulations! You won!' : 'Computer wins! Better luck next time!'}</p>
    <button onclick="location.reload()">Play Again</button>
  `;

  overlay.appendChild(message);
  document.body.appendChild(overlay);
};
