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

    // Load existing username; ask for one if not set
    const storedName = this.userService.getUserName();
    if (!storedName) {
      this.askForUsername(); // Open dialog to request username
    }

    // Subscribe to socket ID and save if needed
    this.chatService.getSocketId().subscribe(id => {
      if (id && !this.currentUserId) {
        this.currentUserId = id;
        this.userService.setUserId(id); // Save to localStorage
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
      if (msg.type === 'bot') { // If message is from bot
        this.botTyping = true;
        this.scrollToBottom();

        setTimeout(() => {
          this.botTyping = false;
          this.messages.push(msg);
          this.scrollToBottom();
        }, 3000)
      }
      else {  // If message is from a user
        this.messages.push(msg);
        this.scrollToBottom();
      }
    });
  }

  // Opens a dialog for the user to enter their username
  askForUsername() {
    const dialogRef = this.dialog.open(UsernameDialogComponent, {
      disableClose: true, // Prevent closing dialog without entering a name
    });

    dialogRef.afterClosed().subscribe(username => {
      if (username) {
        this.currentUserName = username;
        this.userService.setUserName(username); // Save username in localStorage
        console.log('Username saved:', username);
      }
    });
  }

  // Sends a new chat message
  onSend(text: string) {
    if (!text.trim()) return; // Do nothing if text is empty

    this.chatService.sendMessage({
      text,
      userId: this.currentUserId,
      userName: this.currentUserName
    });
    this.scrollToBottom();
  }

  // Checks if a message was sent by the current user
  isMyMessage(msg: Message) {
    return msg.userId === this.currentUserId;
  }

  // Scrolls the chat container to the bottom
  scrollToBottom() {
    setTimeout(() => {
      const container = document.querySelector('.messages');
      if (container) container.scrollTop = container.scrollHeight;
    }, 100);
  }

}
