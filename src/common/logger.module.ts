import { Module } from "@nestjs/common";
import { createLogger, format, transports } from "winston";
import * as Transport from "winston-transport";
import { MyLogger } from "./my-logger";

@Module({
  providers: [
    {
      provide: MyLogger,
      useFactory: () => {
        const customFormat = format.printf(
          ({ level, message, timestamp, metadata }) => {
            let out = `${timestamp} ${level}: ${message}`;
            if (metadata) {
              const suffix = Object.keys(metadata)
                .map((key) => `${key}=${metadata[key]}`)
                .join(", ");
              out += ` ${suffix}`;
            }
            return out;
          },
        );
        const loggerTransports: Transport[] = [
          new transports.Console({
            format: format.combine(
              format.colorize(),
              format.timestamp(),
              format.metadata({
                fillExcept: ["message", "level", "timestamp"],
              }),
              customFormat,
            ),
          }),
        ];

        // We can add custom transport

        const logger = createLogger({
          level: process.env.LOG_LEVEL,
          exitOnError: false,
          format: format.simple(),
          transports: loggerTransports,
        });

        return new MyLogger(logger);
      },
    },
  ],
  exports: [MyLogger],
})
export class LoggerModule {}
