import { motion } from "framer-motion";
import { useContext, useEffect, useId, useRef, useState } from "react";
import { ANIMATION_DURATION, COLUMNS, ROWS } from "../../../constants";
import "./GuessGrid.scss";
import { GameContext } from "../../../contexts/GameContext";

type GuessGridProps = {
  validatedGuesses: Guess[][];
  isCurrentPlayer: boolean;
};

export default function GuessGrid(props: GuessGridProps) {
  const { validatedGuesses } = props;

  return (
    <div className="guess-results">
      {Array.from({ length: ROWS }).map((_, index) => (
        <Guess
          key={index}
          value={validatedGuesses[index]}
          isCurrentPlayer={props.isCurrentPlayer}
        />
      ))}
    </div>
  );
}

type GuessProps = {
  value: Guess[];
  isCurrentPlayer: boolean;
};

function Guess(props: GuessProps) {
  const { value } = props;

  return (
    <p className="guess">
      {Array.from({ length: COLUMNS }).map((_, index) => (
        <Cell
          key={index}
          columnIndex={index}
          letter={value ? value[index].letter : undefined}
          status={value ? value[index].status : undefined}
          isCurrentPlayer={props.isCurrentPlayer}
        />
      ))}
    </p>
  );
}

type CellProps = Guess & {
  columnIndex: number;
  isCurrentPlayer: boolean;
};

function Cell(props: CellProps) {
  const { letter, status, columnIndex } = props;
  const { userId } = useContext(GameContext);

  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const id = useId();
  const cellRef = useRef<HTMLSpanElement>(null);

  // Insert the letter inside the element
  useEffect(() => {
    const element = document.getElementById(id);
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === "childList") {
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), ANIMATION_DURATION);
        }
      });
    });

    element && observer.observe(element, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [id]);

  useEffect(() => {
    if (letter !== undefined && status !== undefined) {
      setIsSubmitting(true);
    }
  }, [letter, status]);

  useEffect(() => {
    setTimeout(() => {
      if (!cellRef.current) {
        return;
      }

      cellRef.current.className = `cell ${props.isCurrentPlayer ? `cell-${userId}` : ""} ${status ? status : ""} ${isSubmitting && props.isCurrentPlayer ? "flip" : ""}`;
    }, ANIMATION_DURATION * columnIndex);
  }, [columnIndex, isSubmitting, props.isCurrentPlayer, status, userId]);

  return (
    <motion.span
      id={id}
      ref={cellRef}
      className={`cell ${props.isCurrentPlayer ? `cell-${userId}` : ""}`}
      animate={{ scale: isAnimating ? 1.1 : 1 }}
      transition={{
        type: "spring",
        duration: ANIMATION_DURATION / 1000,
        damping: 8,
        mass: 0.25,
        bounce: 0.5,
      }}
    >
      {props.isCurrentPlayer ? letter : ""}
    </motion.span>
  );
}
