import { Module } from "@nestjs/common";
import { SharedModule } from "../shared/shared.module";
import { AuthModule } from "../auth/auth.module";
import { ManagersService } from "./managers.service";
import { ManagersController } from "./managers.controller";

@Module({
  imports: [SharedModule, AuthModule],
  providers: [ManagersService],
  controllers: [ManagersController],
  exports: [ManagersService],
})
export class ManagersModule {}
