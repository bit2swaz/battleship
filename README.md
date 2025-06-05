# Battleship

A Test-Driven Development implementation of the classic Battleship game using vanilla JavaScript with ES6 modules.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run tests:
```bash
npm test
```

3. Start development server:
```bash
npm start
```

## Project Structure

- `src/` - Core game logic
  - `ship.js` - Ship factory and methods
  - `gameboard.js` - Game board logic
  - `player.js` - Player actions and AI
  - `gameController.js` - Game flow control

- `tests/` - Jest test files
  - `ship.test.js`
  - `gameboard.test.js`
  - `player.test.js`

- `ui/` - DOM manipulation and rendering
  - `dom.js` - DOM interaction functions
  - `index.js` - Main game initialization

## Development

This project follows Test-Driven Development principles. Each module is developed by:
1. Writing tests first
2. Implementing the minimum code to pass tests
3. Refactoring while maintaining test coverage