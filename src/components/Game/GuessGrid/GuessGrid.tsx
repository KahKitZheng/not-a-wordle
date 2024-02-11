import { motion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { ANIMATION_DURATION, COLUMNS, ROWS } from "../../../constants";
import "./GuessGrid.scss";

type GuessGridProps = {
  validatedGuesses: Guess[][];
};

export default function GuessGrid(props: GuessGridProps) {
  const { validatedGuesses } = props;

  return (
    <div className="guess-results">
      {Array.from({ length: ROWS }).map((_, index) => (
        <Guess key={index} value={validatedGuesses[index]} />
      ))}
    </div>
  );
}

type GuessProps = {
  value: Guess[];
};

function Guess(props: GuessProps) {
  const { value } = props;

  return (
    <p className="guess">
      {Array.from({ length: COLUMNS }).map((_, index) => (
        <Cell
          key={index}
          index={index}
          letter={value ? value[index].letter : undefined}
          status={value ? value[index].status : undefined}
        />
      ))}
    </p>
  );
}

type CellProps = Guess & {
  index: number;
};

function Cell(props: CellProps) {
  const { letter, status, index } = props;

  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const id = useId();
  const cellRef = useRef<HTMLSpanElement>(null);

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

      cellRef.current.className = `cell ${status ? status : ""} ${isSubmitting ? "flip" : ""}`;
    }, ANIMATION_DURATION * index);
  }, [index, isSubmitting, status]);

  return (
    <motion.span
      id={id}
      ref={cellRef}
      className="cell"
      animate={{ scale: isAnimating ? 1.1 : 1 }}
      transition={{
        type: "spring",
        duration: ANIMATION_DURATION / 1000,
        damping: 8,
        mass: 0.25,
        bounce: 0.5,
      }}
    >
      {letter}
    </motion.span>
  );
}
