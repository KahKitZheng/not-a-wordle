import { words } from "../../constants/words";
import {
  ANIMATION_DURATION,
  COLUMNS,
  GAME_STATUS,
  ROWS,
} from "../../constants";
import { checkGuess, getNewWord } from "../../utils";
import { useCallback, useEffect, useState } from "react";
import GuessGrid from "../Game/GuessGrid/GuessGrid";
import GameKeyboard from "../Game/GameKeyboard/GameKeyboard";
import GameSummary from "../Game/GameSummary/GameSummary";
import "./App.scss";

export default function App() {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GAME_STATUS.RUNNING);
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
      setTimeout(
        () => setGameStatus(GAME_STATUS.WON),
        ANIMATION_DURATION * COLUMNS,
      );
    } else if (nextGuesses.length >= ROWS) {
      setTimeout(
        () => setGameStatus(GAME_STATUS.LOST),
        ANIMATION_DURATION * COLUMNS,
      );
    }
  }, [answer, guesses, tentativeGuess]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const cells = document.querySelectorAll(".cell");

      const keyPress = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const eventKey = e.key.toUpperCase();

      if (e.metaKey) {
        return;
      }

      if (gameStatus !== GAME_STATUS.RUNNING) {
        return;
      }

      if (e.key === "Backspace") {
        if (cellIndex - 1 >= 0 && cellIndex - 1 >= guesses.length * COLUMNS) {
          setCellIndex((prev) => prev - 1);
          cells[cellIndex - 1].innerHTML = "";
          setTentativeGuess(tentativeGuess.slice(0, -1));
        }
      }

      if (e.key === "Enter" && tentativeGuess.length === COLUMNS) {
        handleSubmit();
        setTentativeGuess("");
      }

      if (tentativeGuess.length === COLUMNS) {
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

      if (gameStatus !== GAME_STATUS.RUNNING) {
        return;
      }

      if (letter === "Backspace") {
        if (cellIndex - 1 >= 0 && cellIndex - 1 >= guesses.length * COLUMNS) {
          setCellIndex((prev) => prev - 1);
          cells[cellIndex - 1].innerHTML = "";
          setTentativeGuess(tentativeGuess.slice(0, -1));
        }
        return;
      }

      if (letter === "ENTER") {
        if (tentativeGuess.length !== COLUMNS) {
          return;
        }

        handleSubmit();
        setTentativeGuess("");
        return;
      }

      if (tentativeGuess.length === COLUMNS) {
        return;
      }

      cells[cellIndex].innerHTML = letter.toUpperCase();
      setTentativeGuess(tentativeGuess + letter.toUpperCase());
      setCellIndex((prev) => prev + 1);
    },
    [cellIndex, gameStatus, guesses.length, handleSubmit, tentativeGuess],
  );

  const handleClose = () => {
    setGameStatus(GAME_STATUS.IDLE);
  };

  const handleNextRound = () => {
    setAnswer(getNewWord(words));
    setGuesses([]);
    setTentativeGuess("");
    setCellIndex(0);
    setGameStatus(GAME_STATUS.RUNNING);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <header className="logo-wrapper">
        <h1 className="logo">Wordle clone</h1>
      </header>
      <main className="game-wrapper">
        <form onSubmit={handleSubmit} className="game-form">
          <GuessGrid
            key={`grid-${answer}`}
            validatedGuesses={validatedGuesses}
          />
          <GameKeyboard
            key={`keyboard-${answer}`}
            validatedGuesses={validatedGuesses}
            handleKeyClick={handleOnClickKeyCap}
          />
        </form>

        {gameStatus === GAME_STATUS.WON || gameStatus === GAME_STATUS.LOST ? (
          <GameSummary
            status={gameStatus}
            answer={answer}
            handleClose={handleClose}
            handleNextRound={handleNextRound}
          />
        ) : null}
      </main>
    </>
  );
}
