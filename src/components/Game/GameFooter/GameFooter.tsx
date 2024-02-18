import { useContext } from "react";
import { GameContext } from "../../../contexts/GameContext";
import "./GameFooter.scss";

type GameFooterProps = {
  startReadyCheck: () => void;
  leaveRoom: () => void;
};

export default function GameFooter(props: GameFooterProps) {
  const { startReadyCheck, leaveRoom } = props;
  const { players, userId } = useContext(GameContext);

  const currentPlayer = players.find((player) => player.id === userId);

  return currentPlayer ? (
    <footer className="game-footer">
      {players.length >= 2 && currentPlayer?.isAdmin ? (
        <>
          <button className="button-ready" onClick={startReadyCheck}>
            start ready check
          </button>
          <span> / </span>
        </>
      ) : null}
      <button className="button-ready" onClick={leaveRoom}>
        leave room
      </button>
    </footer>
  ) : null;
}
