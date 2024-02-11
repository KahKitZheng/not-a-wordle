import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";

type GuessGridProps = {
  validatedGuesses: Guess[][];
};

export default function GuessGrid({ validatedGuesses }: GuessGridProps) {
  return (
    <div className="guess-results">
      {Array.from({ length: 6 }).map((_, index) => (
        <Guess key={index} value={validatedGuesses[index]} />
      ))}
    </div>
  );
}

type GuessProps = {
  value: Guess[];
};

function Guess({ value }: GuessProps) {
  return (
    <p className="guess" style={{ pointerEvents: "none" }}>
      {Array.from({ length: 5 }).map((_, index) => (
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

function Cell({ letter, status, index }: Guess & { index: number }) {
  const id = useId();
  const cellRef = useRef<HTMLSpanElement>(null);

  const duration = 300;

  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const element = document.getElementById(id);
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === "childList") {
          setIsAnimating(true);
          setTimeout(() => {
            setIsAnimating(false);
          }, duration);
        }
      });
    });

    element && observer.observe(element, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
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
    }, duration * index);
  }, [index, isSubmitting, status]);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        id={id}
        ref={cellRef}
        className="cell"
        animate={{ scale: isAnimating ? 1.1 : 1 }}
        transition={{
          type: "spring",
          duration: duration / 1000,
          damping: 8,
          mass: 0.25,
          bounce: 0.5,
        }}
      >
        {letter}
      </motion.span>
    </AnimatePresence>
  );
}
