import { Controller, Body, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service.';
import { UsersService } from 'src/shared/users.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}

  @Post('login')
  async login(
    @Body("username") username: string,
    @Body("password") password: string
  ) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid username');
    }

    const isValid = await this.authService.validateUser(user, password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const employee = await this.usersService.findEmployeeByUserId(user._id);

    if (!employee) {
      throw new UnauthorizedException('Missing employee');
    }

    return this.authService.generateJwtToken(user, employee?.role);
  }
}
