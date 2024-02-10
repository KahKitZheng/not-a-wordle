import { motion } from "framer-motion";
import { useEffect, useId, useState } from "react";

type GuessGridProps = {
  validatedGuesses: Guess[][];
};

export default function GuessGrid({ validatedGuesses }: GuessGridProps) {
  return (
    <div className="guess-results" style={{ maxWidth: "400px" }}>
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
          letter={value ? value[index].letter : undefined}
          status={value ? value[index].status : undefined}
        />
      ))}
    </p>
  );
}

function Cell({ letter, status }: Guess) {
  const id = useId();
  const className = status ? `cell ${status}` : "cell";

  const duration = 100;

  const [isAnimating, setIsAnimating] = useState(false);

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

  return (
    <motion.span
      id={id}
      className={className}
      animate={{ scale: isAnimating ? 1.2 : 1 }}
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
  );
}
