import { useCallback, useEffect, useState } from "react";
import GuessGrid from "../Game/GuessGrid";
import Keyboard from "../Game/Keyboard";
import { words } from "../../constants/words";
import { checkGuess, getNewWord } from "../../utils";

export default function App() {
  const [gameStatus, setGameStatus] = useState<GameStatus>("running");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [tentativeGuess, setTentativeGuess] = useState("");
  const [answer, setAnswer] = useState(() => getNewWord(words));
  const [cellIndex, setCellIndex] = useState(0);

  console.log("answer", answer);

  const validatedGuesses = guesses.map((guess) =>
    checkGuess(guess, answer),
  ) as Guess[][];

  const handleSubmit = useCallback(() => {
    const nextGuesses = [...guesses, tentativeGuess];

    setGuesses(nextGuesses);

    if (tentativeGuess.toUpperCase() === answer) {
      setGameStatus("won");
    } else if (nextGuesses.length >= 6) {
      setGameStatus("lost");
    }
  }, [answer, guesses, tentativeGuess]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const cells = document.querySelectorAll(".cell");

      const keyPress = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const eventKey = e.key.toUpperCase();

      if (gameStatus !== "running") {
        return;
      }

      if (e.key === "Backspace") {
        if (cellIndex - 1 >= 0 && cellIndex - 1 >= guesses.length * 5) {
          setCellIndex((prev) => prev - 1);
          cells[cellIndex - 1].innerHTML = "";
          setTentativeGuess(tentativeGuess.slice(0, -1));
        }
      }

      if (e.key === "Enter" && tentativeGuess.length === 5) {
        handleSubmit();
        setTentativeGuess("");
      }

      if (tentativeGuess.length === 5) {
        return;
      }

      if (keyPress.includes(eventKey)) {
        cells[cellIndex].innerHTML = e.key.toUpperCase();
        setTentativeGuess(tentativeGuess + e.key.toUpperCase());
        setCellIndex((prev) => prev + 1);
      }
    },
    [cellIndex, gameStatus, guesses.length, handleSubmit, tentativeGuess],
  );

  const handleOnClickKeyCap = useCallback(
    (letter: string) => {
      const cells = document.querySelectorAll(".cell");

      if (gameStatus !== "running") {
        return;
      }

      if (letter === "Backspace") {
        if (cellIndex - 1 >= 0 && cellIndex - 1 >= guesses.length * 5) {
          setCellIndex((prev) => prev - 1);
          cells[cellIndex - 1].innerHTML = "";
          setTentativeGuess(tentativeGuess.slice(0, -1));
        }
        return;
      }

      if (letter === "ENTER") {
        if (tentativeGuess.length !== 5) {
          return;
        }

        handleSubmit();
        setTentativeGuess("");
        return;
      }

      if (tentativeGuess.length === 5) {
        return;
      }

      cells[cellIndex].innerHTML = letter.toUpperCase();
      setTentativeGuess(tentativeGuess + letter.toUpperCase());
      setCellIndex((prev) => prev + 1);
    },
    [cellIndex, gameStatus, guesses.length, handleSubmit, tentativeGuess],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <main style={{ display: "grid", gap: "2rem" }}>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <GuessGrid validatedGuesses={validatedGuesses} />
        <Keyboard
          validatedGuesses={validatedGuesses}
          onClick={handleOnClickKeyCap}
        />
      </form>
    </main>
  );
}
