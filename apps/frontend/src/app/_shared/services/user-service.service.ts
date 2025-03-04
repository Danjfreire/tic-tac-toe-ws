import { inject, Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { v4 as uuid } from 'uuid';
import { BehaviorSubject } from 'rxjs';
import { User } from '@repo/types/user';
import { CLIENT_MESSAGE, SERVER_MESSAGE } from '@repo/types/message';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private wsService: WebsocketService = inject(WebsocketService);
  private user = new BehaviorSubject<User | null>(null);
  private userCount = new BehaviorSubject<number>(0);

  public userCount$ = this.userCount.asObservable();
  public user$ = this.user.asObservable();

  constructor() {
    this.wsService.on(SERVER_MESSAGE.JOINED, this.onJoinSuccess.bind(this));
    this.wsService.on(SERVER_MESSAGE.LEFT, this.onLeaveSuccess.bind(this));
    this.wsService.on(
      SERVER_MESSAGE.USERS_ONLINE,
      this.updateUserCount.bind(this),
    );

    this.wsService.status$.subscribe((connected) => {
      if (connected === false) {
        this.onLeaveSuccess();
      }
    });
  }

  getUser() {
    return this.user.value;
  }

  join(name: string) {
    this.wsService.send({
      type: CLIENT_MESSAGE.JOIN,
      payload: { id: uuid(), displayName: name },
    });
  }

  leave() {
    this.wsService.send({
      type: CLIENT_MESSAGE.LEAVE,
      payload: { id: this.user.value?.id },
    });
  }

  private onJoinSuccess(data: any) {
    this.user.next(data);
  }

  private onLeaveSuccess() {
    this.user.next(null);
  }

  private onJoinFailure() {
    // maybe handle this
  }

  private updateUserCount(data: any) {
    if (data.count === undefined) {
      return;
    }

    this.userCount.next(data.count);
  }
}
