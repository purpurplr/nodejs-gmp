import { Router } from 'express';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.model';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

const userService = new UsersService(User);
const authService = new AuthService(userService);
const authController = new AuthController(authService);

const authRouter = Router();

authRouter.route('/login').post(authController.login);

export default authRouter;
