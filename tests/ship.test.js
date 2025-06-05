import { createShip } from '../src/ship.js';

describe('Ship Factory', () => {
  describe('initialization', () => {
    test('creates a ship with the specified length', () => {
      const ship = createShip(4);
      expect(ship.length).toBe(4);
    });

    test('throws error if length is invalid', () => {
      expect(() => createShip(0)).toThrow('Invalid ship length');
      expect(() => createShip(-1)).toThrow('Invalid ship length');
    });
  });

  describe('hit tracking', () => {
    let ship;
    
    beforeEach(() => {
      ship = createShip(3);
    });

    test('ship starts with 0 hits', () => {
      expect(ship.getHits()).toBe(0);
    });

    test('hit() increases hit count by 1', () => {
      ship.hit();
      expect(ship.getHits()).toBe(1);
      ship.hit();
      expect(ship.getHits()).toBe(2);
    });

    test('cannot be hit more times than its length', () => {
      ship.hit();
      ship.hit();
      ship.hit();
      expect(() => ship.hit()).toThrow('Ship cannot be hit more than its length');
    });
  });

  describe('sinking', () => {
    test('isSunk() returns false when hits < length', () => {
      const ship = createShip(3);
      ship.hit();
      ship.hit();
      expect(ship.isSunk()).toBe(false);
    });

    test('isSunk() returns true when hits = length', () => {
      const ship = createShip(2);
      ship.hit();
      ship.hit();
      expect(ship.isSunk()).toBe(true);
    });

    test('isSunk() returns true for length 1 ship after one hit', () => {
      const ship = createShip(1);
      ship.hit();
      expect(ship.isSunk()).toBe(true);
    });
  });
});
