import Notifications from 'firebase/notifications';
import IMessage from '../interfaces/message.interface';
import MessageModel from '../models/message.model';
import {Server, Socket} from 'socket.io';
import UserModel from '../models/user.model';

export default class ChatListeners{

    constructor(
        private readonly messageModel: MessageModel,
        private readonly userModel: UserModel,
        private readonly notifications: Notifications,
        private readonly io: Server, 
        private readonly socket: Socket
    ){
        this.listeners();
    }

    private async chatMessage(message:Omit<Omit<IMessage, 'date'>, 'tokens'>){
        try{
            const date = new Date();
            
            const user_addresse = await this.userModel.get_by_email(message.email_user_addresse);
            if(!user_addresse) throw 'User not found';
            const {tokens} = user_addresse;

            const _message:IMessage = {...message, date, tokens: Array.from(tokens)};
            await this.messageModel.insert(_message);

            for(let token in tokens){
                this.notifications.send({
                    token, data: {
                        title: message.title,
                        message: message.message
                    }
                });
            }

            const room_name = `room_${[message.email_user_sender, message.email_user_addresse].sort().join('_')}`;
            this.io.to(`chat:${room_name}`).emit('chat:message', _message);
        }catch(error){
            this.socket.emit('chat:error', 'Could not send message');
        }
    };

    // socket events
    listeners(){
        this.socket.on("chat:message", this.chatMessage);
    }
};