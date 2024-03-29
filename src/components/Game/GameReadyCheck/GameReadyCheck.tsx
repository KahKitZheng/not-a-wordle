import { useContext } from "react";
import { GameContext } from "../../../contexts/GameContext";
import UserIcon from "../../../icons/UserIcon";
import "./GameReadyCheck.scss";
import { READY_CHECK_DURATION } from "../../../constants";
import { motion } from "framer-motion";

type GameReadyCheckProps = {
  open: boolean;
  onClose: () => void;
  handleReadyCheck: (isReady: "ready" | "not-ready" | undefined) => void;
};

export default function GameReadyCheck(props: GameReadyCheckProps) {
  const { open, handleReadyCheck } = props;
  const { players } = useContext(GameContext);

  function getReadyState(player: Player) {
    if (player.isReady === undefined) {
      return "";
    }
    return player.isReady ? "ready" : "not-ready";
  }

  return open ? (
    <>
      <div className="overlay-shade" />
      <div className="ready-check-wrapper">
        <h1 className="ready-check-title">Ready check!</h1>
        <ul className="button-users">
          {players.map((player) => (
            <li className={`user ${getReadyState(player)}`}>
              <UserIcon />
            </li>
          ))}
        </ul>

        <div className="loading-wrapper">
          <motion.div
            className="progress-bar"
            animate={{
              width: ["0%", "100%"],
              backgroundColor: ["#f00", "mediumaquamarine"],
            }}
            transition={{
              duration: READY_CHECK_DURATION / 1000,
              ease: "linear",
            }}
          />
        </div>

        <div className="button-group">
          <button
            className="button decline"
            onClick={() => handleReadyCheck("not-ready")}
          >
            not ready
          </button>
          <button
            className="button accept"
            onClick={() => handleReadyCheck("ready")}
          >
            ready
          </button>
        </div>
      </div>
    </>
  ) : null;
}
