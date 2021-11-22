import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { suggestedUsersSchema, userDraftSchema } from './users.schemas';
import { recordIdSchema } from '../shared/shared.schemas';
import { validator } from '../validator';
import { CrudService } from '../interfaces/crud-service';
import { UserDraftDTO, UserDTO } from './users.interfaces';

export class UsersController {
  public getUsers = [
    validator.query(suggestedUsersSchema),
    async (req: Request<{}, {}, {}, { limit?: number; login?: string }>, res: Response<UserDTO[]>): Promise<void> => {
      const { limit, login } = req.query;
      const result: UserDTO[] = await this.userService.getAll(login, limit);
      res.json(result);
    },
  ];

  public getUserById = [
    validator.params(recordIdSchema),
    async (req: Request<{ id: string }>, res: Response<UserDTO | undefined>): Promise<void> => {
      const user: UserDTO | null = await this.userService.findByPk(req.params.id);
      if (user) {
        res.json(user);
      } else {
        res.status(StatusCodes.NOT_FOUND).end();
      }
    },
  ];

  public createUser = [
    validator.body(userDraftSchema.options({ presence: 'required' })),
    async (req: Request<{}, UserDTO, UserDraftDTO>, res: Response<UserDTO>): Promise<void> => {
      const user: UserDTO = await this.userService.create(req.body);
      res.json(user);
    },
  ];

  public patchUser = [
    validator.params(recordIdSchema),
    validator.body(userDraftSchema),
    async (
      req: Request<{ id: string }, UserDTO, Partial<UserDraftDTO>>,
      res: Response<UserDTO | undefined>,
    ): Promise<void> => {
      const updatedUser: UserDTO | -1 = await this.userService.patch(req.params.id, req.body);
      if (updatedUser !== -1) {
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

  constructor(private userService: CrudService<UserDTO, UserDraftDTO>) {}
}
