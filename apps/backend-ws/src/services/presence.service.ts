import WebSocket from "ws";
import { z } from "zod";

const UserSchema = z.object({
  id: z.string(),
  displayName: z.string(),
});

type User = z.infer<typeof UserSchema>;

export class PresenceService {
  private static _instance: PresenceService;

  private userToWs: Map<string, WebSocket>;
  private wsToUser: Map<WebSocket, string>;

  private constructor() {
    console.log("this ran");
    this.userToWs = new Map();
    this.wsToUser = new Map();
    console.log(this.userToWs);
    console.log(this.wsToUser);
  }

  public static get instance() {
    if (!PresenceService._instance) {
      PresenceService._instance = new PresenceService();
    }

    return PresenceService._instance;
  }

  public join(ws: WebSocket, data: any) {
    // try to parse the data
    const res = UserSchema.safeParse(data);

    if (!res.success) {
      return;
    }

    // check if the user has already joined
    if (this.wsToUser.has(ws)) {
      console.log("This user has already joined, skipping...");
      return;
    }

    const user = res.data;
    this.userToWs.set(user.id, ws);
    this.wsToUser.set(ws, user.id);

    console.log(`User ${user.id}-${user.displayName} joined`);
    console.log("Currently active users: ", this.userToWs.size);
    // Broadcast the current amount of users to all users
    this.broadcastUserCount();
  }

  public leave(ws: WebSocket) {
    const userId = this.wsToUser.get(ws);

    if (!userId) {
      return;
    }

    this.userToWs.delete(userId);
    this.wsToUser.delete(ws);

    console.log(`User ${userId} left`);
    this.broadcastUserCount();
  }

  private broadcastUserCount() {
    const message = JSON.stringify({
      type: "user-count",
      payload: { count: this.userToWs.size },
    });
    for (const ws of this.userToWs.values()) {
      ws.send(message);
    }
  }
}
