import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppMaterialModule } from '../../../app.material.module';

@Component({
  selector: 'app-chat-input',
  imports: [FormsModule, ReactiveFormsModule, AppMaterialModule],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.scss',
})
export class ChatInputComponent {
  @Output() send = new EventEmitter<string>();

  messageControl = new FormControl('');

  sendMessage() {
    if (this.messageControl.value?.trim()) {
      this.send.emit(this.messageControl.value);
      this.messageControl.reset();
    }
  }
}
