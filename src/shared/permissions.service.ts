import { Injectable } from "@nestjs/common";
import { LocationsService } from "./locations.service";

@Injectable()
export class PermissionsService {
  constructor(private locationService: LocationsService) {}

  async isLocationAllowedForEmployee(
    employeeLocationId: string,
    locationId: string,
  ) {
    if (employeeLocationId === locationId) {
      return true;
    }

    const employeeLocation =
      await this.locationService.findLocation(employeeLocationId);
    if (!employeeLocation) {
      return false;
    }

    const locationDescendants =
      await this.locationService.findLocationDescendants(employeeLocation);
    return locationDescendants
      .map((location) => location._id)
      .includes(locationId);
  }
}
