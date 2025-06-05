import { Ship } from './ship.js';
import { Gameboard } from './gameboard.js';
import { Player } from './player.js';

export class GameController {
    constructor() {
        this.playerBoard = new Gameboard();
        this.computerBoard = new Gameboard();
        this.player = new Player(this.computerBoard);
        this.computer = new Player(this.playerBoard, true);
        this.currentShip = null;
        this.shipOrientation = 'horizontal';
        this.placementPhase = true;
        this.playerTurn = true;
        this.lastComputerAttackResult = null;
        
        this.ships = [
            { length: 5, name: 'Carrier' },
            { length: 4, name: 'Battleship' },
            { length: 3, name: 'Cruiser' },
            { length: 3, name: 'Submarine' },
            { length: 2, name: 'Destroyer' }
        ];
        
        this.placedShips = 0;
    }

    initialize() {
        // Place computer ships randomly
        this.ships.forEach(shipInfo => {
            let placed = false;
            while (!placed) {
                const x = Math.floor(Math.random() * 10);
                const y = Math.floor(Math.random() * 10);
                const horizontal = Math.random() < 0.5;
                
                const ship = new Ship(shipInfo.length);
                placed = this.computerBoard.placeShip(ship, x, y, horizontal);
            }
        });
    }

    isPlacementPhase() {
        return this.placementPhase;
    }

    isPlayerTurn() {
        return this.playerTurn;
    }

    setCurrentShip(length) {
        this.currentShip = new Ship(length);
    }

    toggleShipOrientation() {
        this.shipOrientation = this.shipOrientation === 'horizontal' ? 'vertical' : 'horizontal';
        return this.shipOrientation;
    }

    placePlayerShip(x, y) {
        if (!this.currentShip) return false;

        const placed = this.playerBoard.placeShip(
            this.currentShip,
            x,
            y,
            this.shipOrientation === 'horizontal'
        );

        if (placed) {
            this.placedShips++;
            this.currentShip = null;

            if (this.placedShips === this.ships.length) {
                this.placementPhase = false;
            }
        }

        return placed;
    }

    playerAttack(x, y) {
        if (this.placementPhase || !this.playerTurn) return null;

        const result = this.player.attack(x, y);
        if (result) {
            this.playerTurn = false;
            return result;
        }
        return null;
    }

    computerAttack() {
        if (this.placementPhase || this.playerTurn) return null;

        // Maximum number of attempts to avoid infinite loop
        const maxAttempts = 100;
        let attempts = 0;
        
        while (attempts < maxAttempts) {
            attempts++;
            const [x, y] = this.computer.makeRandomAttack();
            this.lastComputerAttackResult = this.playerBoard.receiveAttack(x, y);
            
            if (this.lastComputerAttackResult !== null) {
                this.playerTurn = true;
                return [x, y];
            }
        }
        
        console.error("Maximum computer attack attempts reached");
        // Emergency fallback - just switch turns
        this.playerTurn = true;
        this.lastComputerAttackResult = "miss";
        return [0, 0];
    }

    getLastComputerAttackResult() {
        return this.lastComputerAttackResult;
    }

    isGameOver() {
        return this.playerBoard.allShipsSunk() || this.computerBoard.allShipsSunk();
    }

    getWinner() {
        if (!this.isGameOver()) return null;
        return this.computerBoard.allShipsSunk() ? 'Player' : 'Computer';
    }
}
