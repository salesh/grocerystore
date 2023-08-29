import {
  Controller,
  Request,
  Post,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service.";
import { UsersService } from "src/shared/users.service";
import { LocalAuthGuard } from "../guards/local-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Request() req: any) {
    const user = req.user;
    const employee = await this.usersService.findEmployeeByUserId(user._id);

    if (!employee) {
      throw new UnauthorizedException("Missing employee");
    }

    return this.authService.generateJwtToken(user, employee?.role);
  }
}
