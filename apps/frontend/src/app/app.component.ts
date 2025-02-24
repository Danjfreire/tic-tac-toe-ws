import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WebsocketService } from './websocket.service';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  wsService: WebsocketService = inject(WebsocketService);

  connect() {
    this.wsService.connect();
  }

  disconnect() {
    this.wsService.disconnect();
  }

  sendData() {
    this.wsService.send({
      type: 'join',
      payload: { id: uuid(), displayName: 'John Doe' },
    });
  }
}
