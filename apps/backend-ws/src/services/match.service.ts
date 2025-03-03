import { v4 as uuid } from "uuid";
import { PresenceService } from "./presence.service.js";
import { MatchState } from "@repo/types/match";
import WebSocket from "ws";
import { ServerMessage } from "@repo/types/message";

interface Match {
  id: string;
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

  startMatch(user1: string, user2: string) {
    // get the data for both users
    const player1 = PresenceService.instance.getUser(user1);
    const player2 = PresenceService.instance.getUser(user2);

    if (!player1 || !player2) {
      console.error("Could not find users to start match");
      return false;
    }

    const matchId = uuid();
    const state: MatchState = {
      player1: player1.user,
      player2: player2.user,
      currentTurn: player1.user.id,
      board: new Array(3).fill(new Array(3).fill("")),
    };

    const match: Match = {
      id: matchId,
      state,
      playerSockets: [player1.ws, player2.ws],
    };

    this.matchMap.set(matchId, match);

    // broadcast to both users that the match has started
    this.broadcastMatchState("match-started", match);

    return true;
  }

  private broadcastMatchState(
    messageType: "match-started" | "match-update",
    match: Match
  ) {
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
