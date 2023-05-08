import { Response, Request } from "express";
import MessageModel from "../models/message.model";


export default class MessageController{

    constructor(private readonly messageModel:MessageModel){}

    get_by_addressee = async (req:Request, res:Response) => {
        try{
            const {email, addressee} = req.params;
            const messages = await this.messageModel.get_by_addressee(email, addressee);
            res.status(200).json({'data': messages});
        }catch(error){
            console.log(error);
            res.status(500).json({'message': 'internal error server'});
        }
    }

    insert = async (req:Request, res:Response) => {
        try{
            const {email} = req.params
            const {email_user_addresse, title, message, tokens} = req.body;
            await this.messageModel.insert({
                email_user_addresse, email_user_sender: email, title, message, tokens:[tokens],
                date: new Date()
            });
            res.status(200).json({'message': 'inserted'});
        }catch(error){
            console.log(error);
            res.status(500).json({'message': 'internal error server'});
        }
    }



}