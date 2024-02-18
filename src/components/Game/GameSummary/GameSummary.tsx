import { createPortal } from "react-dom";
import { GAME_STATUS } from "../../../constants";
import { useContext } from "react";
import { GameContext } from "../../../contexts/GameContext";
import "./GameSummary.scss";

export default function GameSummary() {
  const { gameStatus, answer, closeSummary, prepNextRound } =
    useContext(GameContext);

  return gameStatus === GAME_STATUS.WON || gameStatus === GAME_STATUS.LOST
    ? createPortal(
        <>
          <div className="overlay-shade" />
          <div className="game-summary">
            <p className="title">You {gameStatus}!</p>
            <p className="description">The answer was {answer}</p>
            <div className="button-group">
              <button className="close-button" onClick={closeSummary}>
                Close
              </button>
              <button className="next-round-button" onClick={prepNextRound}>
                Next round
              </button>
            </div>
          </div>
        </>,
        document.body,
      )
    : null;
}
