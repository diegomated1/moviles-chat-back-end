import admin from 'firebase-admin';
import serviceAccount from '../../keys/primero-170a0-firebase-adminsdk-xjejm-b2cd05d626.json';
import { Message } from 'interfaces/message-firebase.interface';

export default class Notifications{

    constructor(){
        this.init();
    }

    private init(){
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
        });
    }

    send(message:Message):Promise<boolean>{
        return new Promise(async(res, rej)=>{
            try{
                await admin.messaging().send(message);
                res(true);
            }catch(error){
                res(false);
            }
        });
    }
}
