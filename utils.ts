/**
 * Takes in an array and returns all possible combinations of length k.
 * @param arr {T[]}
 * @param k {number}
 * @returns {T[][]}
 * @public
 * @example const arr: number[] = [1, 2, 3, 4]; const k = 3; combinations(arr, k);
 * [ [ 1, 2, 3 ], [ 1, 2, 4 ], [ 1, 3, 4 ], [ 2, 3, 4 ] ]
 * const arr: number[] = [1, 2, 3, 4, 5]; const k = 2; combinations(arr, k);
 * [ [ 1, 2 ], [ 1, 3 ], [ 1, 4 ], [ 1, 5 ], [ 2, 3 ], [ 2, 4 ], [ 2, 5 ],
 */
export function combinations<T>(arr: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (arr.length === 0) return [];

  const [first, ...rest] = arr;
  const combsWithoutFirst = combinations(rest, k);
  const combsWithFirst = combinations(rest, k - 1).map(
    (comb) => [first, ...comb],
  );
  return [...combsWithoutFirst, ...combsWithFirst];
}
