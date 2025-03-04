import { inject, Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import {
  CLIENT_MESSAGE,
  ClientMessage,
  SERVER_MESSAGE,
} from '@repo/types/message';
import { User } from '@repo/types/user';
import { BehaviorSubject } from 'rxjs';
import {
  MatchConfirmation,
  MatchmakingAccept,
  validateMatchConfirmation,
} from '@repo/types/matchmaking';

const ACCEPT_MATCH_TIMER = 15;

@Injectable({
  providedIn: 'root',
})
export class MatchMakingService {
  private wsService: WebsocketService = inject(WebsocketService);
  private matchFound = new BehaviorSubject<{
    match: MatchConfirmation;
    timer: number;
  } | null>(null);
  private acceptMatchIntervalId!: number;

  public matchFound$ = this.matchFound.asObservable();

  constructor() {
    console.log('Server Messages is', SERVER_MESSAGE);
    this.wsService.on(
      SERVER_MESSAGE.MATCHMAKING_UPDATE,
      this.onMatchmakingUpdate.bind(this),
    );
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

  acceptMatch(matchId: string, user: User) {
    const payload: MatchmakingAccept = {
      matchId,
      user,
    };
    const message: ClientMessage = {
      type: CLIENT_MESSAGE.MATCHMAKING_ACCEPT,
      payload,
    };

    this.wsService.send(message);
  }

  private onMatchmakingUpdate(data: any) {
    console.log('matchmaking update');
    const confirmation = validateMatchConfirmation(data);

    if (!confirmation) return;

    const matchFound = this.matchFound.value;

    if (!matchFound || matchFound.match.id !== confirmation.id) {
      return;
    }

    matchFound.match.playersAccepted = confirmation.playersAccepted;

    this.matchFound.next(matchFound);
  }

  private onMatchFound(data: any) {
    const confirmation = validateMatchConfirmation(data);
    console.log(confirmation);

    if (!confirmation) return;

    const matchdFoundValue = { match: confirmation, timer: ACCEPT_MATCH_TIMER };
    this.matchFound.next(matchdFoundValue);

    this.acceptMatchIntervalId = window.setInterval(() => {
      const match = this.matchFound.value;

      if (!match || match.timer <= 0) {
        clearInterval(this.acceptMatchIntervalId);
        this.matchFound.next(null);
        return;
      }

      matchdFoundValue.timer = match.timer - 1;
      this.matchFound.next(matchdFoundValue);
    }, 1000);
  }
}
