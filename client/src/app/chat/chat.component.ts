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
  botTyping: boolean = false; // Flag for showing "Angularbot is typing"

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
    this.initNewMessages();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** --- Initialization --- */
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

  private initChatHistory(): void {
    this.chatService.getChatHistory()
      .pipe(takeUntil(this.destroy$))
      .subscribe(history => {
        this.messages = history;
        scrollToBottom('.messages');
      });
  }

  private initNewMessages(): void {
    this.chatService.onNewMessage()
      .pipe(takeUntil(this.destroy$))
      .subscribe(msg => this.handleNewMessage(msg));
  }

  /** --- Handle new messages --- */
  private handleNewMessage(msg: Message): void {
    if (msg.type === 'bot') {
      this.botTyping = true;
      scrollToBottom('.messages');
      timer(3000)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.botTyping = false;
          this.messages.push(msg);
          scrollToBottom('.messages');
        });


    } else {
      this.messages.push(msg);
      scrollToBottom('.messages');
    }
  }

  /** --- User interactions --- */
  askForUsername(): void {
    const dialogRef = this.dialog.open(UsernameDialogComponent, { disableClose: true });
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(username => {
        if (username) {
          this.currentUserName = username;
          this.userService.setUserName(username);
        }
      });
  }

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

  /** --- Helpers --- */
  isMyMessage(msg: Message): boolean {
    return msg.userId === this.currentUserId;
  }

}
