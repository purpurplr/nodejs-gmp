import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { User, UserCreationAttributes } from './users.model';
import { suggestedUsersSchema, userDraftSchema } from './user.schemas';
import { recordIdSchema } from '../shared/shared.schemas';
import { validator } from '../validator';
import { UserService } from './user.service';

const userService = new UserService(User);

export const usersController = {
  getUsers: [
    validator.query(suggestedUsersSchema),
    async (req: Request<{}, {}, {}, { limit?: number; login?: string }>, res: Response<User[]>): Promise<void> => {
      const { limit, login } = req.query;
      const result: User[] = await userService.getAll(login, limit);
      res.json(result);
    },
  ],

  getUserById: [
    validator.params(recordIdSchema),
    async (req: Request<{ id: string }>, res: Response<User | undefined>): Promise<void> => {
      const user: User | null = await User.findByPk(req.params.id);
      if (user) {
        res.json(user);
      } else {
        res.status(StatusCodes.NOT_FOUND).end();
      }
    },
  ],

  createUser: [
    validator.body(userDraftSchema.options({ presence: 'required' })),
    async (req: Request<{}, User, UserCreationAttributes>, res: Response<User>): Promise<void> => {
      const user: User = await User.create(req.body);
      res.json(user);
    },
  ],

  patchUser: [
    validator.params(recordIdSchema),
    validator.body(userDraftSchema),
    async (
      req: Request<{ id: string }, User, Partial<UserCreationAttributes>>,
      res: Response<User | undefined>,
    ): Promise<void> => {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (user) {
        user.set({ ...req.body });
        const updatedUser: User = await user.save();
        res.json(updatedUser);
      } else {
        res.status(StatusCodes.NOT_FOUND).end();
      }
    },
  ],

  softDelete: [
    validator.params(recordIdSchema),
    async (req: Request<{ id: string }>, res: Response): Promise<void> => {
      const { id } = req.params;
      const user: User | null = await User.findByPk(id);
      if (user) {
        await user.destroy();
        res.status(StatusCodes.OK).end();
      } else {
        res.status(StatusCodes.NOT_FOUND).end();
      }
    },
  ],
};
