type GameStatus = "running" | "won" | "lost" | "idle";

type Guess = {
  letter?: string;
  status?: "correct" | "misplaced" | "incorrect";
};

type Player = {
  id: string;
  name: string;
  status: GameStatus;
  guesses: string[];
};

type GameMode = "single" | "multi";
