// import dayjs from "dayjs";
import { createLogger, Logger, transports, format } from "winston";
import "winston-daily-rotate-file";
const { label,prettyPrint } = format;
export const LOGGER_LEVEL = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
};
export class LoggerService {
  static createLogger() {
    return createLogger({
      exitOnError: false,
      levels: LOGGER_LEVEL,
      transports: [
        new transports.Console({
          level: "debug",
          format: format.combine(
            format.colorize(),
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            format.simple()
          ),
        }),
        new transports.DailyRotateFile({
          filename: "logs/error-%DATE%.log",
          datePattern: "YYYY-MM-DD",
          zippedArchive: true,
          maxSize: "20m",
          maxFiles: "14d",
          level: "error",
          format: format.combine(
            label({
              label: "error"
            }),
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            format.simple()
          ),
        }),
        new transports.DailyRotateFile({
          filename: "logs/info-%DATE%.log",
          datePattern: "YYYY-MM-DD",
          zippedArchive: true,
          maxSize: "20m",
          maxFiles: "14d",
          level: "info",
          format: format.combine(
            label({
              label: "info"
            }),
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            format.simple()
          ),
        }),
      ],
    });
  }
}
