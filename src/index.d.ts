type MatchStatus = "idle" | "ready-check" | "running" | "finished";

type GameStatus = "running" | "won" | "lost" | "idle" | "prep";

type Guess = {
  letter?: string;
  status?: "correct" | "misplaced" | "incorrect";
};

type Player = {
  id: string;
  name: string;
  status: GameStatus; // might not be needed
  guesses: string[];
  isReady: boolean;
  isAdmin: boolean;
  isWinner: boolean;
};

type GameMode = "single" | "multi";
