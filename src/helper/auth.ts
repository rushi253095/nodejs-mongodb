import * as moment from 'moment';

import UserModel from "../models/userModel";

import JWT from './jwt';
import Utils from './utils';
import commonConstants from '../constants/commonConstants';
import responseConstants from "../constants/responseConstants";

class Auth {
    constructor() { }

    public checkUserAuth = (req, res, next) => {
        const token = (req.headers && req.headers[commonConstants.authToken]);
        const userId = JWT.decodeAuthToken(token);

        if (Utils.empty(token) || Utils.empty(userId)) {
            return res.status(responseConstants.ERROR400.CODE).json({
                message: req.t("NOT_AUTHORIZED"),
            });
        } else {
            UserModel.findOne({
                _id: userId.uid,
            }, {password : 0}).exec(async (err, userInfo) => {
                if (!userInfo) {
                    return res.status(responseConstants.ERROR400.CODE).json({
                        message: req.t("NOT_AUTHORIZED"),
                    });
                } else {
                    req.userInfo = userInfo;
                    next();
                }
            });
        }
    }
}

export default new Auth();
