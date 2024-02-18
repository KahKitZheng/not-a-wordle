export const ROWS = 6;
export const COLUMNS = 5;

export const ANIMATION_DURATION = 300; // ms

export const MATCH_STATUS = {
  IDLE: "idle",
  RUNNING: "running",
  FINISHED: "finished",
} as const;

export const GAME_STATUS = {
  RUNNING: "running",
  WON: "won",
  LOST: "lost",
  IDLE: "idle",
  PREP: "prep",
} as const;

export const READY_CHECK_DURATION = 10000; // ms
