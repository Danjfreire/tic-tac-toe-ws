import { inject, Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { SERVER_MESSAGE } from '@repo/types/message';
import { BehaviorSubject } from 'rxjs';
import { MatchState, validateMatchState } from '@repo/types/match';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  private wsService = inject(WebsocketService);
  private match = new BehaviorSubject<MatchState | null>(null);

  public activeMatch = this.match.asObservable();

  constructor() {
    this.wsService.on(SERVER_MESSAGE.MATCH_START, this.onMatchStart.bind(this));
  }

  private onMatchStart(data: any) {
    const matchState = validateMatchState(data);

    if (!matchState) return;

    this.match.next(matchState);
  }
}
