import { useContext, useEffect, useMemo } from "react";
import { randomId } from "../../utils";
import { GameContext } from "../../contexts/GameContext";
import Game from "../../components/Game";

export default function SingleplayerPage() {
  const { setUserId, setGameMode } = useContext(GameContext);

  const id = useMemo(() => randomId(), []);

  const player = {
    id: id,
    name: "Player 1",
    status: "running",
    guesses: [] as string[],
  } as Player;

  useEffect(() => {
    setUserId(id);
    setGameMode("single");
  }, []);

  return <Game player={player} />;
}
