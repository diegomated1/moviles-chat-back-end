import ChatDatabase from "database/chat.database";
import IUser from "interfaces/user.interface";


class UserModel{

    constructor(private readonly db:ChatDatabase){

    }

    get_by_email(email:string):Promise<IUser>{
        return new Promise(async(res, rej)=>{
            try{
                const query = `SELECT * FROM users_by_email WHERE email = ?`;
                const query_result = await this.db.client.execute(query, [email], {prepare: true});
                const _user = query_result.first();
                res({
                    email: _user.email,
                    name: _user.name,
                    second_name: _user.second_name,
                    number_phone: _user.number_phone,
                    password: _user.pasword,
                    tokens: _user.tokens
                });
            }catch(error){
                rej(error);
            }
        });
    }
    
    add_token(email:string, token:string):Promise<boolean>{
        return new Promise(async(res, rej)=>{
            try{
                const query = `UPDATE users_by_email SET tokens + ? WHERE email = ?`;
                await this.db.client.execute(query, [token, email], {prepare: true});
                res(true);
            }catch(error){
                rej(error);
            }
        });
    }

    remove_token(email:string, token:string):Promise<boolean>{
        return new Promise(async(res, rej)=>{
            try{
                const query = `UPDATE users_by_email SET tokens - ? WHERE email = ?`;
                await this.db.client.execute(query, [token, email], {prepare: true});
                res(true);
            }catch(error){
                rej(error);
            }
        });
    }


}


