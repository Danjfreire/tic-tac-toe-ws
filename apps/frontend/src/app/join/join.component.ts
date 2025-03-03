import { Component, inject } from '@angular/core';
import { WebsocketService } from '../_shared/websocket.service';
import { v4 as uuid } from 'uuid';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-join',
  imports: [FormsModule],
  templateUrl: './join.component.html',
})
export class JoinComponent {
  wsService: WebsocketService = inject(WebsocketService);
  name = '';

  connect() {
    this.wsService.connect();
  }

  disconnect() {
    this.wsService.disconnect();
  }

  join() {
    const rand = Math.random() * 10;
    this.wsService.send({
      type: 'join',
      payload: { id: uuid(), displayName: `John ${rand}` },
    });
  }
}
