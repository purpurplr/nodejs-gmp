import { Router } from 'express';
import usersRouter from './users/users.router';
import rolesRouter from './roles/roles.router';
import { checkJwtToken } from './utils/check-jwt-token.middleware';

const baseRouter = Router();

baseRouter.use(checkJwtToken).use('/users', usersRouter).use('/roles', rolesRouter);

export default baseRouter;
