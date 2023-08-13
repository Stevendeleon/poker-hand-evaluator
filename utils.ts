/**
 * Generates all possible combinations of size 'comboSize' from the given 'inputArray'.
 *
 * @param {T[]} inputArray - The input array of elements.
 * @param {number} comboSize - The size of the combinations to generate.
 * @return {T[][]} - An array of combinations, where each combination is an array of elements from 'inputArray'.
 */
export function generateCombinations<T>(inputArray: T[], comboSize: number): T[][] {
  if (comboSize === 0) return [[]];
  if (inputArray.length === 0) return [];

  const [firstElement, ...remainingElements] = inputArray;
  const combinationsWithoutFirst = generateCombinations(remainingElements, comboSize);
  const combinationsWithFirst = generateCombinations(remainingElements, comboSize - 1).map(
      (combination) => [firstElement, ...combination],
  );

  const result = [...combinationsWithoutFirst, ...combinationsWithFirst];

  return result;
}
