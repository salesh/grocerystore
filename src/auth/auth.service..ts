
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EmployeeRole, Users } from 'src/shared/models/models';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService,
    ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async isMatch(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async validateUser(user: Users, password: string): Promise<boolean> {
    return this.isMatch(password, user.password);
  }

  async generateJwtToken(user: Users, role: EmployeeRole | undefined) {
    const payload = { 
      sub: user._id, 
      username: user.username, 
      role,
    };
    
    return {
      access_token: this.jwtService.sign(payload)
    };
  }
}
