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
import { ManagersService } from "./managers.service";
import { UsersService } from "../shared/users.service";
import { LocationsService } from "../shared/locations.service";
import { AuthService } from "../auth/auth.service.";
import { JwtAuthGuard } from "../guards/jwt-auth-guard";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "../auth/roles.decorator";
import Role from "../enums/role.enum";

@Controller("api/managers")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ManagersController {
  constructor(
    private managersService: ManagersService,
    private usersService: UsersService,
    private locationsService: LocationsService,
    private authService: AuthService,
  ) {}

  @Roles(Role.Manager)
  @Post()
  public async createManager(
    @Body("username") username: string,
    @Body("password") password: string,
    @Body("locationId") locationId: string,
    @Body("name") name: string,
  ) {
    const hash = await this.authService.hashPassword(password);
    const user = await this.usersService.createUser(username, hash);
    return this.managersService.createManager({
      userId: user._id,
      locationId,
      name,
    });
  }

  @Roles(Role.Manager)
  @Get("")
  async find() {
    return this.managersService.findManagers();
  }

  @Roles(Role.Manager)
  @Put(":id")
  public async updateManager(
    @Param("id") _id: string,
    @Body("locationId") locationId: string,
    @Body("name") name: string,
  ) {
    return this.managersService.updateManager({ _id, locationId, name });
  }

  @Roles(Role.Manager)
  @Delete(":id")
  async deleteManager(@Param("id") id: string) {
    return this.managersService.deleteManager(id);
  }

  @Roles(Role.Manager)
  @Get("location/:id")
  async findAllManagersForLocation(@Param("id") locationId: string) {
    return this.managersService.findAllManagersForLocation(locationId);
  }

  @Roles(Role.Manager)
  @Get("locations/:id")
  async findAllManagersForLocationAndLocationDescendants(
    @Param("id") locationId: string,
  ) {
    const location = await this.locationsService.findLocation(locationId);
    const locationDescendants =
      await this.locationsService.findLocationDescendants(location);
    return this.managersService.findAllManagersForLocationAndLocationDescendants(
      [location, ...locationDescendants],
    );
  }
}
