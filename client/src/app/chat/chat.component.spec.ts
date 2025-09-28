import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ChatComponent } from './chat.component';
import { of } from 'rxjs';
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
    chatServiceSpy = jasmine.createSpyObj('ChatService', ['sendMessage', 'getSocketId', 'getChatHistory', 'onNewMessage']);
    chatServiceSpy.getSocketId.and.returnValue(of('socket123'));
    chatServiceSpy.getChatHistory.and.returnValue(of([]));
    chatServiceSpy.onNewMessage.and.returnValue(of());

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

  it('should handle new bot message with delay', fakeAsync(() => {
    const botMsg: Message = { id: '1', userId: 'bot', userName: 'Bot', text: 'Hi', type: 'bot', timestamp: new Date() };
    component['handleNewMessage'](botMsg);

    expect(component.botTyping).toBeTrue();
    tick(3000);
    expect(component.botTyping).toBeFalse();
    expect(component.messages).toContain(botMsg);
  }));

  it('should handle new user message immediately', () => {
    const userMsg: Message = { id: '2', userId: 'user456', userName: 'Alice', text: 'Hi', type: 'user', timestamp: new Date() };
    component['handleNewMessage'](userMsg);

    expect(component.botTyping).toBeFalse();
    expect(component.messages).toContain(userMsg);
  });

  xit('should open username dialog if username is missing', () => {
    userServiceSpy.getUserName.and.returnValue(null);

    component['initUser']();
    expect(dialogSpy.open).toHaveBeenCalled();
  });

});
