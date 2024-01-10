import Modal from "../modal";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
}

export default function HelpModal({isOpen, handleClose}: Props) {
  return (
    <Modal
        isOpen={isOpen}
        handleClose={handleClose}
        title="How to play"
        description="A brief intro to trample"
      >
        <p className="text-lg font-bold">The Rules</p>
        <ol className="list-decimal list-inside">
          <li>
            Each turn, you pick one letter from word at the top and <strong>replace it</strong>
            {' '}with a letter from the letter bank, <strong>insert a letter before or after
            it</strong>, or <strong>delete it</strong>.
          </li>
          <li>You can only delete 2 letters per game.</li>
          <li>You only get to take one action per turn.</li>
          <li><strong>Every turn must result in a new valid word.</strong></li>
          <li>
            You can only reuse a previous word if you make it by deleting a
            letter.
          </li>
          <li><strong>Longer words are worth more points</strong>, but are also risker, so plan carefully!</li>
          <li>The game ends when you can't make any new words or forfeit.</li>
        </ol>

        <p className="mt-4">
          There is one starting word and one letter bank per day. Everyone gets the same word and letter bank,
          and you only get one chance per day, so make it count!
        </p>

        <button
          className={
            'bg-green-600 hover:bg-green-800 text-white rounded mt-4 font-bold py-2'
          }
          onClick={handleClose}
        >
          Let's play!
        </button>
      </Modal>
  )
}