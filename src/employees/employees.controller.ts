import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { EmployeesService } from "./employees.service";
import { UsersService } from "../shared/users.service";
import { EmployeeRole } from "../shared/models/models";
import { LocationsService } from "src/shared/locations.service";
import { AuthService } from "../auth/auth.service.";
import { JwtAuthGuard } from "../guards/jwt-auth-guard";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "../auth/roles.decorator";
import Role from "../enums/role.enum";

@Controller("api/employees")
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeesController {
  constructor(
    private employeesService: EmployeesService,
    private usersService: UsersService,
    private locationsService: LocationsService,
    private authService: AuthService,
  ) {}

  @Roles(Role.Manager, Role.Employee)
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
  async findEmployees() {
    return this.employeesService.findEmployees();
  }

  @Roles(Role.Manager, Role.Employee)
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

  @Roles(Role.Manager, Role.Employee)
  @Delete(":id")
  async deleteEmployee(@Param("id") id: string) {
    return this.employeesService.deleteEmployee(id);
  }

  @Roles(Role.Manager, Role.Employee)
  @Get("location/:id")
  async findAllEmployeesForLocation(@Param("id") locationId: string) {
    return this.employeesService.findAllEmployeesForLocation(locationId);
  }

  @Roles(Role.Manager, Role.Employee)
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
