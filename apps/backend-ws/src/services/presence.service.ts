import WebSocket from "ws";
import { z } from "zod";

const UserSchema = z.object({
  id: z.string(),
  displayName: z.string(),
});

type User = z.infer<typeof UserSchema>;

export interface Connection {
  ws: WebSocket;
  user: User;
}

export class PresenceService {
  activeUsers: Map<string, Connection>;
  wsToUser: Map<WebSocket, string>;

  constructor() {
    this.activeUsers = new Map();
    this.wsToUser = new Map();
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
    this.activeUsers.set(user.id, { ws, user });
    this.wsToUser.set(ws, user.id);

    console.log(`User ${user.id}-${user.displayName} joined`);
    console.log("Currently active users: ", this.activeUsers.size);

    // Broadcast to all users
  }

  public leave(ws: WebSocket) {}
}
