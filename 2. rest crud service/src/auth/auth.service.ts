import * as jwt from 'jsonwebtoken';
import { LogCalls } from '../decorators/call-logger.decorator';
import { DecorateMethodsWith } from '../decorators/decorate-methods-with.decorator';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.model';

@DecorateMethodsWith([LogCalls])
export class AuthService {
  private readonly secret: string;

  constructor(private userService: UsersService) {
    if (!process.env.JWT_SECRET) throw new Error('Missing JWT secret');
    this.secret = process.env.JWT_SECRET;
  }

  public async login(login: string, password: string): Promise<string | null> {
    const [user] = await this.userService.getAll(login);
    return user?.password === password ? this.getToken(user) : null;
  }

  private getToken({ login, id }: User): string {
    return jwt.sign({ login, id }, this.secret, { expiresIn: 3600 });
  }
}
