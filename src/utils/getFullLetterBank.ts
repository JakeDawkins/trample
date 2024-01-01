import seedrandom from 'seedrandom';

// all letters
export const letters = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

/**
  1 point - A, E, I, O, U, L, N, S, T, R
  2 points - D, G
  3 points - B, C, M, P
  4 points - F, H, V, W, Y
  5 points - K
  8 points - J, X
  10 points - Q, Z
 */
export const points = {
  A: 1,
  B: 3,
  C: 3,
  D: 2,
  E: 1,
  F: 4,
  G: 2,
  H: 4,
  I: 1,
  J: 8,
  K: 5,
  L: 1,
  M: 3,
  N: 1,
  O: 1,
  P: 3,
  Q: 10,
  R: 1,
  S: 1,
  T: 1,
  U: 1,
  V: 4,
  W: 4,
  X: 8,
  Y: 4,
  Z: 10,
};

const weights = [
  8, // A
  10, // B
  10, // C
  10, // D
  8, // E
  10, // F
  10, // G
  10, // H
  8, // I
  3, // J
  10, // K
  10, // L
  10, // M
  10, // N
  8, // O
  10, // P
  1, // Q
  10, // R
  10, // S
  10, // T
  8, // U
  5, // V
  10, // W
  1, // X
  7, // Y
  1, // Z
];
const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
const relativeWeights = weights.map((weight) => weight / totalWeight);

// const relativeWeights = [
//   0.08617234468937876, 0.02004008016032064, 0.04609218436873747,
//   0.03406813627254509, 0.11222444889779559, 0.018036072144288578,
//   0.02404809619238477, 0.03006012024048096, 0.07615230460921844,
//   0.002004008016032064, 0.01002004008016032, 0.05410821643286573,
//   0.03006012024048096, 0.06613226452905811, 0.07214428857715431,
//   0.03206412825651302, 0.002004008016032064, 0.07615230460921844,
//   0.05811623246492986, 0.07014028056112225, 0.036072144288577156,
//   0.01002004008016032, 0.012024048096192385, 0.002004008016032064,
//   0.018036072144288578, 0.002004008016032064,
// ];

// https://dev.to/trekhleb/weighted-random-algorithm-in-javascript-1pdc
export function weightedRandom(
  items: Array<string>,
  weights: Array<number>,
  seed: string,
) {
  if (items.length !== weights.length) {
    throw new Error('Items and weights must be of the same size');
  }

  if (!items.length) {
    throw new Error('Items must not be empty');
  }

  // Preparing the cumulative weights array.
  // For example:
  // - weights = [1, 4, 3]
  // - cumulativeWeights = [1, 5, 8]
  const cumulativeWeights: Array<number> = [];
  for (let i = 0; i < weights.length; i += 1) {
    cumulativeWeights[i] = weights[i] + (cumulativeWeights[i - 1] || 0);
  }

  // Getting the random number in a range of [0...sum(weights)]
  // For example:
  // - weights = [1, 4, 3]
  // - maxCumulativeWeight = 8
  // - range for the random number is [0...8]
  const maxCumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1];
  const random = seedrandom(seed);
  const randomNumber = maxCumulativeWeight * random();

  // Picking the random item based on its weight.
  // The items with higher weight will be picked more often.
  for (let itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
    if (cumulativeWeights[itemIndex] >= randomNumber) {
      return items[itemIndex];
    }
  }
}

function isDefined<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

export default function getFullLetterBank(seedOverride?: string): string[] {
  const date = new Date();
  const seed = seedOverride
    ? seedOverride
    : `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  const letterBank: Array<string | undefined> = [];
  for (let i = 0; i < 1000; i++) {
    const letter = weightedRandom(letters, relativeWeights, `${seed}${i}`);
    letterBank.push(letter);
  }
  return letterBank.filter(isDefined);
}

export function pointsForWord(word: string): number {
  return word.split('').reduce((acc, letter) => acc + points[letter], 0);
}
