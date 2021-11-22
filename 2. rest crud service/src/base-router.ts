import { Router } from 'express';
import usersRouter from './users/users.router';
import rolesRouter from './roles/roles.router';

const baseRouter = Router();

baseRouter.use('/users', usersRouter).use('/roles', rolesRouter);

export default baseRouter;
