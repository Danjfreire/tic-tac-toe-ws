import { inject, Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { v4 as uuid } from 'uuid';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private wsService: WebsocketService = inject(WebsocketService);
  private user = new BehaviorSubject<{
    id: string;
    displayName: string;
  } | null>(null);
  private userCount = new BehaviorSubject<number>(0);

  public userCount$ = this.userCount.asObservable();
  public user$ = this.user.asObservable();

  constructor() {
    this.wsService.on('join-success', this.onJoinSuccess.bind(this));
    this.wsService.on('users-online', this.updateUserCount.bind(this));
  }

  join(name: string) {
    this.wsService.send('join', { id: uuid(), displayName: name });
  }

  private onJoinSuccess(data: any) {
    this.user.next(data);
  }

  private onJoinFailure() {
    //  handle this
  }

  private updateUserCount(data: any) {
    if (data.count === undefined) {
      return;
    }

    this.userCount.next(data.count);
  }
}
