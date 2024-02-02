type GameStatus = "running" | "won" | "lost";

type Guess = {
  letter?: string;
  status?: "correct" | "misplaced" | "incorrect";
};
