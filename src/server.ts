import express from 'express';
import morgan from 'morgan';
import ChatRouter from './router/chat.router';

export default class Server{

    private app: express.Express
    
    constructor(
        private readonly chatRouter: ChatRouter
    ){
        this.app = express();
        this.config();
        this.routes();
        this.start();
    }

    private config(){
        this.app.use(express.json());
        this.app.use(morgan('dev'));
    }

    private routes(){
        this.app.use(this.chatRouter.router);
    }

    private start(){
        this.app.listen(parseInt(process.env.API_PORT!), process.env.API_HOST!, ()=>{
            console.log(`Listen on http://${process.env.API_HOST}:${process.env.API_PORT}/`);
        });
    }
}