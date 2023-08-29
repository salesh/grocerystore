import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SharedModule } from "./shared/shared.module";
import { EmployeesService } from "./employees/employees.service";
import { ManagersController } from "./managers/managers.controller";
import { EmployeesController } from "./employees/employees.controller";
import { ManagersService } from "./managers/managers.service";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), SharedModule, AuthModule],
  controllers: [EmployeesController, ManagersController],
  providers: [EmployeesService, ManagersService],
})
export class AppModule {}
