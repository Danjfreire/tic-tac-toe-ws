import { inject, Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import {
  CLIENT_MESSAGE,
  ClientMessage,
  SERVER_MESSAGE,
} from '@repo/types/message';
import { User } from '@repo/types/user';
import { BehaviorSubject } from 'rxjs';

const ACCEPT_MATCH_TIMER = 10;

@Injectable({
  providedIn: 'root',
})
export class MatchMakingService {
  private wsService: WebsocketService = inject(WebsocketService);
  private matchFound = new BehaviorSubject<{
    id: string;
    timer: number;
  } | null>(null);
  private acceptMatchIntervalId!: number;

  public matchFound$ = this.matchFound.asObservable();

  constructor() {
    this.wsService.on(
      SERVER_MESSAGE.MATCHMAKING_FOUND,
      this.onMatchFound.bind(this),
    );
  }

  findMatch(user: User) {
    const message: ClientMessage = {
      type: CLIENT_MESSAGE.MATCHMAKING_START,
      payload: user,
    };

    this.matchFound.next(null);
    this.wsService.send(message);
  }

  cancelMatchmaking(user: User) {
    const message: ClientMessage = {
      type: CLIENT_MESSAGE.MATCHMAKING_CANCEL,
      payload: user,
    };

    this.wsService.send(message);
  }

  private onMatchFound(data: any) {
    if (!data.matchId) return;

    this.matchFound.next({ id: data.matchId, timer: ACCEPT_MATCH_TIMER });

    this.acceptMatchIntervalId = window.setInterval(() => {
      const match = this.matchFound.value;

      if (!match || match.timer <= 0) {
        clearInterval(this.acceptMatchIntervalId);
        this.matchFound.next(null);
        return;
      }

      this.matchFound.next({ id: match.id, timer: match.timer - 1 });
    }, 1000);
  }
}
