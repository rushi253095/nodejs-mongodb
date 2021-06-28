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
import * as SocketIO from "socket.io";
import { PoolSocket } from "./socket/socket";
import { Log } from "./helper/logger";
class App {
    public express;
    private poolSocket = new PoolSocket();
    private logger = Log.getLogger();
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
        this.express.use(bodyParser.json({ limit: "1gb" }));
        this.express.use(bodyParser.urlencoded({ limit: "1gb", extended: true }));
        this.express.use(cors());
        const Server = this.express.listen(process.env.PORT, () => {
            this.logger.info(`The server is running in port localhost: ${process.env.PORT}`);
          });

        const io = SocketIO.listen(Server, {
            transports: ["websocket", "polling"],
        });
        this.express.set("IO", io);
        this.poolSocket.init(io, this.express);

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
