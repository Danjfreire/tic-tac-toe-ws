import { WebSocketServer } from "ws";
import { WsRouter } from "./services/ws-router.service.js";
import { registerHandlers } from "./handlers/register-handlers.js";
import { validateClientMessage } from "@repo/types/message";

const wss = new WebSocketServer({ port: 8080 });

registerHandlers();

wss.on("connection", (ws) => {
  ws.on("error", console.error);

  ws.on("message", (data) => {
    const parsedData = JSON.parse(data.toString());
    const message = validateClientMessage(parsedData);

    if (!message) {
      console.error("Invalid message received from client");
      return;
    }

    WsRouter.instance.handle(message.type, ws, message.payload);
  });

  ws.on("close", () => {
    console.log(
      "Connection closed on the server, should leave the room, and show reconnect flow"
    );
    WsRouter.instance.handle("leave", ws, null);
  });
});

console.log("WebSocket server started on ws://localhost:8080");
