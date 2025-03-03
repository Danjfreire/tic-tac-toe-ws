import { validateUser } from "@repo/types/user";

export class MatchmakingService {
  private static _instance: MatchmakingService;

  private userQueue: string[] = [];

  private constructor() {}

  public static get instance() {
    if (!MatchmakingService._instance) {
      MatchmakingService._instance = new MatchmakingService();
    }

    return MatchmakingService._instance;
  }

  public findMatch(ws: WebSocket, data: any) {
    // do validation

    const user = validateUser(data);

    if (!user) return; // maybe send an error message

    if (this.userQueue.length === 0) {
      this.userQueue.push(user.id);
      return;
    }

    const opponentId = this.userQueue.shift();

    // start match
  }
}
