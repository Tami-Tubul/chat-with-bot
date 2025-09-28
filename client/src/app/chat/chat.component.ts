import { Component } from '@angular/core';
import { ChatService } from './services/chat.service';
import { Message } from './models/message.model';
import { UserService } from './services/user.service';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { ChatInputComponent } from './components/chat-input/chat-input.component';
import { UsernameDialogComponent } from '../shared/components/username-dialog/username-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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

  constructor(public chatService: ChatService, private userService: UserService, private dialog: MatDialog) {

    // Load existing ID from storage
    const storedId = this.userService.getUserId();
    if (storedId) {
      this.currentUserId = storedId;
      console.log('Loaded currentUserId from localStorage:', this.currentUserId);
    }

    const storedName = this.userService.getUserName();
    if (!storedName) {
      this.askForUsername();
    }

    // Subscribe to socket ID and save if needed
    this.chatService.getSocketId().subscribe(id => {
      if (id && !this.currentUserId) {
        this.currentUserId = id;
        this.userService.setUserId(id);
        console.log('Saved new currentUserId to localStorage:', this.currentUserId);
      }
    });

    // Load history
    this.chatService.getChatHistory().subscribe(history => {
      this.messages = history;
      this.scrollToBottom();
    });

    // Listen for new messages
    this.chatService.onNewMessage().subscribe(msg => {
      if (msg.type === 'bot') {
        this.botTyping = true;
        this.scrollToBottom();

        setTimeout(() => {
          this.botTyping = false;
          this.messages.push(msg);
          this.scrollToBottom();
        }, 3000)
      }
      else {
        this.messages.push(msg);
        this.scrollToBottom();
      }
    });
  }

  askForUsername() {
    const dialogRef = this.dialog.open(UsernameDialogComponent, {
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(username => {
      if (username) {
        this.currentUserName = username;
        this.userService.setUserName(username);
        console.log('Username saved:', username);
      }
    });
  }

  onSend(text: string) {
    if (!text.trim()) return;

    this.chatService.sendMessage({
      text,
      userId: this.currentUserId,
      userName: this.currentUserName
    });
    this.scrollToBottom();
  }

  isMyMessage(msg: Message) {
    return msg.userId === this.currentUserId;
  }

  scrollToBottom() {
    setTimeout(() => {
      const container = document.querySelector('.messages');
      if (container) container.scrollTop = container.scrollHeight;
    }, 100);
  }

}
