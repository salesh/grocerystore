import { Module } from "@nestjs/common";
import { LoggerModule } from "../common/logger.module";
import { MongoDbService } from "./mongo-db.service";
import { UsersService } from "./users.service";

@Module({
  imports: [LoggerModule],
  providers: [MongoDbService, UsersService],
  exports: [MongoDbService, LoggerModule, UsersService],
})
export class SharedModule {}
