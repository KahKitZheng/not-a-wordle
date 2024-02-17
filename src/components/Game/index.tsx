import { words } from "../../constants/words";
import {
  ANIMATION_DURATION,
  COLUMNS,
  GAME_STATUS,
  ROWS,
} from "../../constants";
import { checkGuess, getNewWord } from "../../utils";
import { useCallback, useContext, useEffect, useState } from "react";
import { GameContext } from "../../contexts/GameContext";
import GuessGrid from "./GuessGrid/GuessGrid";
import GameKeyboard from "./GameKeyboard/GameKeyboard";
import GameSummary from "./GameSummary/GameSummary";
import "./Game.scss";

type GameProps = {
  player: Player;
};

export default function Game(props: GameProps) {
  const { userId, answer, setAnswer, gameStatus, setGameStatus, gameMode } =
    useContext(GameContext);
  const { player } = props;

  const [guesses, setGuesses] = useState<string[]>(props.player?.guesses ?? []);
  const [tentativeGuess, setTentativeGuess] = useState("");
  const [cellIndex, setCellIndex] = useState(0);

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
  }, [answer, guesses, setGameStatus, tentativeGuess]);

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
      <form onSubmit={handleSubmit} className="game-form">
        <p className="player-name">{player?.id}</p>
        <GuessGrid key={`grid-${answer}`} validatedGuesses={validatedGuesses} />

        {player?.id === userId || gameMode === "single" ? (
          <GameKeyboard
            key={`keyboard-${answer}`}
            validatedGuesses={validatedGuesses}
            handleKeyClick={handleOnClickKeyCap}
          />
        ) : null}
      </form>

      <GameSummary
        status={gameStatus}
        answer={answer}
        handleClose={handleClose}
        handleNextRound={handleNextRound}
      />
    </>
  );
}
