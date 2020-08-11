import * as moment from "moment-timezone";
import { createLogger, format } from "winston";
import * as DailyRotateFile from "winston-daily-rotate-file";

import commonConstants from "../constants/commonConstants";

const { combine, timestamp, prettyPrint } = format;

const transport = new DailyRotateFile({
    maxSize: '20g',
    maxFiles: '14d',
    dirname: './logs',
    zippedArchive: true,
    datePattern: 'YYYY-MM-DD',
    filename: `${process.env.NODE_ENV}-%DATE%.log`,
});

const timestampFormat = () => {
    return moment.tz(new Date(), commonConstants.timezone).format("YYYY-MM-DD hh:mm:ss");
};

const logger = createLogger({
    format: combine(
        timestamp({ format: timestampFormat() }),
        prettyPrint(),
    ),
    transports: [transport],
});

export default logger;
