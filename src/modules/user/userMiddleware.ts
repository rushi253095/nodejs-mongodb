import { check } from "express-validator/check";
import UserService from "./userService";
import Utils from "../../helper/utils";
import responseConstants from "../../constants/responseConstants";

export default class UserMiddleware {
  constructor() { }

  public createUserValidator = () => {
    return [
      check("fullName", { key: "REQUIRED_FIELD" }).trim().not().isEmpty(),
      check("skills", { key: "REQUIRED_FIELD" }).trim().not().isEmpty(),
      check("email", { key: "INVALID_FIELD" }).optional({ checkFalsy: true }).trim().isEmail(),
    ];
  }

  public duplicateEmailValidator = async (req, res, next) => {
    try {
      if (!Utils.empty(req.body.email)) {
        let id = "";
        if (!Utils.empty(req.userInfo)) {
          id = req.userInfo._id;
        }
        const data = await UserService.checkDuplicate({ email: req.body.email.toString().toLowerCase() }, id);
        if (!data) {
          return next();
        }
        return res.status(responseConstants.ERROR400.CODE).json({
          message: req.t("DUPLICATE_USER_FOUND"),
        });
      } else {
        return next();
      }
    } catch (err) {
      return res.status(responseConstants.ERROR500.CODE).json({
        message: req.t('WENT_WRONG'),
      });
    }
  }

  public loginValidator = () => {
    return [
      check("email", { key: "REQUIRED_FIELD" }).trim(),
      check("password", { key: "REQUIRED_FIELD" }).trim(),
    ];
  }

  public findUser = async (req, res, next) => {
    try {

      const status = responseConstants.ERROR400.CODE;
      const data = await UserService.findUser(req.body.email.toString().toLowerCase());

      if (!Utils.empty(data[0])) {
        req.userInfo = data[0];
        return next();
      } else {
        return res.status(responseConstants.SUCCESS203.CODE).json({
          message: req.t('ERR_USER_NOT_FOUND'),
        });
      }
    } catch (err) {
      return res.status(responseConstants.ERROR500.CODE).json({
        message: req.t('WENT_WRONG'),
      });
    }
  }

  public editProfileValidator = () => {
    return [
      check("email", { key: "INVALID_FIELD" }).trim().isEmail(),
      check("fullName", { key: "REQUIRED_FIELD" }).trim().not().isEmpty(),
    ];
  }
}
