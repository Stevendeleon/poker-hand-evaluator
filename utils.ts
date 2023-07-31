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
