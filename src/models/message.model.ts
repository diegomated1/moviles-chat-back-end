import ChatDatabase from "database/chat.database";
import IMessage from "interfaces/message.interface";


export default class MessageModel{

    columns: string[]

    constructor(private readonly db:ChatDatabase){
        this.columns = ["email_messages_addresse", "date", "email_messages_sender", "message", "title", "tokens"];
    }

    get_by_addressee(email_messages_addresse:string):Promise<IMessage[]>{
        return new Promise(async(res, rej)=>{
            try{
                const query = `SELECT * FROM messages_by_addressee WHERE email_messages_addresse = ?`;
                const query_result = await this.db.client.execute(query, [email_messages_addresse], {prepare: true});
                const _messages = query_result.rows;
                res(_messages.map(_message=>({
                    email_user_addresse: _message.email_messages_addresse,
                    email_user_sender: _message.email.email_messages_sender,
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

    insert(
        email_messages_addresse: string, date: Date, email_messages_sender: string,
        message: string, title: string, tokens: string[]
    ):Promise<boolean>{
        return new Promise(async(res, rej)=>{
            try{
                const params = [email_messages_addresse, date, email_messages_sender, message, title, tokens];
                const query = `INSERT INTO messages_by_addressee (${this.columns.join(', ')}) VALUES (?, ?, ?, ?, ?, ?)`;
                await this.db.client.execute(query, params, {prepare: true});
                res(true);
            }catch(error){
                rej(error);
            }
        })
    }

}


