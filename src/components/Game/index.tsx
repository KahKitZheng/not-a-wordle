import {
  ANIMATION_DURATION,
  COLUMNS,
  GAME_STATUS,
  ROWS,
} from "../../constants";
import { checkGuess } from "../../utils";
import { useCallback, useContext, useEffect, useState } from "react";
import { GameContext } from "../../contexts/GameContext";
import GuessGrid from "./GuessGrid/GuessGrid";
import GameKeyboard from "./GameKeyboard/GameKeyboard";
import "./Game.scss";
import RemoveIcon from "../../icons/RemoveIcon";

type GameProps = {
  player: Player;
  submitMultiplayerGuess?: (guesses: string) => void;
  submitWinner?: () => void;
  leaveRoom?: () => void;
};

export default function Game(props: GameProps) {
  const { userId, answer, gameStatus, setGameStatus, gameMode } =
    useContext(GameContext);
  const { player } = props;

  const [guesses, setGuesses] = useState<string[]>(player?.guesses ?? []);
  const [tentativeGuess, setTentativeGuess] = useState("");
  const [cellIndex, setCellIndex] = useState(0);

  const validatedGuesses = guesses.map((guess) =>
    checkGuess(guess, answer),
  ) as Guess[][];

  const handleLeaveRoom = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();

    if (props.leaveRoom) {
      props.leaveRoom();
    }
  };

  const handleSubmit = useCallback(() => {
    const nextGuesses = [...guesses, tentativeGuess];

    setGuesses(nextGuesses);

    // Multiplayer only!!!
    if (props.submitMultiplayerGuess) {
      props.submitMultiplayerGuess(tentativeGuess);
    }

    if (tentativeGuess.toUpperCase() === answer) {
      setTimeout(() => {
        setGameStatus(GAME_STATUS.WON);

        if (props.submitWinner) {
          props.submitWinner();
        }
      }, ANIMATION_DURATION * COLUMNS);
    } else if (nextGuesses.length >= ROWS) {
      setTimeout(() => {
        setGameStatus(GAME_STATUS.LOST);
      }, ANIMATION_DURATION * COLUMNS);
    }
  }, [answer, guesses, props, setGameStatus, tentativeGuess]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const cells = document.querySelectorAll(`.cell-${userId}`);

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

      if (
        e.key === "Enter" &&
        tentativeGuess.length === COLUMNS &&
        player?.id === userId
      ) {
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
    [
      cellIndex,
      gameStatus,
      guesses.length,
      handleSubmit,
      player?.id,
      tentativeGuess,
      userId,
    ],
  );

  const handleOnClickKeyCap = useCallback(
    (letter: string) => {
      const cells = document.querySelectorAll(`.cell-${userId}`);

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

  useEffect(() => {
    if (gameMode === "single") {
      return;
    }

    setGuesses(player?.guesses ?? []);
  }, [gameMode, player?.guesses]);

  // Clean up states for next round
  useEffect(() => {
    if (gameStatus === GAME_STATUS.PREP) {
      setGuesses([]);
      setTentativeGuess("");
      setCellIndex(0);
      setGameStatus(GAME_STATUS.RUNNING);
    }
  }, [gameStatus, setGameStatus]);

  // Listen for keyboard events
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <form onSubmit={handleSubmit} className="game-form">
        {gameMode === "multi" ? (
          <p className="player-name">
            {player?.name}
            {player.id === userId ? (
              <button
                style={{
                  height: "1.25rem",
                  width: "1.25rem",
                  marginLeft: ".5rem",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={handleLeaveRoom}
              >
                <RemoveIcon />
              </button>
            ) : null}
          </p>
        ) : null}
        <GuessGrid
          key={`grid-${answer}`}
          isCurrentPlayer={player?.id === userId}
          validatedGuesses={validatedGuesses}
        />

        {player?.id === userId || gameMode === "single" ? (
          <GameKeyboard
            key={`keyboard-${answer}`}
            validatedGuesses={validatedGuesses}
            handleKeyClick={handleOnClickKeyCap}
          />
        ) : null}
      </form>
    </>
  );
}
