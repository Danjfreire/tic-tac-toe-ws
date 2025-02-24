import { WebSocketServer } from "ws";
import { MessageHandler } from "./message-handler.js";
import { PresenceService } from "./services/presence.service.js";

const wss = new WebSocketServer({ port: 8080 });

const presenceService = new PresenceService();
const handler = new MessageHandler(presenceService);

wss.on("connection", (ws) => {
  ws.on("error", console.error);

  ws.on("message", (data) => {
    handler.handle(ws, data);
  });

  ws.on("close", () => {
    console.log("Connection closed on the server");
  });

  ws.send("Hello! Message from server, that is recompiling and restarting!");
});

console.log("WebSocket server started on ws://localhost:8080");
