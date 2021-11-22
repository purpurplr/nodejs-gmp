import { Router } from 'express';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './users.model';

const userService = new UsersService(User);
const usersController = new UsersController(userService);

const usersRouter = Router();

usersRouter.route('/').get(usersController.getUsers).post(usersController.createUser);

usersRouter
  .get('/:id', usersController.getUserById)
  .patch('/:id', usersController.patchUser)
  .delete('/:id', usersController.softDelete);

export default usersRouter;
