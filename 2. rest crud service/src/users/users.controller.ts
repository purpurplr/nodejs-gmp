import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { usersModel } from './users.model';
import { suggestedUsersSchema, User, UserDraft, userDraftSchema } from './user.schemas';
import { recordIdSchema } from '../shared/shared.schemas';
import { validator } from '../validator';

export const usersController = {
  getUsers: [
    validator.query(suggestedUsersSchema),
    (req: Request<{}, {}, {}, { limit?: number; login?: string }>, res: Response<User[]>): void => {
      const limit = req.query.limit;
      const loginSubstring = req.query.login;
      const lookingForSuggested: boolean = !!(limit ?? loginSubstring);
      const result: User[] = lookingForSuggested ? usersModel.getSuggested(limit, loginSubstring) : usersModel.getAll();
      res.json(result);
    },
  ],

  getUserById: [
    validator.params(recordIdSchema),
    (req: Request<{ id: string }>, res: Response<User | undefined>): void => {
      const user: User | undefined = usersModel.getById(req.params.id);
      if (user) {
        res.json(user);
      } else {
        res.status(StatusCodes.NOT_FOUND).end();
      }
    },
  ],

  createUser: [
    validator.body(userDraftSchema.options({ presence: 'required' })),
    (req: Request<{}, User, UserDraft>, res: Response<User>): void => {
      const user: User = usersModel.create(req.body);
      res.json(user);
    },
  ],

  patchUser: [
    validator.params(recordIdSchema),
    validator.body(userDraftSchema),
    (req: Request<{ id: string }, null, Partial<UserDraft>>, res: Response<User | undefined>): void => {
      const { id } = req.params;
      const hasUser: boolean = !!usersModel.getById(id);
      if (hasUser) {
        const updatedUser = usersModel.edit(id, req.body);
        res.json(updatedUser);
      } else {
        res.status(StatusCodes.NOT_FOUND).end();
      }
    },
  ],

  softDelete: [
    validator.params(recordIdSchema),
    (req: Request<{ id: string }>, res: Response): void => {
      const { id } = req.params;
      const hasUser: boolean = !!usersModel.getById(id);
      if (hasUser) {
        usersModel.softDelete(id);
        res.status(StatusCodes.OK).end();
      } else {
        res.status(StatusCodes.NOT_FOUND).end();
      }
    },
  ],
};
