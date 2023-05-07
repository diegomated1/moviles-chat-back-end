import IMessage from '../interfaces/message.interface';
import MessageModel from '../models/message.model';
import {Server, Socket} from 'socket.io';

export default class ChatListeners{

    constructor(
        private readonly messageModel: MessageModel,
        private readonly io: Server, 
        private readonly socket: Socket
    ){
        this.listeners();
    }

    private async chatMessage(message:Omit<IMessage, 'date'>){
        try{
            const date = new Date();
            const _message:IMessage = {...message, date};
            await this.messageModel.insert(_message);
            const room_name = `room_${[message.email_user_sender, message.email_user_addresse].sort().join('_')}`;
            this.io.to(`chat:${room_name}`).emit('chat:message', _message);
        }catch(error){
            this.socket.emit('chat:error', 'No se pudo enviar el mensaje');
        }
    };

    // socket events
    listeners(){
        this.socket.on("chat:message", this.chatMessage);
    }
};