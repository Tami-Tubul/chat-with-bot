import { TestBed } from '@angular/core/testing';
import { ChatService } from './chat.service';
import { Message } from '../models/message.model';

describe('ChatService', () => {
    let service: ChatService;
    let socketSpy: any;

    beforeEach(() => {
        socketSpy = jasmine.createSpyObj('Socket', ['on', 'emit']);

        socketSpy.on.and.callFake((event: string, cb: Function) => {
            if (event === 'newMessage') cb({
                id: '1',
                text: 'Hello',
                userId: '456',
                userName: 'Bot',
                timestamp: new Date(),
                type: 'user'
            });
            if (event === 'userTyping') cb({ userId: '456', userName: 'Alice' });
            if (event === 'userStopTyping') cb({ userId: '456' });
        });

        TestBed.configureTestingModule({
            providers: [
                ChatService,
                { provide: 'SOCKET_TOKEN', useValue: socketSpy }
            ],
        });
        service = TestBed.inject(ChatService);
        (service as any).socket = socketSpy;
    });

    it('should send a message to the server when sendMessage is called', () => {
        const msg = { text: 'Hi', userId: '123', userName: 'Tami' };

        service.sendMessage(msg);

        expect(socketSpy.emit).toHaveBeenCalledWith('sendMessage', msg);
    });

    it('should notify subscribers when a new message arrives from the server', (done) => {
        const newMsg: Message = {
            id: '1',
            text: 'Hello',
            userId: '456',
            userName: 'Bot',
            timestamp: new Date(),
            type: 'user'
        };

        socketSpy.on.and.callFake((event: string, cb: (msg: any) => void) => {
            if (event === 'newMessage') cb(newMsg);
        });

        service.onNewMessage().subscribe(msg => {
            expect(msg).toEqual(newMsg);
            done();
        });
    });

    it('should notify subscribers when a user starts typing', (done) => {
        service.onUserTyping().subscribe(data => {
            expect(data.userName).toBe('Alice');
            done();
        });
    });

    it('should notify subscribers when a user stops typing', (done) => {
        service.onUserStopTyping().subscribe(data => {
            expect(data.userId).toBe('456');
            done();
        });
    });

});
