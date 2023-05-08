import ChatDatabase from "../database/chat.database";
import IMessage from "../interfaces/message.interface";


export default class MessageModel{

    columns: string[]

    constructor(private readonly db:ChatDatabase){
        this.columns = ["id_channel", "email_user_addresse", "date", "email_user_sender", "message", "title", "tokens"];
    }

    get_by_addressee(sender:string, email_user_addresse:string):Promise<Omit<IMessage, 'id_channel'>[]>{
        return new Promise(async(res, rej)=>{
            try{
                const id_channel = [sender, email_user_addresse].sort().join("");
                const query = `SELECT * FROM messages_by_channel WHERE id_channel = ?`;
                const query_result = await this.db.client.execute(query, [id_channel], {prepare: true});
                const _messages = query_result.rows;
                res(_messages.map(_message=>({
                    email_user_addresse: _message.email_user_addresse,
                    email_user_sender: _message.email_user_sender,
                    title: _message.title,
                    message: _message.message,
                    date: _message.date,
                    tokens: _message.tokens
                })));
            }catch(error){
                rej(error);
            }
        })
    }

    insert(message:Omit<IMessage, 'id_channel'>):Promise<boolean>{
        return new Promise(async(res, rej)=>{
            try{
                const id_channel = [message.email_user_sender, message.email_user_addresse].sort().join("");
                const params = [
                    id_channel, message.email_user_addresse, message.date, message.email_user_sender, message.message, message.title, message.tokens
                ];
                const query = `INSERT INTO messages_by_channel (${this.columns.join(', ')}) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                await this.db.client.execute(query, params, {prepare: true});
                res(true);
            }catch(error){
                rej(error);
            }
        })
    }

}


