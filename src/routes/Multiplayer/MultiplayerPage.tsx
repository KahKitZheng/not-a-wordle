import { useCallback, useContext, useEffect, useMemo } from "react";
import { useBeforeUnload, useParams } from "react-router-dom";
import { GO_AWAY_SENTINEL, SLOW_DOWN_SENTINEL } from "../../constants/partykit";
import Game from "../../components/Game";
import usePartySocket from "partysocket/react";
import { GameContext } from "../../contexts/GameContext";
import { randomId } from "../../utils";
import "./Multiplayer.scss";

// In case of custom setup, change this to your server's host
const host = import.meta.env.PROD
  ? window.location.origin
  : "http://localhost:1999";

export default function MultiplayerPage() {
  const { roomId } = useParams();
  const { userId, setUserId, players, setPlayers, setGameMode } =
    useContext(GameContext);

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
      console.log("message", message);
      setPlayers(message.players);
    },
    [setPlayers],
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

  const handleSubmitGuess = useCallback(
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

  useEffect(() => {
    setUserId(id);
    setGameMode("multi");
  }, []);

  // Disconnects the user when they leave the page!!!
  useBeforeUnload(
    useCallback(() => {
      socket.send(createActionMessage({ type: "leave", userId: id }));
      socket.close();
    }, [id, socket]),
  );

  return (
    <>
      {players.length <= 4 ? (
        <div className="boards">
          {players.map((player) => (
            <Game
              key={player.id}
              player={player}
              handleSubmitGuess={handleSubmitGuess}
            />
          ))}

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
            <Game
              handleSubmitGuess={handleSubmitGuess}
              player={players?.find((player) => player.id === userId) as Player}
            />
          )}

          <div className="boards">
            {players
              .filter((player) => player.id !== userId)
              .map((player) => (
                <Game
                  key={player.id}
                  player={player}
                  handleSubmitGuess={handleSubmitGuess}
                />
              ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
