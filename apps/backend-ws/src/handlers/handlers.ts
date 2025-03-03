import { MatchmakingService } from "../services/matchmaking.service.js";
import { PresenceService } from "../services/presence.service.js";
import { WsRouter } from "../services/ws-router.service.js";

// Presence Handlers
WsRouter.instance.on("join", (ws, data) => {
  PresenceService.instance.join(ws, data);
});

WsRouter.instance.on("leave", (ws, data) => {
  PresenceService.instance.leave(ws);
});

// Matchmaking Handlers
WsRouter.instance.on("start-matchmaking", (ws, data) => {
  MatchmakingService.instance.findMatch(ws, data);
});

WsRouter.instance.on("cancel-matchmaking", (ws, data) => {
  MatchmakingService.instance.cancelMatchmaking(ws, data);
});
