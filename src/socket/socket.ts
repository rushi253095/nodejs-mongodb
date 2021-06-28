import { Constants } from "../constants/constants";
import { Log } from "../helper/logger";
import { Redis } from "../helper/redis";
import { PoolSocketEvents } from "./socketEvents";
import { SocketUtils } from "./socketUtilts";

export class PoolSocket {
    private logger = Log.getLogger();
    private socketUtils = new SocketUtils();
    private redis = new Redis().client;
    public init(io, app) {
        io.use(async (socket, next) => {
            const params = socket.handshake.query;
            let token = '';
            if (params.authorization) {
                token = params.authorization;
                console.log('check your token');
                // const userData = await this.socketUtils.getUserData(token);
                // if (userData) {
                //     socket.join(userData.roleId);
                //     socket.user = userData;
                //     next();
                // }
            } else {
                console.log(`Signup User`);
            }
        })
            .on("connection", async (socket) => {
                try {
                    app.set("socketIo", socket);
                    // tslint:disable-next-line: max-line-length
                    const redisSet = await this.redis.hset(process.env.SOCKET_NAME, socket.user._id);
                    if (redisSet) {
                        const poolSocketEvents = new PoolSocketEvents();
                        poolSocketEvents.init(socket, io);
                    }

                } catch (err) {
                    this.logger.error(err);
                }
            });
    }
}
