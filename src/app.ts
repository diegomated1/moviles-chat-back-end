import dotenv from 'dotenv';
dotenv.config();

import Server from "./server";
import ChatRouter from "./router/chat.router";
import UserController from "./controllers/user.controller";
import MessageController from "./controllers/message.controller";
import UserModel from "./models/user.model";
import MessageModel from "./models/message.model";
import ChatDatabase from "./database/chat.database";

const database = new ChatDatabase();
database.connect();
const userModel = new UserModel(database);
const messageModel = new MessageModel(database);
const userController = new UserController(userModel);
const messageController = new MessageController(messageModel);
const chatRouter = new ChatRouter(userController, messageController);

const server = new Server(chatRouter);

