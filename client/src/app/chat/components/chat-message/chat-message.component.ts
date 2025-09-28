import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../../models/message.model';
import { AppMaterialModule } from '../../../app.material.module';

@Component({
  selector: 'app-message',
  imports: [CommonModule, AppMaterialModule],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatMessageComponent {
  @Input() message!: Message;
  @Input() currentUserId!: string;

  isMyMessage(): boolean {
    return this.message.userId === this.currentUserId;
  }

  getUserName(): string {
    return this.message.userName;
  }
}
