import { Response, Request } from "express";
import UserModel from "models/user.model";
import bc from 'bcrypt';
import jwt from 'jsonwebtoken';

export default class MessageController{

    constructor(private readonly userModel:UserModel){}

    async login(req:Request, res:Response){
        try{
            const {email, password} = req.body;
            const user = await this.userModel.get_by_email(email);
            if(user){
                const math = await bc.compare(password, user.password);
                if(math){
                    const token = jwt.sign({email: user.email}, process.env.JWT_SECRET!);
                    res.status(200).json({'data': token});
                }else{
                    res.status(400).json({'data': 'Invalid credentials'});
                }
            }else{
                res.status(200).json({'message': 'Invalid credentials'});
            }
        }catch(error){
            res.status(500).json({'message': 'internal error server'});
        }
    }

    async register(req:Request, res:Response){
        try{
            const {email, name, second_name, job_ocupation, number_phone, password, tokens} = req.body;
            const _password = await bc.hash(password, 10);
            await this.userModel.insert({email, name, second_name, job_ocupation, number_phone, password: _password, tokens});
            const token = jwt.sign({email}, process.env.JWT_SECRET!);
            res.status(200).json({'data': token});
        }catch(error){
            res.status(500).json({'message': 'internal error server'});
        }
    }

    async get_all(req:Request, res:Response){
        try{
            const users = await this.userModel.get_all();
            res.status(200).json({'data': users});
        }catch(error){
            res.status(500).json({'message': 'internal error server'});
        }
    }

    async auth(req:Request, res:Response){
        try{
            const auth = req.get('Authorization');
            if(auth===undefined) throw "There is no token in the header";

            const token_bearer = auth.split(' ');
            if(token_bearer[0].toLowerCase()!=='bearer') throw "invalid token";

            var token = token_bearer[1];
            var {email} = jwt.verify(token, process.env.JWT_SECRET!) as {email?: string};
            if(email){
                const user = await this.userModel.get_by_email(email);
                res.status(200).json({'data': user});
            }else{
                throw "invalid token";
            }
        }catch(error){
            const err = error as Error;
            if(err.message){
                res.status(500).json({message: 'Internal error server'});
            }else{
                res.status(401).json({message: error});
            }
        }
    }
}