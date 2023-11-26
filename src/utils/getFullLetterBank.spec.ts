import getFullLetterBank, { weightedRandom } from './getFullLetterBank';

it('should return a letter', () => {
  const letter = weightedRandom(['a'], [1], 'seed');
  expect(letter).toEqual('a');
});

it('should the same letter each time with the same seed', () => {
  const config: [string[], number[], string] = [
    ['a', 'b', 'c', 'd', 'e'],
    [0.2, 0.2, 0.2, 0.2, 0.2],
    'seed',
  ];
  const letter1 = weightedRandom(...config);
  for (let i = 0; i < 100; i++) {
    const letter2 = weightedRandom(...config);
    expect(letter1).toEqual(letter2);
  }
  // expect(letter1).toEqual('a');
});

it('should the same letter each time with the same seed', () => {
  const config: [string[], number[], string] = [
    ['a', 'b', 'c', 'd', 'e'],
    [0.2, 0.2, 0.2, 0.2, 0.2],
    'seed',
  ];
  const letter1 = weightedRandom(...config);
  for (let i = 0; i < 100; i++) {
    const letter2 = weightedRandom(...config);
    expect(letter1).toEqual(letter2);
  }
  // expect(letter1).toEqual('a');
});

it('should return a consistent letter bank for seed', () => {
  const bank = getFullLetterBank('seed');
  console.log(bank);
  for (let i = 0; i < 100; i++) {
    const bank2 = getFullLetterBank('seed');
    expect(bank).toEqual(bank2);
  }
});
