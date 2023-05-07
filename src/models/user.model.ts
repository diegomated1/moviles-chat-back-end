import ChatDatabase from "database/chat.database";
import IUser from "interfaces/user.interface";


export default class UserModel{

    columns: string[]

    constructor(private readonly db:ChatDatabase){
        this.columns = ["email", "name", "second_name", "job_ocupation", "number_phone", "password", "tokens"];
    }

    insert(user:IUser):Promise<boolean>{
        return new Promise(async(res, rej)=>{
            try{
                const params = [
                    user.email, user.name, user.second_name, user.job_ocupation, user.number_phone, user.password, user.tokens
                ];
                const query = `INSERT INTO users_by_email (${this.columns.join(', ')}) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                await this.db.client.execute(query, params, {prepare: true});
                res(true);
            }catch(error){
                rej(error);
            }
        })
    }

    get_all():Promise<Omit<IUser,'password'>[]>{
        return new Promise(async(res, rej)=>{
            try{
                const query = `SELECT ${this.columns.filter(c=>c!='password').join(', ')} FROM users_by_email`;
                const query_result = await this.db.client.execute(query, [], {prepare: true});
                const _users = query_result.rows;
                res(_users.map(_user=>({
                    email: _user.email,
                    name: _user.name,
                    second_name: _user.second_name,
                    job_ocupation: _user.job_ocupation,
                    number_phone: _user.number_phone,
                    tokens: _user.tokens
                })));
            }catch(error){
                rej(error);
            }
        });
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
                    job_ocupation: _user.job_ocupation,
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
                const query = `UPDATE users_by_email SET tokens = tokens + ? WHERE email = ?`;
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
                const query = `UPDATE users_by_email SET tokens = tokens - ? WHERE email = ?`;
                await this.db.client.execute(query, [token, email], {prepare: true});
                res(true);
            }catch(error){
                rej(error);
            }
        });
    }


}


