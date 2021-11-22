import { Router } from 'express';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { Role } from './roles.model';
import { UserRole } from '../user-role/user-role.model';

const rolesService = new RolesService(Role, UserRole);
const rolesController = new RolesController(rolesService);

const rolesRouter = Router();

rolesRouter.route('/').get(rolesController.getUsers).post(rolesController.createUser);

rolesRouter
  .route('/:id')
  .get(rolesController.getUserById)
  .patch(rolesController.patchUser)
  .delete(rolesController.hardDelete);

rolesRouter.route('/:id/assign').post(rolesController.assignRoleToUsers);

export default rolesRouter;
