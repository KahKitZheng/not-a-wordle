import type * as Party from "partykit/server";
import { createUpdateMessage, parseActionMessage } from "./types";
import { rateLimit } from "./limiter";
import { getNewWord, randomId } from "../utils";
import { words } from "../constants/words";

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
  answer: string = "";
  matchStatus: MatchStatus = "idle";

  async onStart() {
    // Load counter from storage on startup
    this.players = (await this.room.storage.get<Player[]>("players")) ?? [];
    this.answer = (await this.room.storage.get<string>("answer")) ?? "";
    this.matchStatus =
      (await this.room.storage.get<MatchStatus>("matchStatus")) ?? "idle";
  }

  async onRequest() {
    // For all HTTP request, respond with the current players
    return json(
      createUpdateMessage(this.answer, this.players, this.matchStatus),
    );
  }

  onConnect(connection: Party.Connection) {
    // For all WebSocket connections, send the current players
    connection.send(
      createUpdateMessage(this.answer, this.players, this.matchStatus),
    );
  }

  onMessage(message: string, sender: Party.Connection) {
    // For all WebSocket messages, parse the message and update the count

    // Rate limit incoming messages
    rateLimit(sender, 100, () => {
      const parsed = parseActionMessage(message);
      this.updateAndBroadcastCount(parsed.action);
    });
  }

  updateAndBroadcastCount(action: {
    type:
      | "join"
      | "leave"
      | "guess"
      | "winner"
      | "init-ready-check"
      | "collect-ready-check"
      | "confirm-ready";
    userId?: string;
    guess?: string;
    isReady?: "ready" | "not-ready";
  }) {
    // Update stored count
    if (action.type === "join") {
      this.players.push({
        id: action.userId ?? randomId(),
        name: "Player " + (this.players.length + 1),
        status: "running",
        guesses: [] as string[],
        isReady: undefined,
        isAdmin: this.players.length === 0 ? true : false,
        isWinner: false,
      });

      if (this.players.length === 1) {
        this.answer = getNewWord(words);
      }
    }

    if (action.type === "leave") {
      this.players = this.players.filter(
        (player) => player.id !== action.userId,
      );
    }

    if (action.type === "guess") {
      // add guess to player
      const player = this.players.find((player) => player.id === action.userId);

      if (player && action.guess) {
        player.guesses.push(action.guess);
      }
    }

    if (action.type === "winner") {
      const player = this.players.find((player) => player.id === action.userId);

      if (player) {
        player.isWinner = true;
      }
    }

    if (action.type === "init-ready-check") {
      this.matchStatus = "ready-check";
    }

    if (action.type === "collect-ready-check") {
      const isEveryoneReady = this.players.every((player) => {
        return player.isReady === "ready";
      });

      if (isEveryoneReady) {
        this.matchStatus = "running";
      } else {
        this.matchStatus = "idle";
      }
    }

    if (action.type === "confirm-ready") {
      const player = this.players.find((player) => player.id === action.userId);

      if (player) {
        player.isReady = action.isReady;
      }
    }

    // Send updated count to all connected listeners
    this.room.broadcast(
      createUpdateMessage(this.answer, this.players, this.matchStatus),
    );

    // Store updated count
    this.room.storage.put("players", this.players);
    this.room.storage.put("answer", this.answer);
    this.room.storage.put("matchStatus", this.matchStatus);
  }
}

Server satisfies Party.Worker;
