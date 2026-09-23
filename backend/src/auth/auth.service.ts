import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    name: string,
    email: string,
    password: string,
  ) {
    return this.usersService.create({
      name,
      email,
      password,
    });
  }

  async validateUser(
    email: string,
    password: string,
  ) {
    const user = await this.usersService.findByEmail(
      email,
      true,
    );

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

  async getCurrentUser(userId: string) {
    return this.usersService.findById(userId);
  }

  async login(
    email: string,
    password: string,
  ) {
    const user = await this.validateUser(
      email,
      password,
    );

    const payload = {
      sub: user._id.toString(),
      email: user.email,
    };

    const accessToken =
      await this.jwtService.signAsync(payload);

    const { password: _, ...safeUser } =
      user.toObject();

    return {
      accessToken,
      user: safeUser,
    };
  }
}