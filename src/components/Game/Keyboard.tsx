import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["", "A", "S", "D", "F", "G", "H", "J", "K", "L", ""],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
];

type KeyboardProps = {
  validatedGuesses: Guess[][];
  onClick: (letter: string) => void;
};

export default function Keyboard({ validatedGuesses, onClick }: KeyboardProps) {
  const statusByLetter = getStatusByLetter(validatedGuesses);

  return (
    <div className="keyboard" style={{ marginTop: "2rem" }}>
      {ROWS.map((row, index) => (
        <div key={index} className="keyboard-row">
          {row.map((letter) => (
            <KeyCap
              key={letter}
              letter={letter}
              status={statusByLetter[letter] || ""}
              handleOnClick={onClick}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function getStatusByLetter(validatedGuesses: Guess[][]) {
  const statusObj: Record<string, string> = {};
  // `.flat()` is a method that flattens nested arrays.
  // Here it produces an array containing all of the letter/status
  // objects for each guess.
  const allLetters = validatedGuesses.flat();

  allLetters.forEach(({ letter, status }: Guess) => {
    if (letter === undefined || status === undefined) {
      return;
    }

    const currentStatus = statusObj[letter];

    if (currentStatus === undefined) {
      statusObj[letter] = status;
      return;
    }

    // The same letter might have multiple matched statuses.
    // For example, if the answer is "APPLE" and the user guesses
    // "PAPER", then the letter "P" is misplaced (for the first P)
    // and correct (for the second P).
    //
    // We want to prioritize the statuses in this order:
    const STATUS_RANKS: Record<string, number> = {
      correct: 1,
      misplaced: 2,
      incorrect: 3,
    };

    const currentStatusRank = STATUS_RANKS[currentStatus];
    const newStatusRank = STATUS_RANKS[status];

    if (newStatusRank < currentStatusRank) {
      statusObj[letter] = status;
    }
  });

  return statusObj;
}

function KeyCap({
  letter,
  status,
  handleOnClick,
}: {
  letter: string;
  status: string;
  handleOnClick: (letter: string) => void;
}) {
  const [isKeyPressed, setIsKeyPressed] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const keyCapRef = useRef<HTMLButtonElement>(null);

  const variants = {
    pressed: { scale: 0.9, opacity: 0.5 },
    notPressed: { scale: 1 },
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const eventKey = e.key.toUpperCase();

      if (letter.toUpperCase() === eventKey) {
        setIsKeyPressed(true);
      }
    },
    [letter],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    setTimeout(() => {
      setIsKeyPressed(false);
      setIsClicked(false);
    }, 300);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown, isKeyPressed, isClicked]);

  useEffect(() => {
    setTimeout(() => {
      if (!keyCapRef.current) {
        return;
      }

      keyCapRef.current.className = `letter ${status} ${
        ["ENTER", "Backspace"].includes(letter) ? "wide" : ""
      } ${letter === "" ? "empty" : ""}`;
    }, 1500);
  }, [letter, status]);

  return (
    <motion.button
      key={letter}
      ref={keyCapRef}
      className={`letter ${
        ["ENTER", "Backspace"].includes(letter) ? "wide" : ""
      } ${letter === "" ? "empty" : ""}`}
      variants={variants}
      animate={isKeyPressed || isClicked ? "pressed" : "notPressed"}
      transition={{ duration: 0.3 }}
      onClick={(e) => {
        e.preventDefault();
        handleOnClick(letter);
        setIsClicked(true);
      }}
    >
      {letter === "Backspace" ? "⌫" : letter}
    </motion.button>
  );
}
