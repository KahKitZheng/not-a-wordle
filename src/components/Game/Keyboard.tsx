const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

type KeyboardProps = {
  validatedGuesses: Guess[][];
};

export default function Keyboard({ validatedGuesses }: KeyboardProps) {
  const statusByLetter = getStatusByLetter(validatedGuesses);

  return (
    <div className="keyboard" style={{ marginTop: "2rem" }}>
      {ROWS.map((row, index) => (
        <div key={index} className="keyboard-row">
          {row.map((letter) => (
            <div
              key={letter}
              className={`letter ${statusByLetter[letter] || ""}`}
            >
              {letter}
            </div>
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
