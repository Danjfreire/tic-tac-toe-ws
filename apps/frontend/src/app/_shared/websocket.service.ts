import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MessageType } from '@repo/types/message';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private ws: WebSocket | undefined;
  private connectionStatus = new BehaviorSubject<boolean>(false);

  public status$ = this.connectionStatus.asObservable();

  // eslint-disable-next-line no-unused-vars
  on(msgType: MessageType, callback: (data: any) => void): void {
    console.log(msgType, callback);
  }

  connect(url = 'ws://localhost:8080'): void {
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.connectionStatus.next(true);
      console.log('connected to websocket server');
    };

    this.ws.onclose = () => {
      this.connectionStatus.next(false);
      console.log('disconnected from websocket server');
    };

    this.ws.onerror = (error) => {
      console.error('websocket error:', error);
    };

    this.ws.onmessage = (message) => {
      console.log('received message:', message.data);
    };
  }

  disconnect(): void {
    this.ws?.close();
  }

  send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
}
