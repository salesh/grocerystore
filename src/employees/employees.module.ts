import { Module } from "@nestjs/common";
import { SharedModule } from "../shared/shared.module";
import { EmployeesService } from "./employees.service";
import { EmployeesController } from "./employees.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [SharedModule, AuthModule],
  providers: [EmployeesService],
  controllers: [EmployeesController],
  exports: [EmployeesService],
})
export class EmployeesModule {}
