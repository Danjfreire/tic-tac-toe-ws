import WebSocket from "ws";
import { PresenceService } from "./services/presence.service.js";
import { z } from "zod";

const messageSchema = z.object({
  type: z.union([z.literal("join"), z.literal("leave")]),
  payload: z.any(),
});

export class MessageHandler {
  constructor(private presenceService: PresenceService) {}

  public handle(ws: WebSocket, message: any) {
    try {
      const parsedMsg = JSON.parse(message);
      const res = messageSchema.safeParse(parsedMsg);

      if (res.success === false) {
        return;
      }

      if (res.data.type === "join") {
        this.presenceService.join(ws, parsedMsg.payload);
      } else if (parsedMsg.type === "leave") {
        this.presenceService.leave(ws);
      }
    } catch (error) {
      console.error("Error while parsing message", error);
    }
  }
}
