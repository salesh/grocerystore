import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { EmployeesService } from "./employees.service";
import { UsersService } from "src/shared/users.service";
import { EmployeeRole } from "src/shared/models/models";
import { LocationsService } from "src/shared/locations.service";

@Controller("api/employees")
export class EmployeesController {
  constructor(
    private employeesService: EmployeesService,
    private usersService: UsersService,
    private locationsService: LocationsService,
  ) {}

  @Post()
  public async createEmployee(
    @Body("username") username: string,
    @Body("password") password: string,
    @Body("locationId") locationId: string,
    @Body("name") name: string,
  ) {
    const user = await this.usersService.createUser(username, password);
    return this.employeesService.createEmployee({
      userId: user._id,
      locationId,
      name,
    });
  }

  @Get()
  async findEmployees() {
    return this.employeesService.findEmployees();
  }

  @Put(":id")
  public async updateEmployee(
    @Param("id") _id: string,
    @Body("locationId") locationId: string,
    @Body("role") role: EmployeeRole,
    @Body("name") name: string,
  ) {
    return this.employeesService.updateEmployee({
      _id,
      locationId,
      role,
      name,
    });
  }

  @Delete(":id")
  async deleteEmployee(@Param("id") id: string) {
    return this.employeesService.deleteEmployee(id);
  }

  @Get("location/:id")
  async findAllEmployeesForLocation(@Param("id") locationId: string) {
    return this.employeesService.findAllEmployeesForLocation(locationId);
  }

  @Get("locations/:id")
  async findAllEmployeesForLocationAndLocationDescendants(
    @Param("id") locationId: string,
  ) {
    const location = await this.locationsService.findLocation(locationId);
    const locationDescendants =
      await this.locationsService.findLocationDescendants(location);
    return this.employeesService.findAllEmployeesForLocationAndLocationDescendants(
      [location, ...locationDescendants],
    );
  }
}
