import { useContext } from "react";
import { GameContext } from "../../../contexts/GameContext";
import UserIcon from "../../../icons/UserIcon";
import "./GameReadyCheck.scss";

type GameReadyCheckProps = {
  open: boolean;
  onClose: () => void;
  handleReadyCheck: (isReady: boolean) => void;
};

export default function GameReadyCheck(props: GameReadyCheckProps) {
  const { open, handleReadyCheck } = props;
  const { players, userId } = useContext(GameContext);

  const currentPlayer = players.find((player) => player.id === userId);

  return open ? (
    <>
      <div className="overlay-shade" />
      <div className="ready-check-wrapper">
        <h1 className="ready-check-title">Ready check!</h1>
        <ul className="button-users">
          {players.map((player) => (
            <li className={`user ${player.isReady ? "ready" : "not-ready"}`}>
              <UserIcon
                key={player.id}
                isReady={player.isReady}
                isCurrentUser={player.id === currentPlayer?.id}
              />
            </li>
          ))}
        </ul>

        <div className="button-group">
          <button
            className="button decline"
            onClick={() => handleReadyCheck(false)}
          >
            not ready
          </button>
          <button
            className="button accept"
            onClick={() => handleReadyCheck(true)}
          >
            ready
          </button>
        </div>
      </div>
    </>
  ) : null;
}
