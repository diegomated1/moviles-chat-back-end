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

    private  chatMessage = async (message:Omit<Omit<IMessage, 'date'>, 'tokens'>) => {
        try{
            const date = new Date();
            
            const user_addresse = await this.userModel.get_by_email(message.email_user_addresse);
            if(!user_addresse) throw 'User not found';
            const {tokens} = user_addresse;
            const _tokens = Array.from(tokens||[]);

            const _message:IMessage = {...message, date, tokens: _tokens};
            await this.messageModel.insert(_message);
            
            await this.notifications.send({
                tokens: _tokens,
                data: {
                    title: `${user_addresse.name} ${user_addresse.second_name}`,
                    message: message.message,
                    from: message.email_user_sender
                }
            });
            
            const room_name = [message.email_user_sender, message.email_user_addresse].sort().join("");
            this.io.to(`chat:${room_name}`).emit('chat:message', _message);
        }catch(error){
            console.log(error);
            this.socket.emit('chat:error', 'Could not send message');
        }
    };

    // socket events
    listeners(){
        this.socket.on("chat:message", this.chatMessage);
    }
};