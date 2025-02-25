import { PresenceService } from "../services/presence.service.js";
import { WsRouter } from "../services/ws-router.service.js";

// Presence Handlers
WsRouter.instance.on("join", (ws, data) => {
  PresenceService.instance.join(ws, data);
});

WsRouter.instance.on("leave", (ws, data) => {
  PresenceService.instance.leave(ws);
});
