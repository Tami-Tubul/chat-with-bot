import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ChatInputComponent } from './chat-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../../../app.material.module';
import { ChatService } from '../../services/chat.service';

describe('ChatInputComponent', () => {
  let component: ChatInputComponent;
  let fixture: ComponentFixture<ChatInputComponent>;
  let chatServiceSpy: any;

  beforeEach(async () => {
    chatServiceSpy = jasmine.createSpyObj('ChatService', ['emitTyping', 'emitStopTyping']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, AppMaterialModule, ChatInputComponent],
      providers: [
        { provide: ChatService, useValue: chatServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatInputComponent);
    component = fixture.componentInstance;
    component.currentUserName = 'Tami';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit message when sendMessage is called with non-empty value', () => {
    spyOn(component.send, 'emit');

    component.messageControl.setValue('Hello');
    component.sendMessage();

    expect(component.send.emit).toHaveBeenCalledWith('Hello');
    expect(component.messageControl.value).toBeNull();
  });

  it('should not emit message when sendMessage is called with empty value', () => {
    spyOn(component.send, 'emit');

    component.messageControl.setValue('   ');
    component.sendMessage();

    expect(component.send.emit).not.toHaveBeenCalled();
  });

  it('should call emitTyping and emitStopTyping on typing', fakeAsync(() => {
    component.messageControl.setValue('Hello');
    tick(500); // debounce time
    expect(chatServiceSpy.emitTyping).toHaveBeenCalledWith('Tami');

    component.messageControl.setValue('');
    tick(500);
    expect(chatServiceSpy.emitStopTyping).toHaveBeenCalledWith('Tami');
  }));

});
