import clsx from 'clsx';
import {
  Bs1Circle,
  Bs2Circle,
  Bs3Circle,
  BsArrowRight,
  BsCheckCircle,
  BsTrash3,
} from 'react-icons/bs';
import LetterButton from '../letterButton';
import { useState } from 'react';
import ActionButton, { Action } from '../ActionButton';

export default function Example({ onNext }: { onNext: () => void }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>();
  const [selectedLetterBankIndex, setSelectedLetterBankIndex] =
    useState<number | null>();
  const [selectedAction, setSelectedAction] = useState<string>();

  const selectLetter = (index: number) => {
    if (selectedIndex !== 2) {
      setSelectedIndex(index);
    }
  };

  const selectAction = (action: string) => {
    if (selectedAction !== 'swap') {
      setSelectedAction(action);
    }
  };

  const selectLetterBankLetter = (index: number) => {
    if (selectedLetterBankIndex !== 4) {
      setSelectedLetterBankIndex(index);
    }
  };

  const exampleComplete =
    selectedIndex === 2 &&
    selectedAction === 'swap' &&
    selectedLetterBankIndex === 4;

  return (
    <div className="flex flex-col items-start lg:items-center h-full">
      <h1 className="text-xl font-bold flex-0 self-center">
        Let&apos;s try an example!
      </h1>
      <div className="relative">
        <div className="mt-4 flex-0 flex flex-row items-center">
          {selectedIndex === 2 ? (
            <BsCheckCircle className="text-green-600 mr-2 w-6 h-6 shrink-0" />
          ) : (
            <Bs1Circle className="text-black mr-2 w-6 h-6 shrink-0" />
          )}
          <p className="">
            The starting word here is "COG". Try selecting the{' '}
            <strong>G</strong>
          </p>
        </div>
        <div
          className={clsx(
            'flex w-full flex-col items-center mt-4 p-4',
            exampleComplete && 'rainbow-box',
          )}
        >
          <div className="flex flex-row">
            <LetterButton
              letter="C"
              onClick={() => selectLetter(0)}
              selected={selectedIndex === 0 && !exampleComplete}
            />
            <LetterButton
              letter="O"
              onClick={() => selectLetter(1)}
              selected={selectedIndex === 1 && !exampleComplete}
            />
            <LetterButton
              letter={exampleComplete ? 'N' : 'G'}
              onClick={() => selectLetter(2)}
              selected={selectedIndex === 2 && !exampleComplete}
            />
          </div>
          {exampleComplete && (
            <p className="leading-none">You did it! The word is now "CON"</p>
          )}
        </div>
      </div>

      <div className="flex items-center mt-4">
        {selectedAction !== 'swap' ? (
          <Bs2Circle className="text-black mr-2 w-6 h-6 shrink-0 inline-block" />
        ) : (
          <BsCheckCircle className="text-green-600 mr-2 w-6 h-6 shrink-0 inline-block" />
        )}
        <p className="flex-0 ">
          Then, select the <strong>replace</strong> action
        </p>
      </div>

      <div className="flex mt-8 w-full justify-center -mr-8">
        {(['insert-before', 'swap', 'insert-after'] as Action[]).map(
          (action) => {
            return (
              <ActionButton
                key={action}
                action={action}
                active={selectedAction === action && !exampleComplete}
                onClick={() => selectAction(action)}
              />
            );
          },
        )}
        <button
          className={clsx(
            `relative h-10 w-10 min-w-[40px] mb-4 rounded bg-red-600 flex items-center justify-center mr-4`,
          )}
          onClick={() => {}}
          aria-label={`Delete selected letter. 2 deletions remaining.`}
        >
          <div
            className={clsx(
              'w-5 h-5 flex items-center justify-center absolute -top-2 -right-2 rounded-full border  border-red-600 bg-white',
              'bg-white',
            )}
          >
            {2}
          </div>
          <BsTrash3 className="fill-white h-6 w-6" />
        </button>
      </div>

      <div className="flex items-center mt-4 ">
        {selectedLetterBankIndex !== 4 ? (
          <Bs3Circle className="text-black mr-2 w-6 h-6 shrink-0 inline-block" />
        ) : (
          <BsCheckCircle className="text-green-600 mr-2 w-6 h-6 shrink-0 inline-block" />
        )}
        <p className="flex-0 ">
          Finally, select the <strong>N</strong> to replace the G.
        </p>
      </div>

      <div className="flex w-full justify-center">
        <div className="flex flex-row flex-wrap mt-8 max-w-[300px] -mr-8">
          {['G', 'A', 'P', 'B', 'N', 'O', 'Q', 'A', 'H', 'R'].map(
            (letter, index) => {
              return (
                <LetterButton
                  key={index}
                  letter={letter}
                  onClick={() => selectLetterBankLetter(index)}
                  selected={
                    selectedLetterBankIndex === index && !exampleComplete
                  }
                />
              );
            },
          )}
        </div>
      </div>

      <div className="flex-1" />
      <button
        onClick={onNext}
        className={clsx(
          'flex-0 flex items-center justify-center',
          'mt-4 px-2 py-1 border border-black  border-b-2 border-r-2 rounded-lg  w-full max-w-[480px]',
          !exampleComplete
            ? 'cursor-not-allowed'
            : 'hover:bg-black hover:text-white',
          'disabled:opacity-60',
        )}
        disabled={!exampleComplete}
      >
        Next
        <BsArrowRight className="ml-2 inline-block" />
      </button>
      {!exampleComplete && (
        <p className="text-sm text-gray-800">
          Complete the steps above to continue
        </p>
      )}
    </div>
  );
}
