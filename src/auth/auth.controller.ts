import {
  Controller,
  Request,
  Post,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersService } from "src/shared/users.service";
import { LocalAuthGuard } from "../guards/local-auth.guard";
import { ApiBody } from "@nestjs/swagger";
import LoginDto from "./login.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Request() req: any) {
    const user = req.user;
    const employee = await this.usersService.findEmployeeByUserId(user._id);

    if (!employee) {
      throw new UnauthorizedException("Error", {
        cause: new Error(),
        description: `Missing employee`,
      });
    }

    return this.authService.generateJwtToken(
      user,
      employee?.role,
      employee.locationId,
    );
  }
}
