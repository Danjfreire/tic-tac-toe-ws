import { inject, Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { ClientMessage } from '@repo/types/message';
import { User } from '@repo/types/user';

@Injectable({
  providedIn: 'root',
})
export class MatchMakingService {
  private wsService: WebsocketService = inject(WebsocketService);

  findMatch(user: User) {
    const message: ClientMessage = {
      type: 'start-matchmaking',
      payload: user,
    };

    this.wsService.send(message);
  }

  cancelMatchmaking(user: User) {
    const message: ClientMessage = {
      type: 'cancel-matchmaking',
      payload: user,
    };

    this.wsService.send(message);
  }
}
