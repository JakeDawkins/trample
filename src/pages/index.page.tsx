import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { words as words2 } from '../utils/dicts/2';
import { words as words3 } from '../utils/dicts/3';
import { words as words4 } from '../utils/dicts/4';
import getFullLetterBank, { pointsForWord } from '../utils/getFullLetterBank';
import {
  BsArrowDownUp,
  BsArrowLeft,
  BsArrowRight,
  BsTrash3,
} from 'react-icons/bs';
import ScoreAndHistory from '../components/scoreAndHistory';
import LetterButton from '../components/letterButton';
import clsx from 'clsx';
import Modal from '../components/modal';
import { canMakeWord } from '../utils/evaluation';
import { endGame, getStats, isGameOver } from '../utils/endGame';
import GameOver from '../components/gameOver';
import getDayNumber from '../utils/getDayNumber';
import getTodaysWord from '../utils/getTodaysWord';

getDayNumber();

function Home() {
  // use this to track the word that's being played. If the game day is an old
  // one, we'll need to load a new word and reset the game
  const [currentGameDay, setCurrentGameDay] = useState(getDayNumber());
  const [showHelpModal, setShowHelpModal] = useState(false);
  const todaysLetters = getFullLetterBank();
  const [word, setWord] = useState(getTodaysWord());
  const [letterBank, setLetterBank] = useState<string[]>(
    // first 10 items of todaysLetters
    // removes from initial list
    todaysLetters.splice(0, 10),
  );
  const [pastWords, setPastWords] = useState<string[]>([word]);
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
  const [deletionsRemaining, setDeletionsRemaining] = useState(2);
  const [gameOver, setGameOver] = useState<boolean | undefined>(undefined);
  const [forfeit, setForfeit] = useState(false);
  const longestWord = useMemo(() => {
    return [...pastWords].sort((a, b) => b.length - a.length)?.[0]?.length || 0;
  }, [pastWords]);

  const resetGame = useCallback(() => {
    window.location.reload();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentGameDay !== getDayNumber()) {
        resetGame();
      }
    }, 5000);
    return clearInterval(interval);
  }, [currentGameDay]);

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const helpDismissed = localStorage.getItem('trample-help-dismissed');
      if (!helpDismissed) {
        setShowHelpModal(true);
      }
    }
  }, []);

  const dismissHelpModal = () => {
    localStorage.setItem('trample-help-dismissed', 'true');
    setShowHelpModal(false);
  };

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
      checkWord(wordLetters.join(''), true).then((valid) => {
        if (valid) {
          setDeletionsRemaining(deletionsRemaining - 1);
        }
      });
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
    async (wordToCheck: string, allowPreviousWords?: boolean) => {
      setErrorMessage(undefined);

      if (wordToCheck.length < 2 || wordToCheck.length > 15) {
        setSelectedLetterBankIdx(null);
        setErrorMessage('Word too short!');
        return false;
      }

      if (!allowPreviousWords && pastWords.includes(wordToCheck)) {
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
          setScore(score + pointsForWord(wordToCheck));
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
          setScore(score + pointsForWord(wordToCheck));
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
          setScore(score + pointsForWord(wordToCheck));
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
        setScore(score + pointsForWord(wordToCheck));
        setPastWords([...pastWords, wordToCheck]);
        setSelectedLetterBankIdx(null);
        return true;
      } else {
        setErrorMessage(`"${wordToCheck}" is not a word!`);
        setSelectedLetterBankIdx(null);
        return false;
      }
    },
    [allFutureLetters, score, selectedLetterBankIdx],
  );

  const endGameStats = useMemo(() => {
    if (!gameOver) return;
    return getStats();
  }, [gameOver]);

  useEffect(() => {
    // Auto-end game if no more words can be made
    canMakeWord(word, letterBank, deletionsRemaining, pastWords).then(
      (canMakeWord) => {
        if (canMakeWord) return;
        setGameOver(true);
        // save score
        endGame({ score, longestWord });
      },
    );

    // already completed one game today
    setGameOver(isGameOver());
  }, [word, letterBank, isGameOver, pastWords, deletionsRemaining, score]);

  const handleForfeit = useCallback(() => {
    setGameOver(true);
    setForfeit(true);
    endGame({ score, longestWord });
  }, [score, longestWord]);

  if (typeof gameOver === 'undefined') {
    return;
  }

  if ((gameOver && score) || endGameStats?.score) {
    return (
      <GameOver
        score={score || endGameStats?.score || 0}
        bestScore={endGameStats?.bestScore}
        numWords={endGameStats?.numWords}
        longestWord={endGameStats?.longestWord}
        forfeit={forfeit}
      />
    );
  }

  const wordLetters = word.split('');
  return (
    <>
      <Modal
        isOpen={showHelpModal}
        handleClose={dismissHelpModal}
        title="How to play"
        description="A brief intro to trample"
      >
        <p className="text-lg font-bold">The Rules</p>
        <ol className="list-decimal list-inside">
          <li>The word at the top is your "active" word</li>
          <li>
            Each turn, you pick one letter from the "active" word and replace it
            with a letter from the letter bank, insert a letter before or after
            it, or delete it.
          </li>
          <li>You can only delete 2 letters per game</li>
          <li>You only get to take one action per turn</li>
          <li>Every turn must result in a new valid word</li>
          <li>
            You can only reuse a previous word if you make it by deleting a
            letter
          </li>
          <li>The game ends when you can't make any new words</li>
        </ol>

        <p>
          There is one starting word and one letter bank per day, so make it
          count!
        </p>
        <button
          className={
            'bg-green-700 hover:bg-green-800 text-white rounded mt-4 font-bold py-2'
          }
          onClick={dismissHelpModal}
        >
          Let's play!
        </button>
      </Modal>
      <div className="w-full flex flex-col items-center">
        <header className="flex justify-between w-full mt-4 mb-4 px-4">
          <button
            className={`rounded flex items-center justify-center border border-black px-2`}
            onClick={() => setShowHelpModal(true)}
          >
            Help
          </button>
          <h1 className="text-4xl font-bold">Trample</h1>
          <button
            className={`rounded flex items-center justify-center border border-black px-2`}
            onClick={handleForfeit}
          >
            Forfeit
          </button>
        </header>
        <ScoreAndHistory score={score} history={pastWords} />

        <div className="mt-8">
          <ul className="block">
            {wordLetters.map((letter, idx) => (
              <li key={idx} className="inline-block">
                <LetterButton
                  selected={selectedWordLetterIdx === idx}
                  onClick={() => selectWordLetter(idx)}
                  last={idx === wordLetters.length - 1}
                  letter={letter}
                />
              </li>
            ))}
          </ul>
        </div>
        {selectedWordLetterIdx !== null ? (
          <div className="mt-4 flex flex-row justify-center">
            <button
              className={`h-10 w-10 min-w-[40px] mr-4 mb-4 rounded flex items-center justify-center ${
                selectedAction === 'insert-before'
                  ? 'bg-green-700'
                  : 'bg-white border border-black'
              }`}
              onClick={() => selectAction('insert-before')}
              aria-label="Insert letter before"
              onDoubleClick={(e) => e.preventDefault()}
            >
              <BsArrowLeft
                className={`h-6 w-6 ${
                  selectedAction === 'insert-before'
                    ? 'fill-white'
                    : 'fill-black'
                }`}
              />
            </button>
            <button
              className={`h-10 w-10 min-w-[40px] mr-4 mb-4 rounded flex items-center justify-center ${
                selectedAction === 'swap'
                  ? 'bg-green-700'
                  : 'bg-white border border-black'
              }`}
              onClick={() => selectAction('swap')}
              aria-label="Swap letter"
              onDoubleClick={(e) => e.preventDefault()}
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
                  ? 'bg-green-700'
                  : 'bg-white border border-black'
              }`}
              onClick={() => selectAction('insert-after')}
              aria-label="Insert letter after"
            >
              <BsArrowRight
                className={`h-6 w-6 ${
                  selectedAction === 'insert-after'
                    ? 'fill-white'
                    : 'fill-black'
                }`}
              />
            </button>
            <button
              className={clsx(
                `relative h-10 w-10 min-w-[40px] mb-4 rounded bg-red-800 flex items-center justify-center`,
                deletionsRemaining === 0 && 'bg-gray-400',
              )}
              onClick={() => selectAction('delete')}
              aria-label={`Delete selected letter. ${deletionsRemaining} deletions remaining.`}
              disabled={deletionsRemaining === 0}
            >
              <div
                className={clsx(
                  'w-5 h-5 flex items-center justify-center absolute -top-2 -right-2 rounded-full border border-red-800',
                  deletionsRemaining === 0
                    ? 'bg-red-800 text-white font-bold'
                    : 'bg-white',
                )}
              >
                {deletionsRemaining}
              </div>
              <BsTrash3 className="fill-white h-6 w-6" />
            </button>
          </div>
        ) : (
          <div className="h-10 mt-4 mb-4 text-red-800 font-bold">
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
                  letter={letter}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Home;
