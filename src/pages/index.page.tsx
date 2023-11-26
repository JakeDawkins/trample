import React, { useCallback, useEffect, useState } from 'react';
import { words as words2 } from '../utils/dicts/2';
import { words as words3 } from '../utils/dicts/3';
import { words as words4 } from '../utils/dicts/4';
import getFullLetterBank from '../utils/getFullLetterBank';

const INITIAL_WORD = 'AXE';

function Home() {
  const todaysLetters = getFullLetterBank();
  const [validatedWord, setValidatedWord] = useState<string>(INITIAL_WORD);
  const [word, setWord] = useState(INITIAL_WORD);
  const [letterBank, setLetterBank] = useState<string[]>(
    // first 10 items of todaysLetters
    // removes from initial list
    todaysLetters.splice(0, 10),
  );
  const [allFutureLetters, setAllFutureLetters] =
    useState<string[]>(todaysLetters);

  const [selectedLetterBankIdx, setSelectedLetterBankIdx] =
    useState<number | null>(null);
  const [selectedWordLetterIdx, setSelectedWordLetterIdx] =
    useState<number | null>(null);
  const [selectedAction, setSelectedAction] =
    useState<'insert-before' | 'insert-after' | 'swap' | 'delete' | null>();

  const [score, setScore] = useState(0);

  const selectLetter = useCallback(
    (idx: number) => {
      if (selectedLetterBankIdx === idx) {
        setSelectedLetterBankIdx(null);
        return;
      }
      setSelectedLetterBankIdx(idx);
    },
    [selectedLetterBankIdx],
  );
  const selectWordLetter = useCallback(
    (idx: number) => {
      if (selectedWordLetterIdx === idx) {
        setSelectedWordLetterIdx(null);
        return;
      }
      setSelectedWordLetterIdx(idx);
    },
    [selectedWordLetterIdx],
  );
  const selectAction = useCallback(
    (action: 'insert-before' | 'insert-after' | 'swap' | 'delete') => {
      if (selectedAction === action) {
        setSelectedAction(null);
        return;
      }
      setSelectedAction(action);
    },
    [selectedAction],
  );

  useEffect(() => {
    if (selectedAction === 'delete' && selectedWordLetterIdx !== null) {
      const wordLetters = word.split('');
      wordLetters.splice(selectedWordLetterIdx, 1);
      setWord(wordLetters.join(''));
      setSelectedAction(null);
      setSelectedWordLetterIdx(null);
      setSelectedLetterBankIdx(null);
      return;
    }
    if (
      selectedAction === null ||
      selectedWordLetterIdx === null ||
      selectedLetterBankIdx === null
    ) {
      return;
    }
    if (selectedAction === 'swap') {
      const wordLetters = word.split('');
      const letterBankLetter = letterBank[selectedLetterBankIdx];
      wordLetters[selectedWordLetterIdx] = letterBankLetter;
      setWord(wordLetters.join(''));
      setSelectedAction(null);
      setSelectedWordLetterIdx(null);
      return;
    }
    if (selectedAction === 'insert-before') {
      const wordLetters = word.split('');
      const letterBankLetter = letterBank[selectedLetterBankIdx];
      wordLetters.splice(selectedWordLetterIdx, 0, letterBankLetter);
      setWord(wordLetters.join(''));
      setSelectedAction(null);
      setSelectedWordLetterIdx(null);
      setSelectedLetterBankIdx(null);
      return;
    }
    if (selectedAction === 'insert-after') {
      const wordLetters = word.split('');
      const letterBankLetter = letterBank[selectedLetterBankIdx];
      wordLetters.splice(selectedWordLetterIdx + 1, 0, letterBankLetter);
      setWord(wordLetters.join(''));
      setSelectedAction(null);
      setSelectedWordLetterIdx(null);
      setSelectedLetterBankIdx(null);
      return;
    }
  }, [selectedAction, selectedWordLetterIdx, selectedLetterBankIdx]);

  const popToLetterBankPosition = useCallback(
    (i: number) => {
      const futureLetters = [...allFutureLetters];
      const letter = futureLetters.pop();
      setAllFutureLetters(futureLetters);

      if (letter) {
        letterBank[i] = letter;
        setLetterBank(letterBank);
      } else {
        setLetterBank(letterBank.filter((_, index) => index !== i));
      }

      setSelectedLetterBankIdx(null);
    },
    [allFutureLetters, letterBank],
  );

  const checkWord = useCallback(async () => {
    if (word.length < 2 || word.length > 15) {
      setWord(validatedWord);
      return false;
    }

    // these shorter words for the initial set of letters 2/3/4, we preload the
    // dicts to make checking instant
    if (word.length === 3) {
      const valid = words3.has(word.toUpperCase());
      if (valid) {
        setValidatedWord(word);
        if (selectedLetterBankIdx)
          popToLetterBankPosition(selectedLetterBankIdx);
        setScore(score + 1);
        return true;
      } else {
        undo();
        // setWord(validatedWord);
        return false;
      }
    }
    if (word.length === 2) {
      // don't need to preload the dict for len === 1 since that's an invalid len
      const valid = words2.has(word.toUpperCase());
      if (valid) {
        setValidatedWord(word);
        if (selectedLetterBankIdx)
          popToLetterBankPosition(selectedLetterBankIdx);
        setScore(score + 1);
        return true;
      } else {
        // setWord(validatedWord);
        undo();
        return false;
      }
    }
    if (word.length === 4) {
      // use the preloaded 4-letter dict, but kick off preload for larger dict
      const _wordsPlus = import(`../utils/dicts/${word.length + 1}`);
      const valid = words4.has(word.toUpperCase());
      if (valid) {
        setValidatedWord(word);
        if (selectedLetterBankIdx)
          popToLetterBankPosition(selectedLetterBankIdx);
        setScore(score + 1);
        return true;
      } else {
        // setWord(validatedWord);
        undo();
        return false;
      }
    }

    // just used for preloading, not for checking
    const _wordsMinus = import(`../utils/dicts/${word.length - 1}`);
    const _wordsPlus = import(`../utils/dicts/${word.length + 1}`);
    const dict: Set<string> | undefined = (
      await import(`../utils/dicts/${word.length}`)
    )?.words;

    const valid = dict?.has(word.toUpperCase());
    if (valid) {
      setValidatedWord(word);
      setScore(score + 1);
      return true;
    } else {
      undo();
      // setWord(validatedWord);
      return false;
    }
  }, [word, allFutureLetters, score]);

  const undo = useCallback(() => {
    if (word === validatedWord) {
      return;
    }
    setWord(validatedWord);
    setSelectedLetterBankIdx(null);
    setSelectedWordLetterIdx(null);
    setSelectedAction(null);
  }, [word, validatedWord]);

  const wordLetters = word.split('');
  return (
    <div className="w-full flex flex-col items-center">
      <h2>Score: {score}</h2>
      <div className="mt-8 -mr-2">
        <ul className="block">
          {wordLetters.map((letter, idx) => (
            <li key={idx} className="inline-block">
              <LetterButton
                selected={selectedWordLetterIdx === idx}
                onClick={() => selectWordLetter(idx)}
              >
                {letter}
              </LetterButton>
            </li>
          ))}
        </ul>
      </div>
      {selectedWordLetterIdx !== null ? (
        <div className="mt-4 flex flex-row justify-center">
          <button
            className={`mr-4 px-2 border border-black rounded ${
              selectedAction === 'insert-before'
                ? 'bg-[#008000] text-white font-bold border-0'
                : ''
            }`}
            onClick={() => selectAction('insert-before')}
          >
            Add before
          </button>
          <button
            className={`mr-4 px-2 border border-black rounded ${
              selectedAction === 'swap'
                ? 'bg-[#008000] text-white font-bold border-0'
                : ''
            }`}
            onClick={() => selectAction('swap')}
          >
            Swap
          </button>
          <button
            className={`px-2 border border-black rounded mr-4 ${
              selectedAction === 'insert-after'
                ? 'bg-[#008000] text-white font-bold border-0'
                : ''
            }`}
            onClick={() => selectAction('insert-after')}
          >
            Add after
          </button>
          <button
            className={`px-2 border border-black rounded focus:outline-[#800000] ${
              selectedAction === 'delete'
                ? 'bg-[#800000] text-white font-bold border-0'
                : ''
            }`}
            onClick={() => selectAction('delete')}
          >
            Delete
          </button>
        </div>
      ) : null}

      <div className="flex flex-row flex-wrap mt-8 max-w-[300px] -mr-4">
        <ul>
          {letterBank.map((letter, idx) => (
            <li key={idx} className="inline-block">
              <LetterButton
                selected={selectedLetterBankIdx === idx}
                onClick={() => selectLetter(idx)}
              >
                {letter}
              </LetterButton>
            </li>
          ))}
        </ul>
      </div>

      {word !== validatedWord ? (
        <div className="mt-8">
          <button
            className="px-2 h-10 border border-black rounded mr-4"
            onClick={() => undo()}
          >
            Undo
          </button>
          <button
            className="px-2 h-10 border border-black rounded"
            onClick={() => checkWord()}
          >
            Check
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default Home;

const LetterButton = ({ onClick, children, selected }) => {
  return (
    <button
      className={`h-10 w-10 min-w-[40px] mr-4 mb-4 text-xl text-center border border-black rounded flex justify-center items-center ${
        selected ? 'bg-[#008000] text-white font-bold border-0' : ''
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
