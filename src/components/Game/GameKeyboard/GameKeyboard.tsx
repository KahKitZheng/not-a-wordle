import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { ANIMATION_DURATION, COLUMNS } from "../../../constants";
import "./GameKeyboard.scss";

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["", "A", "S", "D", "F", "G", "H", "J", "K", "L", ""],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
];

type KeyboardProps = {
  validatedGuesses: Guess[][];
  handleKeyClick: (letter: string) => void;
};

export default function GameKeyboard(props: KeyboardProps) {
  const { validatedGuesses, handleKeyClick } = props;
  const statusByLetter = getStatusByLetter(validatedGuesses);

  function getStatusByLetter(validatedGuesses: Guess[][]) {
    const statusObj: Record<string, string> = {};
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

  return (
    <div className="keyboard">
      {KEYBOARD_ROWS.map((row, index) => (
        <div key={index} className="keyboard-row">
          {row.map((letter, index) => (
            <KeyCap
              key={`${letter}-${index}`}
              letter={letter}
              status={statusByLetter[letter] || ""}
              handleKeyClick={handleKeyClick}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

type KeyCapProps = {
  letter: string;
  status: string;
  handleKeyClick: (letter: string) => void;
};

function KeyCap(props: KeyCapProps) {
  const { letter, status, handleKeyClick } = props;

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

  function handleOnClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    handleKeyClick(letter);
    setIsClicked(true);
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    setTimeout(() => {
      setIsKeyPressed(false);
      setIsClicked(false);
    }, ANIMATION_DURATION);

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
    }, ANIMATION_DURATION * COLUMNS);
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
      transition={{ duration: ANIMATION_DURATION / 1000 }}
      onClick={handleOnClick}
    >
      {letter === "Backspace" ? "⌫" : letter}
    </motion.button>
  );
}
