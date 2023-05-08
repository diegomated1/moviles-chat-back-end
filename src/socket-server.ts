import MessageModel from "./models/message.model";
import http from 'http';
import io from 'socket.io';
import ChatListeners from './listeners/chat.listeners';
import Notifications from "firebase/notifications";
import UserModel from "./models/user.model";

export default class SocketServer{

    constructor(
        private readonly server: http.Server,
        private readonly userModel: UserModel,
        private readonly messageModel: MessageModel,
        private readonly ioServer: io.Server,
        private readonly notifications: Notifications,
    ){
        this.ioServer = new io.Server(this.server);
    }

    connect(){
        this.ioServer.on('connection', (socket)=>{
            const {id_chat} = socket.handshake.query;
            if(id_chat){
                socket.join(`chat:${id_chat}`);
                new ChatListeners(
                    this.messageModel,
                    this.userModel,
                    this.notifications,
                    this.ioServer, socket
                );
            }
        });
    }
}


