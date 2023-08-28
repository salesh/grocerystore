import { OnModuleInit } from "@nestjs/common";
import * as dotenv from "dotenv";

export class ConfigService implements OnModuleInit {
  onModuleInit(): any {
    dotenv.config();
  }

  static get environment(): string {
    return process.env.ENVIRONMENT || "DEV";
  }

  static isDevEnvironment(): boolean {
    return this.environment === "DEV";
  }

  static isProdEnvironment(): boolean {
    return this.environment === "PROD";
  }

  static isTestEnvironment(): boolean {
    return this.environment === "TEST";
  }

  static isProdOrTestEnvironment(): boolean {
    return this.isProdEnvironment() || this.isTestEnvironment();
  }

  static mongoDBUrl(): string {
    return process.env.MONGODB_URL || "mongodb://localhost:27017/groceryStore";
  }

  static authSecret() {
    if (!process.env.SECRET) {
      throw new Error("Environment variable SECRET not set!");
    }
    return process.env.SECRET;
  }

  static logLevel() {
    return process.env.LOG_LEVEL || "info";
  }
}
