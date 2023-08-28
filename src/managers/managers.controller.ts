import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { ManagersService } from "./managers.service";
import { UsersService } from "../shared/users.service";
import { LocationsService } from "../shared/locations.service";

@Controller("api/managers")
export class ManagersController {
  constructor(
    private managersService: ManagersService,
    private usersService: UsersService,
    private locationsService: LocationsService,
  ) {}

  @Post()
  public async createManager(
    @Body("username") username: string,
    @Body("password") password: string,
    @Body("locationId") locationId: string,
    @Body("name") name: string,
  ) {
    const user = await this.usersService.createUser(username, password);
    return this.managersService.createManager({
      userId: user._id,
      locationId,
      name,
    });
  }
  @Get("")
  async find() {
    return this.managersService.findManagers();
  }

  @Put(":id")
  public async updateManager(
    @Param("id") _id: string,
    @Body("locationId") locationId: string,
    @Body("name") name: string,
  ) {
    return this.managersService.updateManager({ _id, locationId, name });
  }

  @Delete(":id")
  async deleteManager(@Param("id") id: string) {
    return this.managersService.deleteManager(id);
  }

  @Get("location/:id")
  async findAllManagersForLocation(@Param("id") locationId: string) {
    return this.managersService.findAllManagersForLocation(locationId);
  }

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
