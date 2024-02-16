import type * as Party from "partykit/server";
import { createUpdateMessage, parseActionMessage } from "./types";
import { rateLimit } from "./limiter";
import { randomId } from "../utils";

const json = (response: string) =>
  new Response(response, {
    headers: {
      "Content-Type": "application/json",
    },
  });

export default class Server implements Party.Server {
  options: Party.ServerOptions = { hibernate: false };
  constructor(readonly room: Party.Room) {}

  players: Player[] = [];

  async onStart() {
    // Load counter from storage on startup
    this.players = (await this.room.storage.get<Player[]>("players")) ?? [];
  }

  async onRequest() {
    // For all HTTP request, respond with the current players
    return json(createUpdateMessage(this.players));
  }

  onConnect(connection: Party.Connection) {
    // For all WebSocket connections, send the current players
    connection.send(createUpdateMessage(this.players));
  }

  onMessage(message: string, sender: Party.Connection) {
    // For all WebSocket messages, parse the message and update the count

    // Rate limit incoming messages
    rateLimit(sender, 100, () => {
      const parsed = parseActionMessage(message);

      console.log("parsed", parsed);

      this.updateAndBroadcastCount(parsed.action);
    });
  }

  updateAndBroadcastCount(action: { type: "join" | "leave"; userId?: string }) {
    // Update stored count
    if (action.type === "join") {
      this.players.push({
        id: action.userId ?? randomId(),
        name: "Player " + (this.players.length + 1),
        status: "running",
        guesses: [] as string[],
      });
    }

    if (action.type === "leave") {
      this.players = this.players.filter(
        (player) => player.id !== action.userId,
      );
    }

    // Send updated count to all connected listeners
    this.room.broadcast(createUpdateMessage(this.players));
    // Store updated count
    this.room.storage.put("players", this.players);

    console.log("players", this.players);
  }
}

Server satisfies Party.Worker;
