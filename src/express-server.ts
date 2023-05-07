import express, { Application } from 'express';
import morgan from 'morgan';
import ChatRouter from './router/chat.router';
import http from 'http';

export default class ExpressServer{
    
    constructor(
        private readonly app: Application,
        private readonly server: http.Server,
        private readonly chatRouter: ChatRouter,
    ){
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
        this.server.listen(parseInt(process.env.API_PORT!), process.env.API_HOST!, ()=>{
            console.log(`Listen on http://${process.env.API_HOST}:${process.env.API_PORT}/`);
        });
    }
}