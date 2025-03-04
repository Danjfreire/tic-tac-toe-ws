import { v4 as uuid } from "uuid";
import { PresenceService } from "./presence.service.js";
import { MatchState } from "@repo/types/match";
import WebSocket from "ws";
import {
  SERVER_MESSAGE,
  ServerMessage,
  ServerMessageType,
} from "@repo/types/message";
import { MatchConfirmation } from "@repo/types/matchmaking";

interface Match {
  id: string;
  status: "pending" | "started" | "finished";
  state: MatchState;
  playerSockets: WebSocket[];
}

export class MatchService {
  private static _instance: MatchService;

  private matchMap: Map<string, Match> = new Map();

  private constructor() {}

  public static get instance() {
    if (!MatchService._instance) {
      MatchService._instance = new MatchService();
    }

    return MatchService._instance;
  }

  startMatch(confirmation: MatchConfirmation) {
    // get the data for both users
    const player1 = PresenceService.instance.getUser(confirmation.player1Id);
    const player2 = PresenceService.instance.getUser(confirmation.player2Id);

    if (!player1 || !player2) {
      console.error("Could not find users to start match");
      return false;
    }

    const matchId = confirmation.id;
    const state: MatchState = {
      player1: player1.user,
      player2: player2.user,
      currentTurn: player1.user.id,
      board: new Array(3).fill(new Array(3).fill("")),
    };

    const match: Match = {
      id: matchId,
      status: "pending",
      state,
      playerSockets: [player1.ws, player2.ws],
    };

    this.matchMap.set(matchId, match);

    // broadcast to both users that the match has started
    this.broadcastMatchState(match);

    return true;
  }

  private broadcastMatchState(match: Match) {
    const messageType: ServerMessageType =
      match.status === "pending"
        ? SERVER_MESSAGE.MATCH_START
        : SERVER_MESSAGE.MATCH_UPDATE;

    const matchStartedMessage: ServerMessage = {
      type: messageType,
      payload: match.state,
    };

    const matchStartedMessageString = JSON.stringify(matchStartedMessage);
    match.playerSockets.forEach((ws) => {
      ws.send(matchStartedMessageString);
    });
  }
}
