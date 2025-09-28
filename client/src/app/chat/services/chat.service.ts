import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Message } from '../models/message.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  private socket: Socket; // Socket.IO client instance
  private socketId$ = new BehaviorSubject<string | null>(null); // Holds the socket ID as an observable

  constructor() {

    // Initialize Socket.IO client with URL and transports
    this.socket = io(environment.apiUrl, {
      transports: ['websocket', 'polling'] // Use WebSocket first, fallback to polling
    });

    // Listen for connection and update socketId$
    this.socket.on('connect', () => {
      this.socketId$.next(this.socket.id!);
      console.log('Connected! Socket ID:', this.socket.id);
    });

  }

  // Returns an observable of the socket ID, filtered to emit only non-null values
  getSocketId(): Observable<string> {
    return this.socketId$.asObservable().pipe(
      filter((id): id is string => id !== null) // Type guard ensures non-null IDs
    );
  }

  // Returns an observable of chat history messages from the server
  getChatHistory(): Observable<Message[]> {
    return new Observable(observer => {
      this.socket.on('chatHistory', (messages: Message[]) => {
        observer.next(messages); // Emit received chat history to subscriber
      });
    });
  }

  // Returns an observable of new incoming messages from the server
  onNewMessage(): Observable<Message> {
    return new Observable(observer => {
      this.socket.on('newMessage', (msg: Message) => {
        observer.next(msg); // Emit new message to subscriber
      });
    });
  }

  // Sends a message to the server via Socket.IO
  sendMessage(msg: { text: string, userId: string, userName: string }) {
    this.socket.emit('sendMessage', msg); // Emit sendMessage event with message payload
  }

}
