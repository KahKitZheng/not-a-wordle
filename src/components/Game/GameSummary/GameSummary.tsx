import { createPortal } from "react-dom";
import "./GameSummary.scss";

type GameStatusProps = {
  status: GameStatus;
  answer: string;
  handleClose: () => void;
  handleNextRound: () => void;
};

export default function GameSummary(props: GameStatusProps) {
  const { status, answer, handleClose, handleNextRound } = props;

  return createPortal(
    <>
      <div className="overlay-shade" />
      <div className="game-summary">
        <p className="title">You {status}!</p>
        <p className="description">The answer was {answer}</p>
        <div className="button-group">
          <button className="close-button" onClick={handleClose}>
            Close
          </button>
          <button className="next-round-button" onClick={handleNextRound}>
            Next round
          </button>
        </div>
      </div>
    </>,
    document.body,
  );
}
