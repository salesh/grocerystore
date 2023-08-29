import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { EmployeesService } from "./employees.service";
import { UsersService } from "../shared/users.service";
import { EmployeeRole } from "../shared/models/models";
import { LocationsService } from "src/shared/locations.service";
import { AuthService } from "../auth/auth.service";
import { JwtAuthGuard } from "../guards/jwt-auth-guard";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { LocationGuard } from "../guards/location.guard";
import Role from "../enums/role.enum";

@Controller("api/employees")
@UseGuards(JwtAuthGuard, RolesGuard, LocationGuard)
export class EmployeesController {
  constructor(
    private employeesService: EmployeesService,
    private usersService: UsersService,
    private locationsService: LocationsService,
    private authService: AuthService,
  ) {}

  @Roles(Role.Manager)
  @Post()
  public async createEmployee(
    @Body("username") username: string,
    @Body("password") password: string,
    @Body("locationId") locationId: string,
    @Body("name") name: string,
  ) {
    const hash = await this.authService.hashPassword(password);
    const user = await this.usersService.createUser(username, hash);
    return this.employeesService.createEmployee({
      userId: user._id,
      locationId,
      name,
    });
  }

  @Roles(Role.Manager, Role.Employee)
  @Get()
  async findEmployees(@Body("locationId") locationId: string) {
    return this.employeesService.findEmployeesByLocationId(locationId);
  }

  @Roles(Role.Manager)
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

  @Roles(Role.Manager)
  @Delete(":id")
  async deleteEmployee(@Param("id") id: string) {
    return this.employeesService.deleteEmployee(id);
  }

  @Roles(Role.Manager, Role.Employee)
  @Get("location/:locationId")
  async findEmployeesByLocationId(@Param("locationId") locationId: string) {
    return this.employeesService.findEmployeesByLocationId(locationId);
  }

  @Roles(Role.Manager, Role.Employee)
  @Get("locations/:locationId")
  async findAllEmployeesForLocationAndLocationDescendants(
    @Param("locationId") locationId: string,
  ) {
    const employeeLocation =
      await this.locationsService.findLocation(locationId);
    if (!employeeLocation) {
      throw new NotFoundException("Error", {
        cause: new Error(),
        description: `Could not find location, location=${locationId}`,
      });
    }

    const locationDescendants =
      await this.locationsService.findLocationDescendants(employeeLocation);

    let allLocations = [employeeLocation];
    if (locationDescendants) {
      allLocations = [...allLocations, ...locationDescendants];
    }

    return this.employeesService.findAllEmployeesForLocationAndLocationDescendants(
      allLocations,
    );
  }
}
