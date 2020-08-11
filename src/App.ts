import * as cors from "cors";
import * as express from "express";
import * as l10n from "jm-ez-l10n";
import * as mongoose from "mongoose";
import * as bodyParser from "body-parser";
import * as multipart from "connect-multiparty";
import * as EnLan from "./language/translation.en";
import Utils from "./helper/utils";
import Middleware from "./helper/middleware";
import UserRoute from "./modules/user/userRoute";
import responseConstants from "./constants/responseConstants";

class App {
    public express;

    constructor() {
        let authMongo = '';
        this.express = express();

        if (process.env.DBUSER !== '' && process.env.DBPASS !== '') {
            authMongo = `${process.env.DBUSER}:${process.env.DBPASS}@`;
        }
        mongoose.connect(`mongodb://${authMongo}${process.env.DBHOST}/${process.env.DB}`).then(() => { });
        mongoose.connection.on("error", (err) => { });
        mongoose.set('debug', false);

        l10n.setTranslations("en", EnLan.default);
        this.express.use(l10n.enableL10NExpress);
        this.express.set("port", process.env.PORT);
        this.express.use(bodyParser.json({ limit: "1gb" }));
        this.express.use(bodyParser.urlencoded({ limit: "1gb", extended: true }));
        this.express.use(cors());

        this.mountRoutes();
    }
    private mountRoutes(): void {
        const router = express.Router();

        router.use("/", multipart(), (req, res, next) => {
            Utils.loggerConsole(req);
            return next();
        });
        router.use("/api/v1/user", new UserRoute());
        router.use("/*", Middleware.routeError);
        this.express.use(router);
    }
}

export default new App().express;
