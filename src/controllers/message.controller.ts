import { Response, Request } from "express";
import MessageModel from "../models/message.model";


export default class MessageController{

    constructor(private readonly messageModel:MessageModel){}

    async get_by_addressee(req:Request, res:Response){
        try{
            const {sender, addressee} = req.params;
            const messages = await this.messageModel.get_by_addressee(sender, addressee);
            res.status(200).json({'data': messages});
        }catch(error){
            res.status(500).json({'message': 'internal error server'});
        }
    }

    async insert(req:Request, res:Response){
        try{
            const {email_user_addresse, email_user_sender, title, message, tokens} = req.body;
            await this.messageModel.insert({
                email_user_addresse, email_user_sender, title, message, tokens,
                date: new Date()
            });
            res.status(200).json({'message': 'inserted'});
        }catch(error){
            res.status(500).json({'message': 'internal error server'});
        }
    }



}