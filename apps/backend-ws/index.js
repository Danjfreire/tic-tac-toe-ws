import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  ws.on("error", console.error);

  ws.on("message", (data) => {
    console.log(`Received message: ${data}`);
  });

  ws.on("close", () => {
    console.log("Connection closed on the server");
  });

  ws.send("Hello! Message from server!");
});

console.log("WebSocket server started on ws://localhost:8080");
