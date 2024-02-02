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
          index={index}
          letter={value ? value[index].letter : undefined}
          status={value ? value[index].status : undefined}
        />
      ))}
    </p>
  );
}

function Cell({ letter, status }: Guess & { index: number }) {
  const className = status ? `cell ${status}` : "cell";

  return (
    <span className={className} style={{ cursor: "default" }}>
      {letter}
    </span>
  );
}
