import { Component } from '@angular/core';
import { ChatService } from './services/chat.service';
import { Message } from './models/message.model';
import { UserService } from './services/user.service';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { ChatInputComponent } from './components/chat-input/chat-input.component';
import { UsernameDialogComponent } from '../shared/components/username-dialog/username-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Subject, Subscription, takeUntil, timer } from 'rxjs';
import { scrollToBottom } from '../shared/utils/auto-scroll';

@Component({
  selector: 'app-chat',
  imports: [ChatMessageComponent, ChatInputComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  messages: Message[] = []; // List of chat messages
  typingUsers: { userId: string, userName: string }[] = [];


  currentUserId: string = "";
  currentUserName: string = "";

  private destroy$ = new Subject<void>();

  constructor(public chatService: ChatService,
    private userService: UserService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.initUser();
    this.initSocketId();
    this.initChatHistory();
    this.initTypingEvents();
    this.initNewMessages();
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** --- Initialization --- */

  /** Initializes the current user ID and username from UserService or asks for username. */
  private initUser(): void {
    const storedId = this.userService.getUserId();
    if (storedId) {
      this.currentUserId = storedId;
    }

    const storedName = this.userService.getUserName();
    if (!storedName) {
      this.askForUsername();
    } else {
      this.currentUserName = storedName;
    }
  }

  /** Subscribes to the socket ID from ChatService and stores it in UserService. */
  private initSocketId(): void {
    this.chatService.getSocketId()
      .pipe(takeUntil(this.destroy$))
      .subscribe(id => {
        if (id && !this.currentUserId) {
          this.currentUserId = id;
          this.userService.setUserId(id);
        }
      });
  }

  /** Fetches the chat history from the server and scrolls to bottom. */
  private initChatHistory(): void {
    this.chatService.getChatHistory()
      .pipe(takeUntil(this.destroy$))
      .subscribe(history => {
        this.messages = history;
        scrollToBottom('.messages');
      });
  }

  /** Listens for other users typing and stop-typing events and updates the typingUsers array accordingly. */
  private initTypingEvents(): void {
    this.chatService.onUserTyping()
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ userId, userName }) => {
        if (userId !== this.currentUserId && !this.typingUsers.find(u => u.userId === userId)) {
          this.typingUsers.push({ userId, userName });
        }
      });

    this.chatService.onUserStopTyping()
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ userId }) => {
        this.typingUsers = this.typingUsers.filter(u => u.userId !== userId);
      });
  }

  /** Subscribes to new incoming messages from the server. */
  private initNewMessages(): void {
    this.chatService.onNewMessage()
      .pipe(takeUntil(this.destroy$))
      .subscribe(msg => this.handleNewMessage(msg));
  }

  /** --- Handle new messages --- */
  private handleNewMessage(msg: Message): void {
    this.messages.push(msg);
    scrollToBottom('.messages');
  }

  /** Opens a dialog to prompt the user for a username if none exists. */
  askForUsername(): void {
    const dialogRef = this.dialog.open(UsernameDialogComponent,
      {
        disableClose: true,
        autoFocus: true
      });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(username => {
        if (username) {
          this.currentUserName = username;
          this.userService.setUserName(username);
        }
      });
  }

  /** Sends a message to the server and scrolls the chat to the bottom. */
  onSend(text: string): void {
    const trimmed = text.trim();
    if (!trimmed) return;

    this.chatService.sendMessage({
      text: trimmed,
      userId: this.currentUserId,
      userName: this.currentUserName
    });
    scrollToBottom('.messages');
  }

  /** Returns true if the given message was sent by the current user. */
  isMyMessage(msg: Message): boolean {
    return msg.userId === this.currentUserId;
  }

}
