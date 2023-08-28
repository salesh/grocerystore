import { Injectable, OnModuleInit } from "@nestjs/common";
import { Db, MongoClient } from "mongodb";
import { MyLogger } from "../common/my-logger";
import { ConfigService } from "../common/config.service";

@Injectable()
export class MongoDbService implements OnModuleInit {
  private _client: MongoClient;

  constructor(private logger: MyLogger) {}

  async onModuleInit(): Promise<void> {
    try {
      this.logger.info("Connecting to mongodb...");
      this._client = await MongoClient.connect(ConfigService.mongoDBUrl());
      this.logger.info("Connected to mongodb");
    } catch (err) {
      this.logger.error("Could not connect to mongodb", err);
      process.exit(1);
    }
  }

  private client(): MongoClient {
    return this._client;
  }

  db(): Db {
    return this.client().db();
  }

  collection(collectionName: string) {
    return this.db().collection(collectionName);
  }
}
