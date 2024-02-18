import { useContext, useEffect, useMemo } from "react";
import { getNewWord, randomId } from "../../utils";
import { GameContext } from "../../contexts/GameContext";
import { words } from "../../constants/words";
import Game from "../../components/Game";
import GameSummary from "../../components/Game/GameSummary/GameSummary";

export default function SingleplayerPage() {
  const { setUserId, setGameMode, answer, setAnswer } = useContext(GameContext);

  const id = useMemo(() => randomId(), []);

  const player: Player = {
    id: id,
    name: "Player 1",
    status: "running",
    guesses: [] as string[],
    isWinner: false,
  };

  useEffect(() => {
    setUserId(id);
    setGameMode("single");
    setAnswer(getNewWord(words));
  }, []);

  return (
    <>
      {/* Use key to cleans up game after each round (resets the component) */}
      <Game key={answer} player={player} />
      <GameSummary />
    </>
  );
}
