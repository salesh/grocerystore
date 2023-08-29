import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { PermissionsService } from "../shared/permissions.service";

@Injectable()
export class LocationGuard implements CanActivate {
  constructor(private permissionService: PermissionsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    const locationId = request.params.locationId ?? request.body.locationId;

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
