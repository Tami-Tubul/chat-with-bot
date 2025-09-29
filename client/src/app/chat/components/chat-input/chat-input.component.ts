import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../../../app.material.module';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { debounceTime } from 'rxjs';
import { ChatService } from './../../services/chat.service';

@Component({
  selector: 'app-chat-input',
  imports: [FormsModule, ReactiveFormsModule, AppMaterialModule, PickerComponent],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.scss',
})
export class ChatInputComponent {
  @Input() currentUserName!: string;
  @Output() send = new EventEmitter<string>();
  @ViewChild('emojiPickerWrapper') emojiPickerWrapper!: ElementRef;

  messageControl = new FormControl('');
  showEmojiPicker = false; // Flag for showing/hiding emoji picker

  constructor(private chatService: ChatService) { }

  ngOnInit() {

    /** Subscribes to input changes and emits typing or stopTyping events with debounce. */
    this.messageControl.valueChanges
      .pipe(debounceTime(500)) // waiting 500ms from the user stop typing
      .subscribe(value => {
        if (value && value.trim() !== '') {
          this.chatService.emitTyping(this.currentUserName);
        } else {
          this.chatService.emitStopTyping(this.currentUserName);
        }
      });
  }

  /** Sends the current message, emits stopTyping, and resets the input. */
  sendMessage() {
    const text = this.messageControl.value?.trim();
    if (text) {
      this.send.emit(text);
      this.chatService.emitStopTyping(this.currentUserName);
      this.messageControl.reset();
    }
  }

  // handle line breaks : Enter -> sends, Shift+Enter -> break line
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  /** Toggles the visibility of the emoji picker panel. */
  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  // close emoji picker on click outside its panel
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (
      this.showEmojiPicker &&
      this.emojiPickerWrapper &&
      !this.emojiPickerWrapper.nativeElement.contains(event.target)
    ) {
      this.showEmojiPicker = false;
    }
  }

  // add emoji to input
  addEmoji(event: any) {
    const emoji = event.emoji.native;
    const currentText = this.messageControl.value || '';
    this.messageControl.setValue(currentText + emoji);
  }

}
