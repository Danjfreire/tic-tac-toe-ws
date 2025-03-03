import WebSocket from "ws";
import { ServerMessage } from "@repo/types/message";
import { User, validateUser } from "@repo/types/user";

export class PresenceService {
  private static _instance: PresenceService;

  private userToWs: Map<string, WebSocket>;
  private userToData: Map<string, User>;
  private wsToUser: Map<WebSocket, string>;

  private constructor() {
    this.userToWs = new Map();
    this.wsToUser = new Map();
    this.userToData = new Map();
  }

  public static get instance() {
    if (!PresenceService._instance) {
      PresenceService._instance = new PresenceService();
    }

    return PresenceService._instance;
  }

  public join(ws: WebSocket, data: any) {
    // try to parse the data
    const user = validateUser(data);

    if (!user) {
      return;
    }

    // check if the user has already joined
    if (this.wsToUser.has(ws)) {
      return;
    }

    this.userToWs.set(user.id, ws);
    this.userToData.set(user.id, user);
    this.wsToUser.set(ws, user.id);

    this.joinSuccess(ws, user.id);
    this.broadcastUserCount();
  }

  public leave(ws: WebSocket) {
    const userId = this.wsToUser.get(ws);

    if (!userId) {
      return;
    }

    this.userToWs.delete(userId);
    this.userToData.delete(userId);
    this.wsToUser.delete(ws);

    this.leaveSuccess(ws, userId);
    this.broadcastUserCount();
  }

  public getUser(userId: string): { user: User; ws: WebSocket } | null {
    const user = this.userToData.get(userId);
    const ws = this.userToWs.get(userId);

    if (!user || !ws) {
      return null;
    }

    return { user, ws };
  }

  private joinSuccess(ws: WebSocket, userId: string) {
    const user = this.userToData.get(userId);
    const serverMessage: ServerMessage = {
      type: "join-success",
      payload: user,
    };

    ws.send(JSON.stringify(serverMessage));
  }

  private leaveSuccess(ws: WebSocket, userId: string) {
    const serverMessage: ServerMessage = {
      type: "leave-success",
      payload: { userId },
    };

    ws.send(JSON.stringify(serverMessage));
  }

  private broadcastUserCount() {
    const serverMessage: ServerMessage = {
      type: "users-online",
      payload: { count: this.userToWs.size },
    };

    // Maybe add some logic to debounce the broadcast if too many users are joining/leaving
    const message = JSON.stringify(serverMessage);

    for (const ws of this.userToWs.values()) {
      ws.send(message);
    }
  }
}
