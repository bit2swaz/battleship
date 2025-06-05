import { createGameboard } from '../src/gameboard.js';
import { createShip } from '../src/ship.js';

describe('Gameboard', () => {
  let gameboard;

  beforeEach(() => {
    gameboard = createGameboard();
  });

  describe('ship placement', () => {
    test('can place ship horizontally', () => {
      const ship = createShip(3);
      expect(gameboard.placeShip(ship, 0, 0, 'horizontal')).toBe(true);
      expect(gameboard.getShipAt(0, 0)).toBe(ship);
      expect(gameboard.getShipAt(1, 0)).toBe(ship);
      expect(gameboard.getShipAt(2, 0)).toBe(ship);
    });

    test('can place ship vertically', () => {
      const ship = createShip(3);
      expect(gameboard.placeShip(ship, 0, 0, 'vertical')).toBe(true);
      expect(gameboard.getShipAt(0, 0)).toBe(ship);
      expect(gameboard.getShipAt(0, 1)).toBe(ship);
      expect(gameboard.getShipAt(0, 2)).toBe(ship);
    });

    test('cannot place ship outside board', () => {
      const ship = createShip(3);
      expect(gameboard.placeShip(ship, 8, 8, 'horizontal')).toBe(false);
      expect(gameboard.placeShip(ship, 8, 8, 'vertical')).toBe(false);
    });

    test('cannot place overlapping ships', () => {
      const ship1 = createShip(3);
      const ship2 = createShip(3);
      gameboard.placeShip(ship1, 0, 0, 'horizontal');
      expect(gameboard.placeShip(ship2, 0, 0, 'vertical')).toBe(false);
    });
  });

  describe('receiving attacks', () => {
    beforeEach(() => {
      const ship = createShip(3);
      gameboard.placeShip(ship, 0, 0, 'horizontal');
    });

    test('records hit on ship', () => {
      expect(gameboard.receiveAttack(0, 0)).toBe('hit');
      expect(gameboard.getShipAt(0, 0).getHits()).toBe(1);
    });

    test('records missed shot', () => {
      expect(gameboard.receiveAttack(5, 5)).toBe('miss');
      expect(gameboard.getMissedShots()).toContainEqual([5, 5]);
    });

    test('cannot hit same position twice', () => {
      gameboard.receiveAttack(0, 0);
      expect(() => gameboard.receiveAttack(0, 0)).toThrow('Position already attacked');
    });
  });

  describe('game status', () => {
    test('reports when all ships are not sunk', () => {
      const ship = createShip(2);
      gameboard.placeShip(ship, 0, 0, 'horizontal');
      gameboard.receiveAttack(0, 0);
      expect(gameboard.allShipsSunk()).toBe(false);
    });

    test('reports when all ships are sunk', () => {
      const ship = createShip(2);
      gameboard.placeShip(ship, 0, 0, 'horizontal');
      gameboard.receiveAttack(0, 0);
      gameboard.receiveAttack(1, 0);
      expect(gameboard.allShipsSunk()).toBe(true);
    });
  });
});
