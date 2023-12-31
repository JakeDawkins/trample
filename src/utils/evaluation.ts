/**
 * For an initial word and a letter bank, how many 2nd and 3rd words can be made?
 */

/**
 * Evaluate the letter bank -> too many of one letter in the first 20 letters?
 */

/**
 * For the current word and letter bank, can you make another word
 */

export async function canMakeWord(
  word: string,
  letterBank: string[],
  deletionsRemaining: number,
  previousWords: string[] = [],
): Promise<boolean> {
  // Can you make another word by deleting a letter from the word?
  if (word.length > 2 && deletionsRemaining > 0) {
    const dict = await import(`./dicts/${word.length - 1}`);
    for (let i = 0; i < word.length; i++) {
      const newWordLetters = [...word.split('')];
      newWordLetters.splice(i, 1);
      const newWordString = newWordLetters.join('').toUpperCase();
      if (previousWords.includes(newWordString)) continue;
      if (dict.words.has(newWordString)) return true;
    }
  }

  const dict = await import(`./dicts/${word.length}`);
  const dictPlusOne = await import(`./dicts/${word.length + 1}`);

  const wordLetters = word.split('');
  // Can you make another word by replacing any letter in the word with a letter from the letter bank?
  for (let i = 0; i < wordLetters.length; i++) {
    for (let j = 0; j < letterBank.length; j++) {
      if (letterBank[j] === wordLetters[i]) continue;
      const newWordLetters = [...wordLetters];
      newWordLetters[i] = letterBank[j];
      const newWordString = newWordLetters.join('').toUpperCase();
      if (dict.words.has(newWordString.toUpperCase())) {
        if (previousWords.includes(newWordString)) continue;
        else return true;
      }
    }
  }

  // Can you make another word by inserting a letter before or after any letter in the word?
  for (let i = 0; i < wordLetters.length + 1; i++) {
    for (let j = 0; j < letterBank.length; j++) {
      const newWordLetters = [...wordLetters];
      newWordLetters.splice(i, 0, letterBank[j]);
      const newWordString = newWordLetters.join('').toUpperCase();
      if (dictPlusOne.words.has(newWordString)) {
        if (previousWords.includes(newWordString)) continue;
        else return true;
      }
    }
  }

  return false;
}
