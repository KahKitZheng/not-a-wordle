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
    <p className="guess">
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
  const className = status ? `cell ${status}` : "cell";

  return <span className={className}>{letter}</span>;
}
