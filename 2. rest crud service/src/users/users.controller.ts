import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { User, UserCreationAttributes } from './users.model';
import { suggestedUsersSchema, userDraftSchema } from './user.schemas';
import { recordIdSchema } from '../shared/shared.schemas';
import { validator } from '../validator';
import { CrudService } from '../interfaces/crud-service';

export class UsersController {
  public getUsers = [
    validator.query(suggestedUsersSchema),
    async (req: Request<{}, {}, {}, { limit?: number; login?: string }>, res: Response<User[]>): Promise<void> => {
      const { limit, login } = req.query;
      const result: User[] = await this.userService.getAll(login, limit);
      console.log(result);
      res.json(result);
    },
  ];

  public getUserById = [
    validator.params(recordIdSchema),
    async (req: Request<{ id: string }>, res: Response<User | undefined>): Promise<void> => {
      const user: User | null = await this.userService.findByPk(req.params.id);
      if (user) {
        res.json(user);
      } else {
        res.status(StatusCodes.NOT_FOUND).end();
      }
    },
  ];

  public createUser = [
    validator.body(userDraftSchema.options({ presence: 'required' })),
    async (req: Request<{}, User, UserCreationAttributes>, res: Response<User>): Promise<void> => {
      const user: User = await this.userService.create(req.body);
      res.json(user);
    },
  ];

  public patchUser = [
    validator.params(recordIdSchema),
    validator.body(userDraftSchema),
    async (
      req: Request<{ id: string }, User, Partial<UserCreationAttributes>>,
      res: Response<User | undefined>,
    ): Promise<void> => {
      const user = await this.userService.findByPk(req.params.id);
      if (user) {
        user.set({ ...req.body });
        const updatedUser: User = await user.save();
        res.json(updatedUser);
      } else {
        res.status(StatusCodes.NOT_FOUND).end();
      }
    },
  ];

  public softDelete = [
    validator.params(recordIdSchema),
    async (req: Request<{ id: string }>, res: Response): Promise<void> => {
      const user = await this.userService.findByPk(req.params.id);
      if (user) {
        await this.userService.delete(req.params.id);
        res.status(StatusCodes.OK).end();
      } else {
        res.status(StatusCodes.NOT_FOUND).end();
      }
    },
  ];

  constructor(private userService: CrudService<User>) {}
}
