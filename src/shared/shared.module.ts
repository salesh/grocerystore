import { Module } from "@nestjs/common";
import { LoggerModule } from "../common/logger.module";
import { MongoDbService } from "./mongo-db.service";

@Module({
  imports: [LoggerModule],
  providers: [MongoDbService],
  exports: [MongoDbService, LoggerModule],
})
export class SharedModule {}
