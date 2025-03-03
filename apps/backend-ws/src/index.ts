import { WebSocketServer } from "ws";
import { WsRouter } from "./services/ws-router.service.js";
import { registerHandlers } from "./handlers/register-handlers.js";

const wss = new WebSocketServer({ port: 8080 });

registerHandlers();

wss.on("connection", (ws) => {
  ws.on("error", console.error);

  ws.on("message", (data) => {
    const { type, payload } = JSON.parse(data as any);

    if (!type || payload == undefined) {
      console.error("Invalid message format", type, payload);
      return;
    }

    WsRouter.instance.handle(type, ws, payload);
  });

  ws.on("close", () => {
    console.log("Connection closed on the server");
    WsRouter.instance.handle("leave", ws, null);
  });
});

console.log("WebSocket server started on ws://localhost:8080");
