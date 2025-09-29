import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ChatComponent } from './chat.component';
import { of, Subject } from 'rxjs';
import { ChatService } from './services/chat.service';
import { UserService } from './services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { Message } from './models/message.model';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let chatServiceSpy: any;
  let userServiceSpy: any;
  let dialogSpy: any;

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

    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpy.open.and.returnValue({
      componentInstance: {},
      afterClosed: () => of('NewUser'),
      close: () => { },
    });


    await TestBed.configureTestingModule({
      imports: [ChatComponent],
      providers: [
        { provide: ChatService, useValue: chatServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
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

  xit('should open username dialog if username is missing', () => {
    userServiceSpy.getUserName.and.returnValue(null);

    component['initUser']();
    expect(dialogSpy.open).toHaveBeenCalled();
  });

});
