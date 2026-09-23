import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(name: string, email: string, password: string) {
    return this.usersService.create({
      name,
      email,
      password,
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email, true);

      console.log('USER:', user);
  console.log('PASSWORD EXISTS:', !!user?.password);
  
    if (!user) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    const payload = {
      sub: user._id.toString(),
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    const { password: _, ...safeUser } = user.toObject();

    return {
      accessToken,
      user: safeUser,
    };
  }
}