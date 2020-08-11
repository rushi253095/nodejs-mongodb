import * as express from "express";
import UserController from "./userController";
import UserMiddleware from "./userMiddleware";
import Auth from "../../helper/auth";
import validationHandler from "../../helper/validate";
import * as multer from "multer";
import * as path from "path";

export default class UserRoute {
    public userRoute = express.Router();

    // public storageData = multer.diskStorage({
    //     destination: (req, file, cb) => {
    //         cb(null, './public/uploads');
    //     },
    //     filename: (req, file, cb) => {
    //         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    //     },
    // });
    // public upload = multer({ storage: this.storageData }).single('file');
    protected userController = new UserController();
    protected userMiddleware = new UserMiddleware();
    constructor() {
        this.userRoute.post("/signup", this.userMiddleware.createUserValidator(), validationHandler,  this.userMiddleware.duplicateEmailValidator, this.userController.signup);
        this.userRoute.post("/login", this.userMiddleware.loginValidator(), validationHandler, this.userMiddleware.findUser, this.userController.login);
        this.userRoute.get("/get-profile", Auth.checkUserAuth, this.userController.getProfile);
        this.userRoute.post("/edit-profile", this.userMiddleware.editProfileValidator(), validationHandler, Auth.checkUserAuth, this.userMiddleware.duplicateEmailValidator, this.userController.editProfile);
        return this.userRoute;
    }
}
