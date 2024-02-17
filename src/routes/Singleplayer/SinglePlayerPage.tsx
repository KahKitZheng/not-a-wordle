import { useContext, useEffect } from "react";
import { randomId } from "../../utils";
import { GameContext } from "../../contexts/GameContext";
import Game from "../../components/Game";

export default function SingleplayerPage() {
  const { setGameMode } = useContext(GameContext);

  const player = {
    id: randomId(),
    name: "Player 1",
    status: "running",
    guesses: [] as string[],
  } as Player;

  useEffect(() => {
    setGameMode("single");
  }, []);

  return <Game player={player} />;
}
