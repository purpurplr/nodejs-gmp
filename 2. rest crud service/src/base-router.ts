import { Router } from 'express';
import usersRouter from './users/users.router';

const baseRouter = Router();

baseRouter.use('/users', usersRouter);

export default baseRouter;
