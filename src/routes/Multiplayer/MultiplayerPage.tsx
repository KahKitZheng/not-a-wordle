import { useCallback, useContext, useEffect, useMemo } from "react";
import { useBeforeUnload, useParams } from "react-router-dom";
import { GO_AWAY_SENTINEL, SLOW_DOWN_SENTINEL } from "../../constants/partykit";
import Game from "../../components/Game";
import usePartySocket from "partysocket/react";
import { GameContext } from "../../contexts/GameContext";
import { randomId } from "../../utils";

// In case of custom setup, change this to your server's host
const host = import.meta.env.PROD
  ? window.location.origin
  : "http://localhost:1999";

export default function MultiplayerPage() {
  const { roomId } = useParams();
  const { userId, setUserId, players, setPlayers } = useContext(GameContext);

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
    (action: { type: "join" | "leave"; userId?: string }) => {
      socket.send(createActionMessage(action));
    },
    [socket],
  );

  useEffect(() => {
    setUserId(id);
  }, []);

  // Disconnects the user when they leave the page!!!
  useBeforeUnload(
    useCallback(() => {
      socket.send(createActionMessage({ type: "leave", userId: id }));
    }, [id, socket]),
  );

  return (
    <>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <p style={{ margin: 0 }}>number of players: {players?.length}</p>
          <p style={{ margin: 0 }}>room id: {roomId}</p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(0, 1fr))",
          gridAutoFlow: "row",
          gap: "1rem",
          width: "100%",
          marginTop: "2rem",
          padding: "0 4rem",
        }}
      >
        {players.map((player) => (
          <Game key={player.id} player={player} />
        ))}
        {!players.find((player) => player.id === userId) ? (
          <button
            style={{
              display: "grid",
              placeContent: "center",
              height: "10rem",
              width: "10rem",
              border: "1px solid black",
              borderRadius: "6px",
              backgroundColor: "transparent",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "600",
              padding: "1rem",
            }}
            onClick={() => handleJoin({ type: "join", userId: userId })}
          >
            Join the game!
          </button>
        ) : null}
      </div>
    </>
  );
}
