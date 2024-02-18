import { createPortal } from "react-dom";
import { GAME_STATUS } from "../../../constants";
import { useContext } from "react";
import { GameContext } from "../../../contexts/GameContext";
import "./GameSummary.scss";

export default function GameSummary() {
  const { gameMode } = useContext(GameContext);

  switch (gameMode) {
    case "single":
      return <SinglePlayerSummary />;
    case "multi":
      return <MultiPlayerSummary />;
    default:
      return null;
  }
}

function SinglePlayerSummary() {
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

function MultiPlayerSummary() {
  const { userId, gameStatus, answer, closeSummary, players } =
    useContext(GameContext);

  const winner = players.find((player) => player.isWinner);
  const currentPlayer = players.find((player) => player.id === userId);

  return gameStatus === GAME_STATUS.WON || gameStatus === GAME_STATUS.LOST
    ? createPortal(
        <>
          <div className="overlay-shade" />
          <div className="game-summary">
            <p className="title">
              {winner
                ? winner?.id === currentPlayer?.id
                  ? `You ${gameStatus}!`
                  : `Winner is ${winner.name}`
                : "You lost!"}
            </p>
            {winner ? (
              <p className="description">The answer was {answer}</p>
            ) : null}
            <div className="button-group">
              <button className="close-button" onClick={closeSummary}>
                {winner ? "Close" : "Keep spectating!"}
              </button>
            </div>
          </div>
        </>,
        document.body,
      )
    : null;
}
