/* eslint-disable no-unused-vars */
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  ClientMessage,
  ClientMessageType,
  ServerMessage,
  ServerMessageType,
} from '@repo/types/message';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private ws: WebSocket | undefined;
  private connectionClosedByServer = new BehaviorSubject<boolean>(false);
  private connectionStatus = new BehaviorSubject<boolean>(false);
  private handlers = new Map<ServerMessageType, ((data: any) => void)[]>();

  public status$ = this.connectionStatus.asObservable();
  public connectionClosedByServer$ =
    this.connectionClosedByServer.asObservable();

  constructor() {
    this.connect();
  }

  on(msgType: ServerMessageType, callback: (data: any) => void): void {
    if (!this.handlers.has(msgType)) {
      this.handlers.set(msgType, []);
    }

    this.handlers.get(msgType)?.push(callback);
  }

  connect(url = 'ws://localhost:8080'): void {
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.connectionStatus.next(true);
      this.connectionClosedByServer.next(false);
      console.log('connected to websocket server');
    };

    this.ws.onclose = () => {
      this.connectionStatus.next(false);
      console.log('disconnected from websocket server');
      console.log('connection closed by server');
      this.connectionClosedByServer.next(true);
    };

    this.ws.onerror = (error) => {
      console.error('websocket error:', error);
    };

    this.ws.onmessage = (message) => {
      console.log('received message:', message.data);
      const serverMessage = JSON.parse(message.data) as ServerMessage;

      // maybe validate using zod or something
      const type = serverMessage.type as ServerMessageType;
      const data = serverMessage.payload;
      if (!type || !data) {
        console.error('received invalid message from server:', serverMessage);
        return;
      }

      const handlers = this.handlers.get(serverMessage.type);
      if (!handlers || handlers?.length === 0) {
        console.log('no handlers for message type:', serverMessage.type);
        return;
      }

      for (const handler of handlers) {
        handler(data);
      }
    };
  }

  disconnect(): void {
    this.ws?.close();
  }

  send(message: ClientMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }
}
