import path from "path";
import winston, { format, transports } from "winston";

const logDir = path.resolve(__dirname, "./../../logs");

export const logger = winston.createLogger({
  /*
   * NOTE: npm log levels:
   * { error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6 }
   */
  level: "info",
  format: format.combine(format.timestamp(), format.json()),
  defaultMeta: { app: "backend" },
  transports: [
    // write log level -> error, fatal
    new winston.transports.File({
      filename: path.resolve(logDir, "error/error.log"),
      level: "error",
    }),
    // write log level -> fatal, error, warn, info
    new winston.transports.File({
      filename: path.resolve(logDir, "combined/combined.log"),
    }),
  ],

  // handle exceptions
  exceptionHandlers: [
    new transports.File({
      filename: path.resolve(logDir, "exceptions/exceptions.log"),
    }),
  ],
});

