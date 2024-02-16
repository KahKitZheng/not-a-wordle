import Game from "../../components/Game";
import Layout from "../../components/Layout";
import { randomId } from "../../utils";

export default function SingleplayerPage() {
  const player = {
    id: randomId(),
    name: "Player 1",
    status: "running",
    guesses: [] as string[],
  } as Player;

  return (
    <Layout>
      <Game player={player} />
    </Layout>
  );
}
