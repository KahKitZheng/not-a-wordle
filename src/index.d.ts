type GameStatus = "running" | "won" | "lost" | "idle";

type Guess = {
  letter?: string;
  status?: "correct" | "misplaced" | "incorrect";
};
