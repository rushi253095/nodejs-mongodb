import * as bcrypt from "bcryptjs";
import * as moment from "moment";
import UserService from "./userService";
// import * as multer from "multer";
// import * as path from "path";
import * as fs from "fs";
import JWT from "../../helper/jwt";
import Utils from "../../helper/utils";
import responseConstants from "../../constants/responseConstants";

export default class UserController {

    constructor() {
    }

    public signup = async (req, res) => {
        try {
            req.body.email = req.body.email.toString().toLowerCase();
            req.body.fullName = req.body.fullName.toString().toLowerCase();
            req.body.skills = req.body.skills;
            req.body.password = await Utils.encrypt(req.body.password);
            const verifyToken = JWT.getAuthToken({ email: req.body.email, time: moment() });
            // console.log(req.files, "req.files");
            // if (!Utils.empty(req.files) && !Utils.empty(req.files.file)) {
            //     const image1 = {
            //         data: fs.readFileSync(path.join(__dirname + './public/uploads/' + req.file.filename)),
            //         contentType: 'image/png',
            //     } ;
            //     req.body.file = image1;
            // }
            const data = await UserService.createUser(req.body, true);
            const token = JWT.getAuthToken({
                uid: data._id,
            });
            return res.status(responseConstants.STANDARD.SUCCESS).json({
                message: req.t("SIGNUP_SUCCESS"),
                result: { userData: data, token },
            });

        } catch (err) {
            console.log("err", err);
            return res.status(responseConstants.ERROR500.CODE).json({
                message: req.t('WENT_WRONG'),
            });
        }
    }

    public login = async (req, res) => {
        try {
            const validPasswordVerify = false;
            const validPassword = await bcrypt.compare(req.body.password, req.userInfo.password);
            if (validPassword) {
                const token = JWT.getAuthToken({
                    uid: req.userInfo._id,
                    deviceId: req.userInfo.deviceId,
                });
                return res.status(responseConstants.STANDARD.SUCCESS).json({
                    message: req.t("LOGIN_SUCCESS"),
                    result: { token, userData: req.userInfo },
                });
            } else {
                return res.status(responseConstants.ERROR400.CODE).json({
                    message: req.t("ERR_PASSWORD"),
                });
            }

        } catch (err) {
            return res.status(responseConstants.ERROR500.CODE).json({
                message: req.t('WENT_WRONG'),
            });
        }
    }

    public getProfile = async (req, res) => {
        try {
            return res.status(responseConstants.STANDARD.SUCCESS).json({
                message: req.t("SUCCESS"),
                result: { userInfo: req.userInfo },
            });
        } catch (err) {
            return res.status(responseConstants.ERROR500.CODE).json({
                message: req.t('WENT_WRONG'),
            });
        }
    }

    public editProfile = async (req, res) => {
        try {

            req.body._id = req.userInfo._id;
            req.body.email = req.body.email.toString().toLowerCase();
            req.body.fullName = req.body.fullName.toString().toLowerCase();
            req.body.skills = req.body.skills;

            const userData = await UserService.createUser(req.body);

            return res.status(responseConstants.STANDARD.SUCCESS).json({
                result: { userData },
                message: req.t('PROFILE_UPDATE'),
            });
        } catch (err) {
            return res.status(responseConstants.ERROR500.CODE).json({
                message: req.t('WENT_WRONG'),
            });
        }
    }
}
