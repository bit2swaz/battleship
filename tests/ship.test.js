import { createShip } from '../src/ship.js';

describe('Ship', () => {
  test('creates a ship with the specified length', () => {
    const ship = createShip(4);
    expect(ship.length).toBe(4);
  });

  test('ship starts with 0 hits', () => {
    const ship = createShip(3);
    expect(ship.getHits()).toBe(0);
  });

  test('hit() increases hit count by 1', () => {
    const ship = createShip(3);
    ship.hit();
    expect(ship.getHits()).toBe(1);
  });

  test('isSunk() returns true when hits equal length', () => {
    const ship = createShip(2);
    ship.hit();
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
});
