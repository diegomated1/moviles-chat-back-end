import UserController from "../controllers/user.controller";
import MessageController from "../controllers/message.controller";
import { Router } from "express";
import imageSave from "../middlewares/image-save.middleware";

export default class ChatRouter {

    router:Router;

    constructor(
        private readonly userController: UserController,
        private readonly messageController: MessageController
    ){
        this.router = Router();
        this.config();
    }

    private config(){
        this.router.route('/login').post(this.userController.login);
        this.router.route('/register').post(imageSave.single('user_image'), this.userController.register);
        this.router.route('/auth').post(this.userController.auth);
        this.router.route('/users').get(this.userController.get_all);
        //this.router.route('/users/:sender/messages').post(this.messageController.insert);
        this.router.route('/users/:email').get(this.userController.get_by_email);
        this.router.route('/users/:email').put(this.userController.remove_token);
        this.router.route('/users/:email/messages/:addressee').get(this.messageController.get_by_addressee);
        this.router.route('/images/:email').get(this.userController.getUserImage);
    }

}