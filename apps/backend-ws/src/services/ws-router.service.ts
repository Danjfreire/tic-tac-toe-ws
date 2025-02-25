import WebSocket from "ws";

export class WsRouter {
  private static _instance: WsRouter;
  private routerMap: Map<string, (ws: WebSocket, data: any) => void>;

  private constructor() {
    this.routerMap = new Map();
  }

  public static get instance() {
    if (!WsRouter._instance) {
      WsRouter._instance = new WsRouter();
    }

    return WsRouter._instance;
  }

  public handle(message: string, ws: WebSocket, data: any) {
    const handler = this.routerMap.get(message);

    if (!handler) {
      console.error(`No handler found for message: ${message}`);
      return;
    }

    handler(ws, data);
  }

  public on(message: string, cb: (ws: WebSocket, data: any) => void) {
    this.routerMap.set(message, cb);
  }
}
