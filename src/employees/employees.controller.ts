import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { EmployeesService } from "./employees.service";
import { UsersService } from "../shared/users.service";
import { EmployeeRole } from "../shared/models/models";
import { LocationsService } from "../shared/locations.service";
import { AuthService } from "../auth/auth.service";
import { JwtAuthGuard } from "../guards/jwt-auth-guard";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { LocationGuard } from "../guards/location.guard";
import Role from "../enums/role.enum";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import CreateEmployeeDto from "../shared/create-employee.dto";
import UpdateEmployeeDto from "../shared/update-employee.dto";

@Controller("api/employees")
@ApiTags("employees")
@ApiBearerAuth("JWT")
@UseGuards(JwtAuthGuard, RolesGuard, LocationGuard)
export class EmployeesController {
  constructor(
    private employeesService: EmployeesService,
    private usersService: UsersService,
    private locationsService: LocationsService,
    private authService: AuthService,
  ) {}

  @Roles(Role.Manager)
  @ApiBody({ type: CreateEmployeeDto })
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
  async findEmployees(@Query("locationId") locationId: string) {
    return this.employeesService.findEmployeesByLocationId(locationId);
  }

  @Roles(Role.Manager)
  @ApiBody({ type: UpdateEmployeeDto })
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
  async deleteEmployee(
    @Param("id") id: string,
    @Query("locationId") locationId: string,
  ) {
    return this.employeesService.deleteEmployee(id);
  }

  @Roles(Role.Manager, Role.Employee)
  @Get("location/:locationId")
  async findEmployeesByLocationId(@Param("locationId") locationId: string) {
    return this.employeesService.findEmployeesByLocationId(locationId);
  }

  @Roles(Role.Manager, Role.Employee)
  @Get("locations/:locationId")
  async findEmployeesForLocationAndLocationDescendants(
    @Param("locationId") locationId: string,
  ) {
    const employeeLocation =
      await this.locationsService.findLocation(locationId);

    const locationDescendants =
      await this.locationsService.findLocationDescendants(employeeLocation);

    let allLocations = [employeeLocation];
    if (locationDescendants) {
      allLocations = [...allLocations, ...locationDescendants];
    }

    return this.employeesService.findEmployeesForLocationAndLocationDescendants(
      allLocations,
    );
  }
}
