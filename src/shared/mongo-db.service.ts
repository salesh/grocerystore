import { Injectable, OnModuleInit } from "@nestjs/common";
import { Db, MongoClient } from "mongodb";
import { MyLogger } from "../common/my-logger";

@Injectable()
export class MongoDbService implements OnModuleInit {
  private _client: MongoClient;

  constructor(private logger: MyLogger) {}

  async onModuleInit(): Promise<void> {
    try {
      this.logger.info("Connecting to mongodb...");
      this._client = await MongoClient.connect(
        process.env.MONGODB_URL ?? "mongodb://localhost:27017/groceryStore",
      );
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
