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

  /** Returns true if the message was sent by the current user. */
  get isMyMessage(): boolean {
    return this.message.userId === this.currentUserId;
  }

  /** Returns the username associated with the message. */
  get getUserName(): string {
    return this.message.userName;
  }

  /** Generates a consistent color for each user, with special colors for bot and current user. */
  getUserColor(userId: string): string {
    if (userId === 'bot') return "var(--color-accent)";
    if (userId === this.currentUserId) return 'var(--color-current-user)';

    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }

    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
  }

}
