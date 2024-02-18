import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useBeforeUnload, useParams } from "react-router-dom";
import { GO_AWAY_SENTINEL, SLOW_DOWN_SENTINEL } from "../../constants/partykit";
import { GameContext } from "../../contexts/GameContext";
import { GAME_STATUS } from "../../constants";
import { randomId } from "../../utils";
import Game from "../../components/Game";
import GameSummary from "../../components/Game/GameSummary/GameSummary";
import usePartySocket from "partysocket/react";
import "./Multiplayer.scss";
import GameFooter from "../../components/Game/GameFooter/GameFooter";
import GameReadyCheck from "../../components/Game/GameReadyCheck/GameReadyCheck";

// In case of custom setup, change this to your server's host
const host = import.meta.env.PROD
  ? window.location.origin
  : "http://localhost:1999";

export default function MultiplayerPage() {
  const { roomId } = useParams();
  const {
    userId,
    setUserId,
    players,
    setPlayers,
    setGameMode,
    setAnswer,
    matchStatus,
    setMatchStatus,
    setGameStatus,
  } = useContext(GameContext);

  const [openReadyCheck, setOpenReadyCheck] = useState(false);

  const id = useMemo(() => randomId(), []);

  const socket = usePartySocket({
    host,
    room: roomId,
    onMessage(event) {
      if (event.data === SLOW_DOWN_SENTINEL) {
        console.log("Cool down. You're sending too many messages.");
        return;
      }

      if (event.data === GO_AWAY_SENTINEL) {
        // server told us to go away. They already closed the connection, but
        // we'll call socket.close() to stop reconnection attempts
        console.log("Good bye.");
        socket.close();
        return;
      }

      updateValues(event);
    },
  });

  const updateValues = useCallback(
    (event: WebSocketEventMap["message"]) => {
      const message = JSON.parse(event.data);

      // Debugging purposes
      // console.log("message", message);

      setPlayers(message.players);
      setAnswer(message.answer);
      setMatchStatus(message.matchStatus);
    },
    [setAnswer, setMatchStatus, setPlayers],
  );

  const createActionMessage = (action: {
    type: "join" | "leave";
    userId?: string;
  }) => {
    return JSON.stringify({
      type: "action",
      action,
    });
  };

  const handleJoin = useCallback(
    (action: { type: "join" | "leave"; userId: string }) => {
      socket.send(createActionMessage(action));
    },
    [socket],
  );

  const submitMultiplayerGuess = useCallback(
    (guess: string) => {
      socket.send(
        JSON.stringify({
          type: "action",
          action: {
            type: "guess",
            userId: userId,
            guess: guess,
          },
        }),
      );
    },
    [socket, userId],
  );

  const submitWinner = useCallback(() => {
    socket.send(
      JSON.stringify({
        type: "action",
        action: {
          type: "winner",
          userId: userId,
        },
      }),
    );
  }, [socket, userId]);

  const handleStartReadyCheck = useCallback(() => {
    setOpenReadyCheck(true);

    socket.send(
      JSON.stringify({
        type: "action",
        action: {
          type: "init-ready-check",
          userId: userId,
        },
      }),
    );

    setTimeout(() => {
      socket.send(
        JSON.stringify({
          type: "action",
          action: { type: "collect-ready-check" },
        }),
      );
    }, 10000);
  }, [socket, userId]);

  const selectReadyState = useCallback(
    (isReady: boolean) => {
      socket.send(
        JSON.stringify({
          type: "action",
          action: {
            type: "confirm-ready",
            userId: userId,
            isReady: isReady,
          },
        }),
      );
    },
    [socket, userId],
  );

  useEffect(() => {
    setOpenReadyCheck(matchStatus === "ready-check");
  }, [matchStatus]);

  const disconnect = useCallback(() => {
    socket.send(createActionMessage({ type: "leave", userId: id }));
  }, [socket, id]);

  function renderGame(player: Player) {
    return (
      <Game
        key={player.id}
        player={player}
        submitMultiplayerGuess={submitMultiplayerGuess}
        submitWinner={submitWinner}
      />
    );
  }

  // Initialize multiplayer game mode
  useEffect(() => {
    setUserId(id);
    setGameMode("multi");
  }, []);

  // Keep checking for a winner and update the game status
  useEffect(() => {
    const winner = players.find((player) => player.isWinner);

    if (!winner) {
      return;
    }

    if (winner.id === userId) {
      setGameStatus(GAME_STATUS.WON);
    } else {
      setGameStatus(GAME_STATUS.LOST);
    }
  }, [players, setGameStatus, userId]);

  // Disconnects the user when they leave the page!!!
  useBeforeUnload(
    useCallback(() => {
      disconnect();
      socket.close();
    }, [disconnect, socket]),
  );

  return (
    <>
      <div className="multiplayer-page-wrapper">
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {players.length <= 4 ? (
            <div className="boards">
              {players.map((player) => renderGame(player))}
              {!players.find((player) => player.id === userId) ? (
                <div className="join-wrapper">
                  <button
                    className="join-button"
                    onClick={() => handleJoin({ type: "join", userId: userId })}
                  >
                    Join the game!
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
          {players.length >= 5 ? (
            <div className="big-layout">
              {!players.find((player) => player.id === userId) ? (
                <div className="join-wrapper">
                  <button
                    className="join-button"
                    onClick={() => handleJoin({ type: "join", userId: userId })}
                  >
                    Join the game!
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {renderGame(
                    players?.find((player) => player.id === userId) as Player,
                  )}
                </div>
              )}
              <div className="boards">
                {players
                  .filter((player) => player.id !== userId)
                  .map((player) => renderGame(player))}
              </div>
            </div>
          ) : null}
        </div>

        <GameFooter
          startReadyCheck={handleStartReadyCheck}
          leaveRoom={disconnect}
        />
      </div>
      <GameSummary />
      <GameReadyCheck
        open={openReadyCheck}
        onClose={() => setOpenReadyCheck(false)}
        handleReadyCheck={selectReadyState}
      />
    </>
  );
}
