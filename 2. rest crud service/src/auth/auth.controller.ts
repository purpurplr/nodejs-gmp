import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { validator } from '../validator';
import { AppendMiddlewareWith } from '../decorators/append-middleware-with.decorator';
import { errorLoggerFactory } from '../decorators/error-logger-factory';
import { authSchema } from './auth.schemas';
import { AuthService } from './auth.service';
import { AuthDTO } from './auth.interfaces';

export class AuthController {
  @AppendMiddlewareWith([errorLoggerFactory])
  public login = [
    validator.body(authSchema.options({ presence: 'required' })),
    async (req: Request<{}, string, AuthDTO>, res: Response<string>): Promise<void> => {
      const { login, password } = req.body;
      const token = await this.authService.login(login, password);
      if (token) {
        res.send(token);
      } else {
        res.status(StatusCodes.UNAUTHORIZED).end();
      }
    },
  ];

  constructor(private authService: AuthService) {}
}
