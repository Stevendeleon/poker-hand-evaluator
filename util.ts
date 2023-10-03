/**
 * Generates combinations of elements from an iterable.
 *
 * @param {Array} iterable - The iterable from which to generate combinations.
 * @param {number} r - The number of elements in each combination.
 * @returns {Generator} A generator that yields arrays of elements representing combinations.
 */
export function* combinations<T>(iterable: T[], r: number): Generator<T[]> {
  const pool = iterable;
  const n = pool.length;

  if (r > n) {
    return;
  }

  const indices = Array.from({ length: r }, (_, i) => i);

  yield indices.map((i) => pool[i]);

  while (true) {
    let i = r - 1;

    for (; i >= 0; i--) {
      if (indices[i] !== i + n - r) {
        break;
      }
    }

    if (i < 0) {
      return;
    }

    indices[i] += 1;
    
    for (let j = i + 1; j < r; j++) {
      indices[j] = indices[j - 1] + 1;
    }
    
    yield indices.map((i) => pool[i]);
  }
}
