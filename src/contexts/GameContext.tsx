import React, { useEffect, useMemo, useState } from "react";
import { GAME_STATUS } from "../constants";
import { getNewWord, randomId } from "../utils";
import { words } from "../constants/words";

type GameContextType = {
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  answer: string;
  setAnswer: React.Dispatch<React.SetStateAction<string>>;
  gameStatus: GameStatus;
  setGameStatus: React.Dispatch<React.SetStateAction<GameStatus>>;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  gameMode: GameMode;
  setGameMode: React.Dispatch<React.SetStateAction<GameMode>>;
};

export const GameContext = React.createContext<GameContextType>(
  {} as GameContextType,
);

type GameContextProviderProps = {
  children: React.ReactNode;
};

export const GameContextProvider = ({ children }: GameContextProviderProps) => {
  const [userId, setUserId] = useState<string>("");
  const [answer, setAnswer] = useState("");
  const [gameStatus, setGameStatus] = useState<GameStatus>(GAME_STATUS.RUNNING);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameMode, setGameMode] = useState<GameMode>("single");

  React.useEffect(() => console.log("answer", answer), [answer]);

  return (
    <GameContext.Provider
      value={{
        userId,
        setUserId,
        answer,
        setAnswer,
        gameStatus,
        setGameStatus,
        players,
        setPlayers,
        gameMode,
        setGameMode,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
