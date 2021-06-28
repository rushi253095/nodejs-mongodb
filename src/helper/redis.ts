import * as redis from "redis";
import { Log } from "./logger";
import { MemCache } from "./memCache";

export class Redis {
    public  client;
    private logger = Log.getLogger();
    private memCache = MemCache.memCache;
    private redisConfig;
    constructor() {
        this.redisConfig = {redisUrl: process.env.REDIS_URL, redisPort: process.env.REDIS_PORT};
        this.getClient(this.redisConfig);
    }
    public async getClient(config) {
        if (config.redisUrl) {
            this.client = redis.createClient(config.redisPort, config.redisUrl, {
            no_ready_check: true,
            });

            this.client.on("error", (err) => {
                this.logger.error(`Error ${err}`);
            });

            this.client.monitor((err, res) => {
                // this.logger.debug("Entering monitoring mode.");
            });

            this.client.on("monitor", (time, args) => {
                // this.logger.debug(`${time}: ${args}`);
            });
        } else {
            return this.memCache;
        }
        this.client.phget = (set, key) => {
            return new Promise((resolve, reject) => {
              this.client.hget(set, key, (err, data) => {
                if (err) {
                  return reject(err);
                }
                return resolve(data);
              });
            });
          };

        this.client.phmget = (set, keys) => {
            return new Promise((resolve, reject) => {
              this.client.hmget(set, [...keys], (err, data) => {
                if (err) {
                  return resolve([]);
                }
                return resolve(data);
              });
            });
          };

        this.client.pget = (key) => {
            return new Promise((resolve, reject) => {
              this.client.get(key, (err, data) => {
                if (err) {
                  return reject(err);
                }
                return resolve(data ? JSON.parse(data.toString()) : null);
              });
            });
          };

        this.client.pdelall = (pattern, cb) => {
            return new Promise((resolve, reject) => {
              this.client.keys(pattern, (err, replies) => {
                cb(replies);
                if (err) {
                  return reject(err);
                }
                this.client.del(replies, (errDel, o) => {
                  if (err) {
                    return reject(errDel);
                  }
                  return resolve(true);
                });
              });
            });
          };

        this.client.phdelall = (set, cb) => {
            return new Promise((resolve, reject) => {
              this.client.hkeys(set, (err, replies) => {
                if (err) {
                  return reject(err);
                }
                cb(replies);
                this.client.del(replies, (errDel, o) => {
                  if (err) {
                    return reject(errDel);
                  }
                  return resolve(true);
                });
              });
            });
          };
        return this.client;
    }
}
