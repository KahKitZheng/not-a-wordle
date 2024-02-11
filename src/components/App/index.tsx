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
      setTimeout(() => {
        setGameStatus("won");
      }, 1500);
    } else if (nextGuesses.length >= 6) {
      setTimeout(() => {
        setGameStatus("lost");
      }, 1500);
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

  const handleClose = () => {
    setGameStatus("idle");
  };

  const handleNextRound = () => {
    setAnswer(getNewWord(words));
    setGuesses([]);
    setTentativeGuess("");
    setCellIndex(0);
    setGameStatus("running");
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <main
      style={{
        gap: "2rem",
        position: "relative",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          width: "100%",
          gap: "2rem",
          padding: "1rem",
        }}
      >
        <GuessGrid key={`grid-${answer}`} validatedGuesses={validatedGuesses} />
        <Keyboard
          key={`keyboard-${answer}`}
          validatedGuesses={validatedGuesses}
          onClick={handleOnClickKeyCap}
        />
      </form>

      {gameStatus === "won" || gameStatus === "lost" ? (
        <GameStatus
          status={gameStatus}
          answer={answer}
          handleClose={handleClose}
          handleNextRound={handleNextRound}
        />
      ) : null}
    </main>
  );
}

function GameStatus({
  status,
  answer,
  handleClose,
  handleNextRound,
}: {
  status: GameStatus;
  answer: string;
  handleClose: () => void;
  handleNextRound: () => void;
}) {
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          backgroundColor: "black",
          opacity: 0.5,
          display: "grid",
          placeItems: "center",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          transform: "translateY(-50%)",
          width: "100%",
          zIndex: 1,
          padding: "3rem 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",

          backgroundColor: "white",
        }}
      >
        <p
          style={{
            textTransform: "uppercase",
            fontWeight: 600,
            fontSize: "32px",
            margin: 0,
          }}
        >
          You {status}!
        </p>
        <p style={{ margin: 0.5 }}>The answer was {answer}</p>
        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
          <button
            style={{
              border: "1px solid black",
              padding: "4px 12px",
              boxShadow: "2px 2px 0 black",
              borderRadius: "4px",
            }}
            onClick={handleClose}
          >
            Close
          </button>
          <button
            style={{
              backgroundColor: "mediumaquamarine",
              border: "1px solid black",
              padding: "4px 12px",
              boxShadow: "2px 2px 0 black",
              borderRadius: "4px",
            }}
            onClick={handleNextRound}
          >
            Next round
          </button>
        </div>
      </div>
    </>
  );
}
