import clsx from 'clsx';
import { Bs1Circle, Bs2Circle, Bs3Circle, BsArrowRight } from 'react-icons/bs';

export default function Summary({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-start lg:items-center h-full">
      <h1 className="text-xl font-bold flex-0 self-center">
        A couple last tips
      </h1>
      <ul className="list-disc list-inside mt-8">
        <li>
          Longer words are worth more, but riskier to play since deletes are
          expensive
        </li>
        <li>
          Try to use up "bad" or repeated letters in the letter bank as quickly
          as possible
        </li>
        <li>You can only use a word once</li>
        <li>There's a new game with a new starting word every day!</li>
      </ul>
      <div className="flex-1 flex flex-col mt-4">
        <div className="flex justify-start items-center p-4 text-center flex-1 bg-blue-300 rounded-t">
          <Bs1Circle className="text-black mr-2 w-6 h-6 flex-shrink-0" />
          Choose a letter from the current word
        </div>
        <div className="flex justify-start items-center p-4 text-center flex-1 bg-purple-300">
          <Bs2Circle className="text-black mr-2 w-6 h-6 flex-shrink-0" />
          Choose to replace it, insert a new letter before or after it, or to
          delete it
        </div>
        <div className="flex justify-start items-center p-4 text-center flex-1 bg-green-300 rounded-b">
          <Bs3Circle className="text-black mr-2 w-6 h-6 flex-shrink-0" />
          Choose a letter from the letter bank to use
        </div>
      </div>
      <p className="mt-4 flex-0">And that's it!</p>

      <button
        onClick={onNext}
        className={clsx(
          'flex-0 flex items-center justify-center',
          'mt-4 px-2 py-1 border border-black hover:bg-black hover:text-white border-b-2 border-r-2 rounded-lg  w-full max-w-[480px]',
        )}
      >
        Let's play
        <BsArrowRight className="ml-2 inline-block" />
      </button>
    </div>
  );
}
