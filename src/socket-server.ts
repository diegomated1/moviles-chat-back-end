import MessageModel from "models/message.model";
import http from 'http';
import io from 'socket.io';
import ChatListeners from './listeners/chat.listeners';

export default class SocketServer{

    constructor(
        private readonly server: http.Server,
        private readonly messageModel: MessageModel,
        private readonly ioServer: io.Server
    ){
        this.ioServer = new io.Server(this.server);
    }

    connect(){
        this.ioServer.on('connection', (socket)=>{
            const {id_chat} = socket.handshake.query;
            if(id_chat){
              socket.join(`chat:${id_chat}`);
            }
            new ChatListeners(this.messageModel, this.ioServer, socket);
        });
    }
}


