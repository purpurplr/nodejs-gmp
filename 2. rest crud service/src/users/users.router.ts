import { Router } from 'express';
import { usersController } from './users.controller';

const usersRouter = Router();

usersRouter.route('/').get(usersController.getUsers).post(usersController.createUser);

usersRouter
  .get('/:id', usersController.getUserById)
  .patch('/:id', usersController.patchUser)
  .delete('/:id', usersController.softDelete);

export default usersRouter;
