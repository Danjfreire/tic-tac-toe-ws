import { validateUser } from "@repo/types/user";
import WebSocket from "ws";
import { MatchService } from "./match.service.js";
import { v4 as uuid } from "uuid";
import { PresenceService } from "./presence.service.js";
import { ServerMessage } from "@repo/types/message";

interface MatchConfirmation {
  id: string;
  player1: string;
  player2: string;
}

export class MatchmakingService {
  private static _instance: MatchmakingService;

  private matchmakingQueue: string[] = [];
  private pendingMatchConfirmations = new Map<string, MatchConfirmation>();

  private constructor() {}

  public static get instance() {
    if (!MatchmakingService._instance) {
      MatchmakingService._instance = new MatchmakingService();
    }

    return MatchmakingService._instance;
  }

  public findMatch(ws: WebSocket, data: any) {
    const user = validateUser(data);

    if (!user) return; // maybe send an error message

    const opponentId = this.matchmakingQueue.shift();
    if (!opponentId) {
      console.log("no opponent found, adding to queue");
      this.matchmakingQueue.push(user.id);
      return;
    }

    console.log("found opponent", opponentId);

    this.createMatchConfirmation(user.id, opponentId);
  }

  public cancelMatchmaking(ws: WebSocket, data: any) {
    const user = validateUser(data);
    if (!user) return;

    const index = this.matchmakingQueue.indexOf(user.id);
    if (index === -1) return;

    this.matchmakingQueue.splice(index, 1);
    console.log("removed user from queue", user.id);
    console.log("Queue size:", this.matchmakingQueue.length);
  }

  private createMatchConfirmation(p1Id: string, p2Id: string) {
    const player1 = PresenceService.instance.getUser(p1Id);
    const player2 = PresenceService.instance.getUser(p2Id);

    if (!player1 || !player2) {
      return;
    }

    // add confirmation message
    const matchId = uuid();
    const matchConfirmation: MatchConfirmation = {
      id: matchId,
      player1: player1.user.id,
      player2: player2.user.id,
    };

    console.log("created match confirmation", matchConfirmation);

    this.pendingMatchConfirmations.set(matchId, matchConfirmation);
    const sockets = [player1.ws, player2.ws];
    const message: ServerMessage = {
      type: "found-match",
      payload: {
        matchId,
      },
    };
    const messageString = JSON.stringify(message);
    for (const socket of sockets) {
      socket.send(messageString);
    }
  }
}
