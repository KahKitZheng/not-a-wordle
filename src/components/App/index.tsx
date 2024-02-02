import { useState } from "react";
import GuessGrid from "../Game/GuessGrid";
import Keyboard from "../Game/Keyboard";
import { words } from "../../constants/words";
import { checkGuess, getNewWord } from "../../utils";
import GuessInput from "../Game/GuessInput";

export default function App() {
  const [gameStatus, setGameStatus] = useState<GameStatus>("running");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [answer, setAnswer] = useState(() => getNewWord(words));

  console.log("answer", answer);

  const validatedGuesses = guesses.map((guess) =>
    checkGuess(guess, answer)
  ) as Guess[][];

  function handleSubmitGuess(tentativeGuess: string) {
    const nextGuesses = [...guesses, tentativeGuess];
    setGuesses(nextGuesses);

    if (tentativeGuess.toUpperCase() === answer) {
      setGameStatus("won");
    } else if (nextGuesses.length >= 6) {
      setGameStatus("lost");
    }
  }

  return (
    <main>
      <GuessGrid validatedGuesses={validatedGuesses} />
      <GuessInput
        gameStatus={gameStatus}
        handleSubmitGuess={handleSubmitGuess}
      />
      <Keyboard validatedGuesses={validatedGuesses} />
    </main>
  );
}
