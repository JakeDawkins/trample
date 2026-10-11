import clsx from 'clsx';
import { BsArrowRight, BsTrash3 } from 'react-icons/bs';
import LetterButton from '../letterButton';
import ActionButton, { Action } from '../ActionButton';

export default function Intro({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-start lg:items-center h-full">
      <h1 className="text-xl font-bold flex-0 self-center">
        Welcome to Trample
      </h1>
      <p className="mt-4 flex-0">
        Trample is a game of clever words, strategy, and a little luck. Try to
        make as many words as you can before running out of options
      </p>
      <p className="mt-4 flex-0">
        This is the home screen. We&apos;ll get familiar with how it works on
        the next steps. step
      </p>

      <div className="flex-1 w-full flex flex-col items-center -mr-4">
        <div className={clsx('flex w-full flex-col items-center mt-4 p-4')}>
          <div className="flex flex-row">
            <LetterButton letter="C" onClick={() => {}} selected={false} />
            <LetterButton letter="O" onClick={() => {}} selected={false} />
            <LetterButton letter={'G'} onClick={() => {}} selected={false} />
          </div>
        </div>
        <div className="flex w-full justify-center">
          {(['insert-before', 'swap', 'insert-after'] as Action[]).map(
            (action) => {
              return (
                <ActionButton
                  key={action}
                  action={action}
                  active={false}
                  onClick={() => {}}
                />
              );
            },
          )}
          <button
            className={clsx(
              `relative h-10 w-10 min-w-[40px] mb-4 rounded bg-red-600 flex items-center justify-center`,
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
        <div className="flex w-full justify-center">
          <div className="flex flex-row flex-wrap mt-4 max-w-[300px] -mr-4">
            {['G', 'A', 'P', 'B', 'N', 'O', 'Q', 'A', 'H', 'R'].map(
              (letter, index) => {
                return (
                  <LetterButton
                    key={index}
                    letter={letter}
                    onClick={() => {}}
                    selected={false}
                  />
                );
              },
            )}
          </div>
        </div>
      </div>

      {/* <Image
        alt="Home screen"
        src={ScreenImg}
        width={1080}
        height={1920}
        className="mt-4 flex-1 object-contain overflow-hidden rounded-lg"
      /> */}
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
