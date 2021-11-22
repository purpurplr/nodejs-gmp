import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { recordIdSchema } from '../shared/shared.schemas';
import { validator } from '../validator';
import { CrudService } from '../interfaces/crud-service';
import { RoleDraftDTO, RoleDTO } from './roles.interfaces';
import { assigningUserIdsSchema, roleDraftSchema } from './roles.schemas';
import { M2NService } from '../interfaces/m2n-service';

export class RolesController {
  public getUsers = [
    async (req: Request, res: Response<RoleDTO[]>): Promise<void> => {
      const result: RoleDTO[] = await this.rolesService.getAll();
      res.json(result);
    },
  ];

  public getUserById = [
    validator.params(recordIdSchema),
    async (req: Request<{ id: string }>, res: Response<RoleDTO | undefined>): Promise<void> => {
      const user: RoleDTO | null = await this.rolesService.findByPk(req.params.id);
      if (user) {
        res.json(user);
      } else {
        res.status(StatusCodes.NOT_FOUND).end();
      }
    },
  ];

  public createUser = [
    validator.body(roleDraftSchema.options({ presence: 'required' })),
    async (req: Request<{}, RoleDTO, RoleDraftDTO>, res: Response<RoleDTO>): Promise<void> => {
      const user: RoleDTO = await this.rolesService.create(req.body);
      res.json(user);
    },
  ];

  public patchUser = [
    validator.params(recordIdSchema),
    validator.body(roleDraftSchema),
    async (
      req: Request<{ id: string }, RoleDTO, Partial<RoleDraftDTO>>,
      res: Response<RoleDTO | undefined>,
    ): Promise<void> => {
      const updatedUser: RoleDTO | -1 = await this.rolesService.patch(req.params.id, req.body);
      if (updatedUser !== -1) {
        res.json(updatedUser);
      } else {
        res.status(StatusCodes.NOT_FOUND).end();
      }
    },
  ];

  public hardDelete = [
    validator.params(recordIdSchema),
    async (req: Request<{ id: string }>, res: Response): Promise<void> => {
      const user = await this.rolesService.findByPk(req.params.id);
      if (user) {
        await this.rolesService.delete(req.params.id);
        res.status(StatusCodes.OK).end();
      } else {
        res.status(StatusCodes.NOT_FOUND).end();
      }
    },
  ];

  public assignRoleToUsers = [
    validator.params(recordIdSchema),
    validator.body(assigningUserIdsSchema),
    async (req: Request<{ id: string }, void, { userIds: string[] }>, res: Response): Promise<void> => {
      const { id: roleId } = req.params;
      const { userIds } = req.body;
      await this.rolesService.assignRoleToUsers(roleId, userIds);
      res.status(StatusCodes.OK).end();
    },
  ];

  constructor(private rolesService: CrudService<RoleDTO, RoleDraftDTO> & M2NService) {}
}
