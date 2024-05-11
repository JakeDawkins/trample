import clsx from 'clsx';
import Image from 'next/image';
import { BsArrowRight } from 'react-icons/bs';
import ScreenImg from './assets/screen.jpg';

export default function Intro({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-start lg:items-center h-full">
      <h1 className="text-xl font-bold flex-0 self-center">
        Welcome to Trample
      </h1>
      <p className="mt-4 flex-0">
        Trample is a game of clever words, strategy, and a little luck. Try to
        make as many as you can before running out of options
      </p>
      <p className="mt-4 flex-0">Let&apos;s get familiar with the screen</p>
      <Image
        alt="Home screen"
        src={ScreenImg}
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
