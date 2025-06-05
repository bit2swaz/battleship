/**
 * Creates a ship of the specified length
 * @param {number} length - The length of the ship
 * @throws {Error} If length is less than 1
 */
export const createShip = (length) => {
  if (length < 1) {
    throw new Error('Invalid ship length');
  }

  let hits = 0;

  return {
    length,
    hit() {
      if (hits >= length) {
        throw new Error('Ship cannot be hit more than its length');
      }
      hits += 1;
    },
    getHits() {
      return hits;
    },
    isSunk() {
      return hits >= length;
    }
  };
};
