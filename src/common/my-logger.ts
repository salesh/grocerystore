import { Injectable, LoggerService, Scope } from "@nestjs/common";
import { Logger } from "winston";

@Injectable({ scope: Scope.TRANSIENT })
export class MyLogger implements LoggerService {
  constructor(private readonly logger: Logger) {}

  log(message: string, context?: string): Logger {
    return this.info(message, context);
  }

  info(message: string, context?: any): Logger {
    if (typeof context === "string") {
      context = { context };
    }
    return this.logger.info(message, context);
  }

  error(message: string, trace?: string, context?: any): Logger {
    if (typeof context === "string") {
      context = { context };
    }
    return this.logger.error(message, { ...context, stack: [trace] });
  }

  warn(message: string, context?: any): Logger {
    if (typeof context === "string") {
      context = { context };
    }
    return this.logger.warn(message, context);
  }

  debug(message: string, context?: any): Logger {
    if (typeof context === "string") {
      context = { context };
    }
    return this.logger.debug(message, context);
  }

  verbose(message: string, context?: any): Logger {
    if (typeof context === "string") {
      context = { context };
    }
    return this.logger.verbose(message, context);
  }
}
