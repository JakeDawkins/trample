import seedrandom from 'seedrandom';

// all letters
const items = [
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
// const weights = [
//   43, 10, 23, 17, 56, 9, 12, 15, 38, 1, 5, 27, 15, 33, 36, 16, 1, 38, 29, 35,
//   18, 5, 6, 1, 9, 1,
// ];
const relativeWeights = [
  0.08617234468937876, 0.02004008016032064, 0.04609218436873747,
  0.03406813627254509, 0.11222444889779559, 0.018036072144288578,
  0.02404809619238477, 0.03006012024048096, 0.07615230460921844,
  0.002004008016032064, 0.01002004008016032, 0.05410821643286573,
  0.03006012024048096, 0.06613226452905811, 0.07214428857715431,
  0.03206412825651302, 0.002004008016032064, 0.07615230460921844,
  0.05811623246492986, 0.07014028056112225, 0.036072144288577156,
  0.01002004008016032, 0.012024048096192385, 0.002004008016032064,
  0.018036072144288578, 0.002004008016032064,
];

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
  const randomNumber = maxCumulativeWeight * random(); // Math.random();

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
  for (let i = 0; i < 100; i++) {
    const letter = weightedRandom(items, relativeWeights, `${seed}${i}`);
    letterBank.push(letter);
  }
  return letterBank.filter(isDefined);
}
