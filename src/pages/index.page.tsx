import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { canMakeWord } from '../utils/evaluation';
import { endGame, getStats, isGameOver } from '../utils/endGame';
import GameOver from '../components/gameOver';
import getDayNumber from '../utils/getDayNumber';
import getTodaysWord from '../utils/getTodaysWord';
import Head from 'next/head';
import GettingStarted from '../components/GettingStarted';
import Button from '../components/button';
import { useRouter } from 'next/router';
import * as Sentry from '@sentry/nextjs';
import mixpanel from 'mixpanel-browser';
import { loadGameState, saveGameState } from '../utils/localStorage';
import ActionButton, { Action } from '../components/ActionButton';
import { HELP_DISMISSED_KEY, STATS_KEY } from '../utils/constants';

function Home() {
  const router = useRouter();
  // use this to track the word that's being played. If the game day is an old
  // one, we'll need to load a new word and reset the game
  const currentGameDay = useMemo(() => getDayNumber(), []);
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
  const [forfeit, setForfeit] = useState<boolean>(false);
  const [possibleWord, setPossibleWord] = useState<undefined | string>();
  const longestWord = useMemo(() => {
    return [...pastWords].sort((a, b) => b.length - a.length)?.[0]?.length || 0;
  }, [pastWords]);

  const resetGame = useCallback(() => {
    window.location.reload();
  }, []);

  // if the url param includes ?reset=true, reset the game stats
  useEffect(() => {
    if (router.isReady && router?.query?.reset) {
      localStorage.removeItem(STATS_KEY);
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentGameDay !== getDayNumber()) {
        resetGame();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [currentGameDay]);

  useEffect(() => {
    // make sure the +1/+0 (initial)/-1 dicts are preloaded
    import(`../utils/dicts/${word.length + 1}`);
    import(`../utils/dicts/${word.length}`);
    import(`../utils/dicts/${word.length - 1}`);
  }, [word]);

  // save game state in case of reloads
  useEffect(() => {
    if (pastWords.length > 1) {
      saveGameState({
        word,
        score,
        pastWords,
        deletionsRemaining,
      });
    }
  }, [word, score, pastWords, deletionsRemaining]);

  // load game state if present
  useEffect(() => {
    const savedState = loadGameState();
    if (savedState) {
      setWord(savedState.word);
      setPastWords(savedState.pastWords);
      setScore(savedState.score);
      setDeletionsRemaining(savedState.deletionsRemaining);
    }
  }, []);

  useEffect(() => {
    // after initial load, load in the rest of the dictionaries
    if (typeof localStorage !== 'undefined') {
      const helpDismissed = localStorage.getItem(HELP_DISMISSED_KEY);
      if (!helpDismissed) {
        setShowHelpModal(true);
      }
    }
  }, []);

  const dismissHelpModal = () => {
    localStorage.setItem(HELP_DISMISSED_KEY, 'true');
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
    if (selectedAction) setForfeit(false);
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
      const dict: Set<string> | undefined = (
        await import(`../utils/dicts/${wordToCheck.length}`)
      )?.words;
      mixpanel.track('CHECK_WORD_START', { wordToCheck, pastWords });
      if (!dict) {
        Sentry.captureException('dict loading failed');
        alert(
          'An error occurred when loading the dictionary. Please reload the page.',
        );
        return;
      }

      const applyValidWord = () => {
        mixpanel.track('CHECK_WORD_VALID', { wordToCheck, pastWords });
        setWord(wordToCheck);
        if (selectedLetterBankIdx !== null)
          popToLetterBankPosition(selectedLetterBankIdx);
        setScore(score + pointsForWord(wordToCheck));
        setPastWords([...pastWords, wordToCheck]);
        setSelectedLetterBankIdx(null);
      };

      const handleInvalidWord = () => {
        setErrorMessage(`"${wordToCheck}" is not a word!`);
        setSelectedLetterBankIdx(null);
        return false;
      };

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

      const valid = dict.has(wordToCheck.toUpperCase());
      if (valid) {
        applyValidWord();
        return true;
      } else {
        return handleInvalidWord();
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
      ([canMakeWord, possible]) => {
        if (canMakeWord) {
          setPossibleWord(possible);
          return;
        }
        setGameOver(true);
        // save score
        endGame({ score, longestWord, pastWords });
      },
    );

    // already completed one game today
    setGameOver(isGameOver());
  }, [word, letterBank, isGameOver, pastWords, deletionsRemaining, score]);

  const handleForfeit = useCallback(() => {
    if (score === 0) return;
    mixpanel.track('FORFEIT', { pastWords });
    setGameOver(true);
    setForfeit(true);
    endGame({ score, longestWord, pastWords });
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
        possibleWord={possibleWord}
      />
    );
  }

  const wordLetters = word.split('');
  return (
    <>
      <Head>
        <title>Trample #{getDayNumber()}</title>
      </Head>

      <GettingStarted isOpen={showHelpModal} handleClose={dismissHelpModal} />
      <div className="w-full flex flex-col items-center">
        <header className="flex justify-between w-full mt-4 mb-4 sm:px-2 md:px-4">
          <Button onClick={() => setShowHelpModal(true)}>Help</Button>
          <h1 className="sm:text-3xl md:text-4xl font-bold">
            Trample{' '}
            <span className="text-rainbow text-base align-text-top sm:-ml-[6px] md:-ml-2">
              #{getDayNumber()}
            </span>
          </h1>
          <button
            className={clsx(
              `rounded flex items-center justify-center border border-r-2 border-b-2 border-black px-2`,
              score === 0 && 'border-gray-400 text-gray-400 cursor-not-allowed',
            )}
            onClick={handleForfeit}
            disabled={score === 0}
          >
            Forfeit
          </button>
        </header>
        <ScoreAndHistory score={score} history={pastWords} />

        {/* active word */}
        <div className="mt-8 sm:p-2 md:p-4 sm:pt-0 md:pt-0">
          <ul className="block mt-2">
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

        {/* Action Buttons */}
        {selectedWordLetterIdx !== null ? (
          <div className="mt-4 flex flex-row justify-center">
            {(['insert-before', 'swap', 'insert-after'] as Action[]).map(
              (action) => {
                return (
                  <ActionButton
                    key={action}
                    action={action}
                    active={selectedAction === action}
                    onClick={() => selectAction(action)}
                  />
                );
              },
            )}

            {deletionsRemaining ? (
              <button
                className={clsx(
                  `relative h-10 w-10 min-w-[40px] mb-4 rounded bg-red-600 flex items-center justify-center`,
                  deletionsRemaining === 0 && 'bg-gray-400',
                )}
                onClick={() => selectAction('delete')}
                aria-label={`Delete selected letter. ${deletionsRemaining} deletions remaining.`}
                disabled={deletionsRemaining === 0}
              >
                <div
                  className={clsx(
                    'w-5 h-5 flex items-center justify-center absolute -top-2 -right-2 rounded-full border  border-red-600 bg-white',
                    deletionsRemaining === 0
                      ? 'bg-red-600 text-white font-bold'
                      : 'bg-white',
                  )}
                >
                  {deletionsRemaining}
                </div>
                <BsTrash3 className="fill-white h-6 w-6" />
              </button>
            ) : null}
          </div>
        ) : (
          <div className="h-10 mt-4 mb-4 text-red-800 font-bold">
            {errorMessage || ''}
          </div>
        )}
        <div className="flex flex-row flex-wrap mt-8 max-w-[300px] -mr-8">
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
