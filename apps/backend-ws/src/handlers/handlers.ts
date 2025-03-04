import { CLIENT_MESSAGE } from "@repo/types/message";
import { MatchmakingService } from "../services/matchmaking.service.js";
import { PresenceService } from "../services/presence.service.js";
import { WsRouter } from "../services/ws-router.service.js";

// Presence Handlers
WsRouter.instance.on(CLIENT_MESSAGE.JOIN, (ws, data) => {
  PresenceService.instance.join(ws, data);
});

WsRouter.instance.on(CLIENT_MESSAGE.LEAVE, (ws, data) => {
  PresenceService.instance.leave(ws);
});

// Matchmaking Handlers
WsRouter.instance.on(CLIENT_MESSAGE.MATCHMAKING_START, (ws, data) => {
  MatchmakingService.instance.findMatch(ws, data);
});

WsRouter.instance.on(CLIENT_MESSAGE.MATCHMAKING_CANCEL, (ws, data) => {
  MatchmakingService.instance.cancelMatchmaking(ws, data);
});

WsRouter.instance.on(CLIENT_MESSAGE.MATCHMAKING_ACCEPT, (ws, data) => {
  MatchmakingService.instance.acceptMatch(ws, data);
});
