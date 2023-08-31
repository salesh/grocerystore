import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { PermissionsService } from "../shared/permissions.service";

@Injectable()
export class LocationGuard implements CanActivate {
  constructor(private permissionService: PermissionsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    const locationId = request.query.locationId;

    if (!locationId) {
      throw new BadRequestException("Error", {
        cause: new Error(),
        description: `Missing location, location=${locationId}`,
      });
    }

    const isLocationAllowedForEmployee =
      await this.permissionService.isLocationAllowedForEmployee(
        user.locationId,
        locationId,
      );
    if (!isLocationAllowedForEmployee) {
      throw new UnauthorizedException("Error", {
        cause: new Error(),
        description: `Not authorized, location=${locationId}`,
      });
    } else {
      return true;
    }
  }
}
