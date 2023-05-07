import {Client} from "cassandra-driver";

export default class ChatDatabase{

    client: Client

    constructor(){
        this.client = new Client({
            contactPoints: [`${process.env.DB_HOST}:${process.env.DB_PORT||'9042'}`],
            localDataCenter: process.env.DB_DATACENTER||'datacenter1',
            keyspace: process.env.DB_KEYSPACE,
            credentials: {
                username: process.env.DB_USERNAME!,
                password: process.env.DB_PASSWORD!   
            }
        });
    }

    connect(){
        this.client.connect().then(()=>{
            console.log("Cassandra connected");
        }).catch((err:Error)=>{
            console.log("Cannot connect to cassandra: ", err.name);
        })
    }
}