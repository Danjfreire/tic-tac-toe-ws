import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WebsocketService } from './websocket.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
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
    this.wsService.send({ message: 'Hello, world!' });
  }
}
