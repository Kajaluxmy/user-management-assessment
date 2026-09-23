import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

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

  const { password: _, ...safeUser } = user.toObject();

  return safeUser;
}
}