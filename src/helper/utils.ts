import * as bcrypt from "bcryptjs";

import {Log} from "./logger";
import commonConstants from "../constants/commonConstants";

class Utils {
    constructor() { }

    public makeRandomNumber = () => {
        return Math.floor(1000 + Math.random() * 9000);
    }

    public makeRandom = () => {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 10; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    public isDefined = (variable) => {
        if (typeof variable === "boolean") {
            return true;
        }
        return (typeof variable !== undefined && variable != null && variable !== "");
    }

    public empty = (mixedVar) => {
        let i;
        let len;
        const emptyValues = ["undefined", undefined, null, false, "false", 0, "", "0", "null"];
        for (i = 0, len = emptyValues.length; i < len; i++) {
            if (mixedVar === emptyValues[i]) {
                return true;
            }
        }
        if (typeof mixedVar === "object") {
            const keys = Object.keys(mixedVar);
            if (keys.length > 0) {
                return false;
            }
            return true;
        }
        return false;
    }

    public isPasswordMatch = (password) => {
        const passwordReg = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@.\/!@#$%^&*()_+=[\]{}?'\"\\;:+=])(?=.{8,})/);
        if (passwordReg.test(password)) {
            return true;
        } else {
            return false;
        }
    }

    public loggerConsole = (req) => {
        if (process.env.SHOW_LOG === 'true') {
            const reqs = { ...req.body };
            reqs.password = "";
            reqs.newPassword = "";
            reqs.oldPassword = "";
        }
    }

    public encrypt = async (password) => {
        const salt = await bcrypt.genSalt(commonConstants.saltRound);
        return password = await bcrypt.hash(password, salt);
    }
}

export default new Utils();
