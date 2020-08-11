import * as jwt from "jsonwebtoken";

export default class JWT {

    public static getAuthToken = (data) => {
        return jwt.sign(data, process.env.PRIVATE_KEY);
    }

    public static decodeAuthToken = (token) => {
        if (token) {
            try {
                return jwt.decode(token);
            } catch (error) {
                return false;
            }
        }
        return false;
    }
}
