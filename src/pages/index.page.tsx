import React, { useCallback, useEffect, useState } from 'react';
import { words as words2 } from '../utils/dicts/2';
import { words as words3 } from '../utils/dicts/3';
import { words as words4 } from '../utils/dicts/4';
import getFullLetterBank from '../utils/getFullLetterBank';
import {
  BsArrowDownUp,
  BsArrowLeft,
  BsArrowLeftRight,
  BsArrowLeftSquareFill,
  BsArrowRight,
  BsArrowRightSquareFill,
  BsArrowUpSquareFill,
  BsTrash3,
} from 'react-icons/bs';
import ScoreAndHistory from '../components/scoreAndHistory';

const INITIAL_WORD = 'AXE';

function Home() {
  const todaysLetters = getFullLetterBank();
  const [word, setWord] = useState(INITIAL_WORD);
  const [letterBank, setLetterBank] = useState<string[]>(
    // first 10 items of todaysLetters
    // removes from initial list
    todaysLetters.splice(0, 10),
  );
  const [pastWords, setPastWords] = useState<string[]>([]);
  const [allFutureLetters, setAllFutureLetters] =
    useState<string[]>(todaysLetters);
  const [selectedLetterBankIdx, setSelectedLetterBankIdx] =
    useState<number | null>(null);
  const [selectedWordLetterIdx, setSelectedWordLetterIdx] =
    useState<number | null>(null);
  const [selectedAction, setSelectedAction] =
    useState<'insert-before' | 'insert-after' | 'swap' | 'delete' | null>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [score, setScore] = useState(0);

  const selectLetter = useCallback(
    (idx: number) => {
      if (selectedLetterBankIdx === idx) {
        setSelectedLetterBankIdx(null);
        return;
      }
      if (idx !== null) {
        setSelectedLetterBankIdx(idx);
      } else return;
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
      checkWord(wordLetters.join(''));
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
      checkWord(wordLetters.join(''));
      setSelectedAction(null);
      setSelectedWordLetterIdx(null);
      return;
    }
    if (selectedAction === 'insert-before') {
      const wordLetters = word.split('');
      const letterBankLetter = letterBank[selectedLetterBankIdx];
      wordLetters.splice(selectedWordLetterIdx, 0, letterBankLetter);
      checkWord(wordLetters.join(''));
      setSelectedAction(null);
      setSelectedWordLetterIdx(null);
      setSelectedLetterBankIdx(null);
      return;
    }
    if (selectedAction === 'insert-after') {
      const wordLetters = word.split('');
      const letterBankLetter = letterBank[selectedLetterBankIdx];
      wordLetters.splice(selectedWordLetterIdx + 1, 0, letterBankLetter);
      checkWord(wordLetters.join(''));
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

  const checkWord = useCallback(
    async (wordToCheck: string) => {
      setErrorMessage(undefined);

      if (wordToCheck.length < 2 || wordToCheck.length > 15) {
        setSelectedLetterBankIdx(null);
        setErrorMessage('Word too short!');
        return false;
      }

      if (pastWords.includes(wordToCheck)) {
        setErrorMessage(`You've already used "${wordToCheck}"`);
        setSelectedLetterBankIdx(null);
        return false;
      }

      // these shorter words for the initial set of letters 2/3/4, we preload the
      // dicts to make checking instant
      if (wordToCheck.length === 3) {
        const valid = words3.has(wordToCheck.toUpperCase());
        if (valid) {
          setWord(wordToCheck);
          if (selectedLetterBankIdx)
            popToLetterBankPosition(selectedLetterBankIdx);
          setScore(score + 1);
          setPastWords([...pastWords, wordToCheck]);
          setSelectedLetterBankIdx(null);
          return true;
        } else {
          setErrorMessage(`"${wordToCheck}" is not a word!`);
          setSelectedLetterBankIdx(null);
          return false;
        }
      }
      if (wordToCheck.length === 2) {
        // don't need to preload the dict for len === 1 since that's an invalid len
        const valid = words2.has(wordToCheck.toUpperCase());
        if (valid) {
          setWord(wordToCheck);
          if (selectedLetterBankIdx)
            popToLetterBankPosition(selectedLetterBankIdx);
          setScore(score + 1);
          setPastWords([...pastWords, wordToCheck]);
          setSelectedLetterBankIdx(null);
          return true;
        } else {
          setErrorMessage(`"${wordToCheck}" is not a word!`);
          setSelectedLetterBankIdx(null);
          return false;
        }
      }
      if (wordToCheck.length === 4) {
        // use the preloaded 4-letter dict, but kick off preload for larger dict
        const _wordsPlus = import(`../utils/dicts/${wordToCheck.length + 1}`);
        const valid = words4.has(wordToCheck.toUpperCase());
        if (valid) {
          setWord(wordToCheck);
          if (selectedLetterBankIdx)
            popToLetterBankPosition(selectedLetterBankIdx);
          setScore(score + 1);
          setPastWords([...pastWords, wordToCheck]);
          setSelectedLetterBankIdx(null);
          return true;
        } else {
          setErrorMessage(`"${wordToCheck}" is not a word!`);
          setSelectedLetterBankIdx(null);
          return false;
        }
      }

      // just used for preloading, not for checking
      const _wordsMinus = import(`../utils/dicts/${wordToCheck.length - 1}`);
      const _wordsPlus = import(`../utils/dicts/${wordToCheck.length + 1}`);
      const dict: Set<string> | undefined = (
        await import(`../utils/dicts/${wordToCheck.length}`)
      )?.words;

      const valid = dict?.has(wordToCheck.toUpperCase());
      if (valid) {
        setWord(wordToCheck);
        setScore(score + 1);
        setPastWords([...pastWords, wordToCheck]);
        setSelectedLetterBankIdx(null);
        return true;
      } else {
        setErrorMessage(`"${wordToCheck}" is not a word!`);
        setSelectedLetterBankIdx(null);
        return false;
      }
    },
    [allFutureLetters, score],
  );

  const wordLetters = word.split('');
  return (
    <div className="w-full flex flex-col items-center">
      <ScoreAndHistory score={score} history={pastWords} />

      <div className="mt-8 -mr-2">
        <ul className="block">
          {wordLetters.map((letter, idx) => (
            <li key={idx} className="inline-block">
              <LetterButton
                selected={selectedWordLetterIdx === idx}
                onClick={() => selectWordLetter(idx)}
                last={idx === wordLetters.length - 1}
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
            className={`h-10 w-10 min-w-[40px] mr-4 mb-4 rounded flex items-center justify-center ${
              selectedAction === 'insert-before'
                ? 'bg-[#008000]'
                : 'bg-white border border-black'
            }`}
            onClick={() => selectAction('insert-before')}
            aria-label="Insert letter before"
          >
            <BsArrowLeft
              className={`h-6 w-6 ${
                selectedAction === 'insert-before' ? 'fill-white' : 'fill-black'
              }`}
            />
          </button>
          <button
            className={`h-10 w-10 min-w-[40px] mr-4 mb-4 rounded flex items-center justify-center ${
              selectedAction === 'swap'
                ? 'bg-[#008000]'
                : 'bg-white border border-black'
            }`}
            onClick={() => selectAction('swap')}
            aria-label="Swap letter"
          >
            <BsArrowDownUp
              className={`h-6 w-6 ${
                selectedAction === 'swap' ? 'fill-white' : 'fill-black'
              }`}
            />
          </button>
          <button
            className={`h-10 w-10 min-w-[40px] mr-4 mb-4 rounded flex items-center justify-center ${
              selectedAction === 'insert-after'
                ? 'bg-[#008000]'
                : 'bg-white border border-black'
            }`}
            onClick={() => selectAction('insert-after')}
            aria-label="Insert letter after"
          >
            <BsArrowRight
              className={`h-6 w-6 ${
                selectedAction === 'insert-after' ? 'fill-white' : 'fill-black'
              }`}
            />
          </button>
          <button
            className={`h-10 w-10 min-w-[40px] mb-4 rounded bg-[#800000] flex items-center justify-center`}
            onClick={() => selectAction('delete')}
            aria-label="Delete selected letter"
          >
            <BsTrash3 className="fill-white h-6 w-6" />
          </button>
        </div>
      ) : (
        <div className="h-10 mt-4 mb-4 text-[#800000] font-bold">
          {errorMessage || ''}
        </div>
      )}

      <div className="flex flex-row flex-wrap mt-8 max-w-[300px] -mr-4">
        <ul>
          {letterBank.map((letter, idx) => (
            <li key={idx} className="inline-block">
              <LetterButton
                selected={selectedLetterBankIdx === idx}
                onClick={() => selectLetter(idx)}
                disabled={selectedWordLetterIdx === null}
              >
                {letter}
              </LetterButton>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;

const LetterButton = ({
  onClick,
  children,
  selected,
  disabled,
  last,
}: {
  onClick: () => void;
  children: string;
  selected: boolean;
  disabled?: boolean;
  last?: boolean;
}) => {
  return (
    <button
      className={`h-10 w-10 min-w-[40px] ${
        last ? '' : 'mr-4'
      } mb-4 text-xl text-center border border-black rounded flex justify-center items-center ${
        selected ? 'bg-[#008000] text-white font-bold border-0' : ''
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
