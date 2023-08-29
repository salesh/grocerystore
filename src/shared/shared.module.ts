import { Module } from "@nestjs/common";
import { LoggerModule } from "../common/logger.module";
import { MongoDbService } from "./mongo-db.service";
import { UsersService } from "./users.service";
import { LocationsService } from "./locations.service";
import { PermissionsService } from "./permissions.service";

@Module({
  imports: [LoggerModule],
  providers: [
    MongoDbService,
    UsersService,
    LocationsService,
    PermissionsService,
  ],
  exports: [
    MongoDbService,
    LoggerModule,
    UsersService,
    LocationsService,
    PermissionsService,
  ],
})
export class SharedModule {}
