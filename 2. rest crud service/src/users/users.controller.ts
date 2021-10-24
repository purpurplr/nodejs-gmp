import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserDraft, User, usersModel } from './users.model';

export const usersController = {
  getUsers(req: Request<null, null, null, { limit?: string; login?: string }>, res: Response<User[]>): void {
    const limit: number = Number(req.query.limit);
    const loginSubstring: string | undefined = req.query.login;
    const lookingForSuggested: boolean = !!(limit || loginSubstring);
    const result: User[] = lookingForSuggested ? usersModel.getSuggested(limit, loginSubstring) : usersModel.getAll();
    res.json(result);
  },

  getUserById(req: Request<{ id: string }>, res: Response<User | undefined>): void {
    const user: User | undefined = usersModel.getById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(StatusCodes.NOT_FOUND).end();
    }
  },

  createUser(req: Request<null, User, UserDraft>, res: Response<User>): void {
    const user: User = usersModel.create(req.body);
    res.json(user);
  },

  patchUser(req: Request<{ id: string }, null, Partial<UserDraft>>, res: Response<User | undefined>): void {
    const { id } = req.params;
    const hasUser: boolean = !!usersModel.getById(id);
    if (hasUser) {
      const updatedUser = usersModel.edit(id, req.body);
      res.json(updatedUser);
    } else {
      res.status(StatusCodes.NOT_FOUND).end();
    }
  },

  softDelete(req: Request<{ id: string }>, res: Response): void {
    const { id } = req.params;
    const hasUser: boolean = !!usersModel.getById(id);
    if (hasUser) {
      usersModel.softDelete(id);
      res.status(StatusCodes.OK).end();
    } else {
      res.status(StatusCodes.NOT_FOUND).end();
    }
  },
};

// TODO maybe refactor some middleware
