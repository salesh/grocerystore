import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { EmployeesService } from "./employees.service";
import { UsersService } from "src/shared/users.service";
import { EmployeeRole } from "src/shared/models/models";

@Controller("api/employees")
export class EmployeesController {
  constructor(private employeesService: EmployeesService, private usersService: UsersService) {}

  @Post()
  public async create(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('locationId') locationId: string,
    @Body('role') role: EmployeeRole,
    @Body('name') name: string
  ) {
    const user = await this.usersService.createUser(username, password);
    return this.employeesService.createEmployee({userId: user._id, locationId, role, name})
  }

  @Get()
  async find() {
    return this.employeesService.findEmployees();
  }

  @Put(':id')
  public async update(
    @Param('id') _id: string,
    @Body('locationId') locationId: string,
    @Body('role') role: EmployeeRole,
    @Body('name') name: string
  ) {
    return this.employeesService.updateEmployee({_id, locationId, role, name})
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string
  ) {
    return this.employeesService.deleteEmployee(id);
  }
}
