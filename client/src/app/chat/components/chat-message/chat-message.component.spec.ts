import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMessageComponent } from './chat-message.component';
import { Message } from '../../models/message.model';

describe('ChatMessageComponent', () => {
  let component: ChatMessageComponent;
  let fixture: ComponentFixture<ChatMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatMessageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ChatMessageComponent);
    component = fixture.componentInstance;

    component.message = {
      id: '1',
      text: 'Hello',
      userId: '123',
      userName: 'Tami',
      timestamp: new Date()
    } as Message;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should return true if message is from current user', () => {
    component.currentUserId = '123';
    component.message = {
      userId: '123',
      userName: 'Tami',
      text: 'Hi',
      id: '1',
      timestamp: new Date()
    } as Message;
    expect(component.isMyMessage).toBeTrue();
  });

  it('should return false if message is from another user', () => {
    component.currentUserId = '123';
    component.message = {
      userId: '456',
      userName: 'Bob',
      text: 'Hi',
      id: '2',
      timestamp: new Date()
    } as Message;
    expect(component.isMyMessage).toBeFalse();
  });

  it('should return the message userName', () => {
    component.message = {
      userId: '123',
      userName: 'Tami',
      text: 'Hello',
      id: '1', timestamp: new Date()
    } as Message;
    expect(component.getUserName).toBe('Tami');
  });

});
