import clsx from 'clsx';
import Image from 'next/image';
import { BsArrowRight } from 'react-icons/bs';
import CurrentWordImg from './assets/current-word.jpg';

export default function CurrentWord({ onNext }: { onNext: () => void }) {
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
      <Image
        alt="Current word, 3 letters long, no letters selected"
        src={CurrentWordImg}
        width={1080}
        height={1920}
        className="mt-4 flex-1 object-contain overflow-hidden rounded-lg"
      />
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
