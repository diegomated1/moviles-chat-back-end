import admin from 'firebase-admin';
import serviceAccount from '../../keys/primero-170a0-firebase-adminsdk-xjejm-b2cd05d626.json';
import { Message } from '../interfaces/message-firebase.interface';
import { MulticastMessage } from 'firebase-admin/lib/messaging/messaging-api';

export default class Notifications{

    app: admin.app.App

    constructor(){
        this.app = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
        });
    }

    send(message:Message):Promise<boolean>{
        return new Promise(async(res, rej)=>{
            try{
                await this.app.messaging().sendEachForMulticast(message as MulticastMessage);
                res(true);
            }catch(error){
                console.log(error);
                res(false);
            }
        });
    }
}
