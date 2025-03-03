import { ClientMessageType } from "@repo/types/message";
import WebSocket from "ws";

export class WsRouter {
  private static _instance: WsRouter;
  private routeHandlers: Map<
    ClientMessageType,
    ((ws: WebSocket, data: any) => void)[]
  >;

  private constructor() {
    this.routeHandlers = new Map();
  }

  public static get instance() {
    if (!WsRouter._instance) {
      WsRouter._instance = new WsRouter();
    }

    return WsRouter._instance;
  }

  public handle(message: ClientMessageType, ws: WebSocket, data: any) {
    const handlers = this.routeHandlers.get(message);

    if (!handlers) {
      console.error(`No handler found for message: ${message}`);
      return;
    }

    for (const handler of handlers) {
      handler(ws, data);
    }
  }

  public on(
    message: ClientMessageType,
    cb: (ws: WebSocket, data: any) => void
  ) {
    if (!this.routeHandlers.has(message)) {
      this.routeHandlers.set(message, []);
    }

    this.routeHandlers.get(message)?.push(cb);
  }
}
