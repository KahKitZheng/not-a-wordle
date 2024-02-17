import { useContext, useEffect, useMemo } from "react";
import { getNewWord, randomId } from "../../utils";
import { GameContext } from "../../contexts/GameContext";
import { words } from "../../constants/words";
import Game from "../../components/Game";

export default function SingleplayerPage() {
  const { setUserId, setGameMode, setAnswer } = useContext(GameContext);

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
    setAnswer(getNewWord(words));
  }, []);

  return <Game player={player} />;
}
