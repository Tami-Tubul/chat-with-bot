import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Message } from '../models/message.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  private socket: Socket;
  private socketId$ = new BehaviorSubject<string | null>(null);

  constructor() {

    this.socket = io(environment.apiUrl, {
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      this.socketId$.next(this.socket.id!);
      console.log('Connected! Socket ID:', this.socket.id);
    });

  }

  getSocketId(): Observable<string> {
    return this.socketId$.asObservable().pipe(
      filter((id): id is string => id !== null)
    );
  }


  getChatHistory(): Observable<Message[]> {
    return new Observable(observer => {
      this.socket.on('chatHistory', (messages: Message[]) => {
        observer.next(messages);
      });
    });
  }

  onNewMessage(): Observable<Message> {
    return new Observable(observer => {
      this.socket.on('newMessage', (msg: Message) => {
        observer.next(msg);
      });
    });
  }

  sendMessage(msg: { text: string, userId: string, userName: string }) {
    this.socket.emit('sendMessage', msg);
  }

}
