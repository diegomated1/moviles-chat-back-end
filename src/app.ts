import dotenv from 'dotenv';
dotenv.config();

import ExpressServer from "./express-server";
import ChatRouter from "./router/chat.router";
import UserController from "./controllers/user.controller";
import MessageController from "./controllers/message.controller";
import UserModel from "./models/user.model";
import MessageModel from "./models/message.model";
import ChatDatabase from "./database/chat.database";
import Notifications from './firebase/notifications';
import express from 'express';
import http from 'http';
import SocketServer from './socket-server';
import io from 'socket.io';

const database = new ChatDatabase();
database.connect();
const userModel = new UserModel(database);
const messageModel = new MessageModel(database);
const userController = new UserController(userModel);
const messageController = new MessageController(messageModel);
const chatRouter = new ChatRouter(userController, messageController);
const notifications = new Notifications();

const app = express();
const http_server = new http.Server(app);
const ioServer = new io.Server(http_server);

const socketServer = new SocketServer(userModel, messageModel, ioServer, notifications);
const expresServer = new ExpressServer(app, http_server, chatRouter);