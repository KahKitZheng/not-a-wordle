import React, { useState } from "react";
import { GAME_STATUS, MATCH_STATUS } from "../constants";
import { getNewWord } from "../utils";
import { words } from "../constants/words";

type GameContextType = {
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  answer: string;
  setAnswer: React.Dispatch<React.SetStateAction<string>>;
  matchStatus: MatchStatus;
  setMatchStatus: React.Dispatch<React.SetStateAction<MatchStatus>>;
  gameStatus: GameStatus;
  setGameStatus: React.Dispatch<React.SetStateAction<GameStatus>>;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  gameMode: GameMode;
  setGameMode: React.Dispatch<React.SetStateAction<GameMode>>;
  closeSummary: () => void;
  prepNextRound: () => void;
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
  const [matchStatus, setMatchStatus] = useState<MatchStatus>(
    MATCH_STATUS.IDLE,
  );
  const [gameStatus, setGameStatus] = useState<GameStatus>(GAME_STATUS.RUNNING);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameMode, setGameMode] = useState<GameMode>("single");

  // Quick access for debugging or to cheat :P
  React.useEffect(() => {
    return console.log("answer", answer);
  }, [answer]);

  function closeSummary() {
    setGameStatus(GAME_STATUS.IDLE);
  }

  function prepNextRound() {
    setAnswer(getNewWord(words));
    setGameStatus(GAME_STATUS.RUNNING);
  }

  return (
    <GameContext.Provider
      value={{
        userId,
        setUserId,
        answer,
        setAnswer,
        matchStatus,
        setMatchStatus,
        gameStatus,
        setGameStatus,
        players,
        setPlayers,
        gameMode,
        setGameMode,
        closeSummary,
        prepNextRound,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
