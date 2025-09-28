export interface Message {
    id: string;
    userId: string;
    userName: string;
    text: string;
    timestamp: Date;
    type: 'user' | 'bot';
}
