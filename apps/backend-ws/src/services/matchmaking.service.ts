import { validateUser } from "@repo/types/user";
import WebSocket from "ws";
import { v4 as uuid } from "uuid";
import { PresenceService } from "./presence.service.js";
import { SERVER_MESSAGE, ServerMessage } from "@repo/types/message";
import {
  MatchConfirmation,
  validateMatchmakingAccept,
} from "@repo/types/matchmaking";

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

  public acceptMatch(ws: WebSocket, data: any) {
    const accept = validateMatchmakingAccept(data);

    if (!accept) return;

    const { matchId, user } = accept;
    const matchConfirmation = this.pendingMatchConfirmations.get(matchId);
    if (!matchConfirmation) return;

    matchConfirmation.playersAccepted.push(user.id);

    // send update to both players
    const player1 = PresenceService.instance.getUser(
      matchConfirmation.player1Id
    );
    const player2 = PresenceService.instance.getUser(
      matchConfirmation.player2Id
    );

    if (!player1 || !player2) {
      return;
    }

    const sockets = [player1.ws, player2.ws];
    const message: ServerMessage = {
      type: SERVER_MESSAGE.MATCHMAKING_UPDATE,
      payload: matchConfirmation,
    };
    const messageString = JSON.stringify(message);
    for (const socket of sockets) {
      socket.send(messageString);
    }

    // start the match
    if (matchConfirmation.playersAccepted.length === 2) {
      // TODO
      console.log("starting match", matchConfirmation);
      return;
    }
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
      player1Id: player1.user.id,
      player2Id: player2.user.id,
      playersAccepted: [],
    };

    console.log("created match confirmation", matchConfirmation);

    this.pendingMatchConfirmations.set(matchId, matchConfirmation);
    const sockets = [player1.ws, player2.ws];
    const message: ServerMessage = {
      type: SERVER_MESSAGE.MATCHMAKING_FOUND,
      payload: matchConfirmation,
    };
    const messageString = JSON.stringify(message);
    for (const socket of sockets) {
      socket.send(messageString);
    }

    // clean up confirmation if it is not accepted in time
    setTimeout(() => {
      if (this.pendingMatchConfirmations.has(matchId)) {
        console.log("match confirmation expired", matchId);
        this.pendingMatchConfirmations.delete(matchId);
      }
    }, 20000);
  }
}
