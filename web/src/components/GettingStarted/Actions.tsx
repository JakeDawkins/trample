import clsx from 'clsx';
import Image from 'next/image';
import { BsArrowRight } from 'react-icons/bs';
import ActionsImg from './assets/actions-annotated.png';
import ActionButton, { Action } from '../ActionButton';

export default function Actions({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-start lg:items-center h-full">
      <h1 className="text-xl font-bold flex-0 self-center">Actions</h1>
      <p className="mt-4 flex-0">
        You can replace any letter in your current word, insert a new letter
        before or after any current letter, or delete a letter from the current
        word.
      </p>
      <p className="mt-4 flex-0 bg-red-200 p-2 rounded-lg text-sm">
        <strong>But be careful!</strong> You can only delete 2 letters per game,
        then that option disappears. Try to only use it when you have to.
      </p>

      <Image
        alt="Home screen"
        src={ActionsImg}
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
