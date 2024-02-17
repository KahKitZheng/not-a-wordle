import { useContext, useEffect } from "react";
import Game from "../../components/Game";
import Layout from "../../components/Layout";
import { randomId } from "../../utils";
import { GameContext } from "../../contexts/GameContext";

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

  return (
    <Layout>
      <Game player={player} />
    </Layout>
  );
}
