import { Response, Request } from "express";
import UserModel from "../models/user.model";
import bc from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';

export default class UserController{

    constructor(private readonly userModel:UserModel){
    }

    login = async (req:Request, res:Response) => {
        try{
            const {email, password, tokenFCM} = req.body;
            const user = await this.userModel.get_by_email(email);
            if(user){
                const math = await bc.compare(password, user.password);
                if(math){
                    const token = jwt.sign({email: user.email}, process.env.JWT_SECRET!);
                    await this.userModel.add_token(email, tokenFCM);
                    res.status(200).json({'data': token});
                }else{
                    res.status(400).json({'data': 'Invalid credentials'});
                }
            }else{
                res.status(400).json({'message': 'Invalid credentials'});
            }
        }catch(error){
            console.log(error);
            res.status(500).json({'message': 'internal error server'});
        }
    }

    register = async (req:Request, res:Response) => {
        try{
            const {email, name, second_name, job_ocupation, number_phone, password, token} = req.body;
            console.log(req.body);
            const _password = await bc.hash(password, 10);
            await this.userModel.insert({email, name, second_name, job_ocupation, number_phone, password: _password, tokens: new Set([token])});
            const _token = jwt.sign({email}, process.env.JWT_SECRET!);
            res.status(200).json({'data': _token});
        }catch(error){
            console.log(error);
            res.status(500).json({'message': 'internal error server'});
        }
    }

    get_by_email = async (req:Request, res:Response) => {
        try{
            const {email} = req.params;
            const user = await this.userModel.get_by_email(email);
            if(user){
                res.status(200).json({'data': user});
            }else{
                res.status(404).json({'message': 'user not found'});
            }
        }catch(error){
            res.status(500).json({'message': 'internal error server'});
        }
    }

    get_all = async (req:Request, res:Response) => {
        try{
            const users = await this.userModel.get_all();
            res.status(200).json({'data': users});
        }catch(error){
            res.status(500).json({'message': 'internal error server'});
        }
    }

    auth = async (req:Request, res:Response) => {
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

    remove_token = async (req:Request, res:Response) => {
        try{
            const {email} = req.params;
            const {token} = req.body;
            const users = await this.userModel.remove_token(email, token);
            res.status(200).json({'data': users});
        }catch(error){
            console.log(error);
            res.status(500).json({'message': 'internal error server'});
        }
    }

    getUserImage = async (req:Request, res:Response) => {
        try{
            const {email} = req.params;
            var route = path.join(__dirname, `../../../uploads/${email}.jpg`);
            fs.open(route, 'r', (err, df)=>{
                if(err) res.status(404).json({status: true, message: "Image not found"});
                else{
                    res.sendFile(route);
                }
            });
        }catch(error){
            res.status(500).json({status: false, message: 'internal error server'});
        }
    } 
}