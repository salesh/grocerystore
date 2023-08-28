import { Module } from "@nestjs/common";
import { LoggerModule } from "../common/logger.module";
import { MongoDbService } from "./mongo-db.service";
import { UsersService } from "./users.service";
import { LocationsService } from "./locations.service";

@Module({
  imports: [LoggerModule],
  providers: [MongoDbService, UsersService, LocationsService],
  exports: [MongoDbService, LoggerModule, UsersService, LocationsService],
})
export class SharedModule {}
