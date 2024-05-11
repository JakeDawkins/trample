import clsx from 'clsx';
import { BsArrowRight } from 'react-icons/bs';
import LetterButton from '../letterButton';
import { useState } from 'react';

export default function CurrentWord({ onNext }: { onNext: () => void }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>();

  return (
    <div className="flex flex-col items-start lg:items-center h-full">
      <h1 className="text-xl font-bold flex-0 self-center">Current word</h1>
      <p className="mt-4 flex-0">
        Each day, you&apos;re given a new 3-letter word at the top of the screen
        to start with. We&apos;ll call this the “current word”.
      </p>
      <p className="mt-4 flex-0">
        You can tap any letter in the current word to perform an action on it
        (we&apos;ll talk about that in a second)
      </p>
      <div className="flex-1 w-full flex flex-col items-center justify-center -mr-4">
        <div className={clsx('flex w-full flex-col items-center mt-4 p-4')}>
          <div className="flex flex-row">
            <LetterButton
              letter="C"
              onClick={() => setSelectedIndex(0)}
              selected={selectedIndex === 0}
            />
            <LetterButton
              letter="O"
              onClick={() => setSelectedIndex(1)}
              selected={selectedIndex === 1}
            />
            <LetterButton
              letter={'G'}
              onClick={() => setSelectedIndex(2)}
              selected={selectedIndex === 2}
            />
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        className={clsx(
          'flex-0 flex items-center justify-center',
          'mt-4 px-2 py-1 border border-black hover:bg-black hover:text-white border-b-2 border-r-2 rounded-lg  w-full max-w-[480px]',
        )}
      >
        Next
        <BsArrowRight className="ml-2 inline-block" />
      </button>
    </div>
  );
}
