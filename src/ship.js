export const createShip = (length) => {
  let hits = 0;

  return {
    length,
    hit() {
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
