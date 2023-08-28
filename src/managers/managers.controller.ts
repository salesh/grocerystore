import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ManagersService } from "./managers.service";
import { EmployeeRole } from "../shared/models/models";
import { UsersService } from "../shared/users.service";

@Controller("api/managers")
export class ManagersController {
  constructor(private managersService: ManagersService, private usersService: UsersService) {}

  @Post()
  public async createManager(    
  @Body('username') username: string,
  @Body('password') password: string,
  @Body('locationId') locationId: string,
  @Body('role') role: EmployeeRole,
  @Body('name') name: string
) {
  const user = await this.usersService.createUser(username, password);
  return this.managersService.createManager({userId: user._id, locationId, role, name})
}
  @Get("")
  async find() {
    return this.managersService.findManagers();
  }

  @Put(':id')
  public async updateManager(
    @Param('id') _id: string,
    @Body('locationId') locationId: string,
    @Body('role') role: EmployeeRole,
    @Body('name') name: string
  ) {
    return this.managersService.updateManager({_id, locationId, role, name})
  }

  @Delete(':id')
  async deleteManager(
    @Param('id') id: string
  ) {
    return this.managersService.deleteManager(id);
  }
}
