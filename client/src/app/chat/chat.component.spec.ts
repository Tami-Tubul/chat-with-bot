import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ChatComponent } from './chat.component';
import { of, Subject } from 'rxjs';
import { ChatService } from './services/chat.service';
import { UserService } from './services/user.service';
import { Message } from './models/message.model';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let chatServiceSpy: any;
  let userServiceSpy: any;

  beforeEach(async () => {

    chatServiceSpy = jasmine.createSpyObj('ChatService',
      ['sendMessage', 'getSocketId', 'getChatHistory', 'onNewMessage', 'onUserTyping', 'onUserStopTyping']);

    chatServiceSpy.getSocketId.and.returnValue(of('socket123'));
    chatServiceSpy.getChatHistory.and.returnValue(of([]));
    chatServiceSpy.onNewMessage.and.returnValue(of());
    chatServiceSpy.onUserTyping.and.returnValue(of({ userId: 'user456', userName: 'Alice' }));
    chatServiceSpy.onUserStopTyping.and.returnValue(of({ userId: 'user456' }));


    userServiceSpy = jasmine.createSpyObj('UserService', ['getUserId', 'getUserName', 'setUserId', 'setUserName']);
    userServiceSpy.getUserId.and.returnValue('user123');
    userServiceSpy.getUserName.and.returnValue('Tami');

    await TestBed.configureTestingModule({
      imports: [ChatComponent],
      providers: [
        { provide: ChatService, useValue: chatServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize user from UserService', () => {
    expect(component.currentUserId).toBe('user123');
    expect(component.currentUserName).toBe('Tami');
  });

  it('should send message via ChatService onSend', () => {
    component.currentUserId = 'user123';
    component.currentUserName = 'Tami';
    component.onSend('Hello');

    expect(chatServiceSpy.sendMessage).toHaveBeenCalledWith({
      text: 'Hello',
      userId: 'user123',
      userName: 'Tami'
    });
  });

  it('should not send empty message', () => {
    component.onSend('   ');
    expect(chatServiceSpy.sendMessage).not.toHaveBeenCalled();
  });

  it('should handle new user message immediately', () => {
    const userMsg: Message = { id: '2', userId: 'user456', userName: 'Alice', text: 'Hi', type: 'user', timestamp: new Date() };
    component['handleNewMessage'](userMsg);
    expect(component.messages).toContain(userMsg);
  });

  it('should add and remove typing users', fakeAsync(() => {
    component.currentUserId = 'user123';

    const typingSubject = new Subject<any>();
    const stopTypingSubject = new Subject<any>();

    chatServiceSpy.onUserTyping.and.returnValue(typingSubject.asObservable());
    chatServiceSpy.onUserStopTyping.and.returnValue(stopTypingSubject.asObservable());

    component['typingUsers'] = [];
    component['initTypingEvents']();
    tick();

    const typingUser = { userId: 'user456', userName: 'Alice' };
    typingSubject.next(typingUser);
    tick();
    fixture.detectChanges();

    expect(component.typingUsers).toContain(jasmine.objectContaining(typingUser));

    stopTypingSubject.next({ userId: 'user456' });
    tick();
    fixture.detectChanges();

    expect(component.typingUsers).not.toContain(jasmine.objectContaining(typingUser));
  }));

  it('should set currentUserId from socketId if not set', fakeAsync(() => {
    chatServiceSpy.getSocketId.and.returnValue(of('socket999'));
    component.currentUserId = '';
    component['initSocketId']();
    tick();
    expect(component.currentUserId).toBe('socket999');
    expect(userServiceSpy.setUserId).toHaveBeenCalledWith('socket999');
  }));

  it('should not override currentUserId if already set', fakeAsync(() => {
    component.currentUserId = 'existingId';
    component['initSocketId']();
    tick();
    expect(component.currentUserId).toBe('existingId');
    expect(userServiceSpy.setUserId).not.toHaveBeenCalled();
  }));

  it('should load chat history', fakeAsync(() => {
    const history: Message[] = [
      { id: '1', userId: 'u1', userName: 'A', text: 'Hi', type: 'user', timestamp: new Date() }
    ];
    chatServiceSpy.getChatHistory.and.returnValue(of(history));
    component['initChatHistory']();
    tick();
    expect(component.messages).toEqual(history);
  }));

  it('should correctly identify my message', () => {
    component.currentUserId = 'user123';
    const msgMine: Message = { id: '1', userId: 'user123', userName: 'Tami', text: '', type: 'user', timestamp: new Date() };
    const msgOther: Message = { id: '2', userId: 'someoneElse', userName: 'Alice', text: '', type: 'user', timestamp: new Date() };
    expect(component.isMyMessage(msgMine)).toBeTrue();
    expect(component.isMyMessage(msgOther)).toBeFalse();
  });

});
