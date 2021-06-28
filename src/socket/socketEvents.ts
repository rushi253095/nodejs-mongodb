import * as moment from "moment";
import { SocketEvents } from "../constants/socketEvents";
import { Log } from "../helper/logger";
import { Redis } from "../helper/redis";
import { Constants } from "../constants/constants";
import { Validator } from "./socketValidators";

export class PoolSocketEvents {
    private logger = Log.getLogger();
    private validatorMapping = new Validator.ValidatorMapping();
    private socket;
    private io;
    private redis = new Redis().client;
    public init(socket, io) {
        this.socket = socket;
        this.io = io;
        this.mwValidator();
        this.listenToEvents();
    }

    private mwValidator() {
        this.socket.use(async (packet, next) => {
            const [socketEvent, socketBody] = packet;
            if (socketEvent) {
                // Validtaion body
            }
        });
    }

    private async listenToEvents() {
        this.onSignup();
    }

    private async onSignup() {
        this.socket.on(SocketEvents.EMIT_SIGNUP, async (req) => {
            console.log("Socket Signup", req);
            // Code for Socket
        });
    }

}
