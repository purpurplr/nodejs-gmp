import { Router } from 'express';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { Role } from './roles.model';
import { UserRole } from '../user-role/user-role.model';

const rolesService = new RolesService(Role, UserRole);
const rolesController = new RolesController(rolesService);

const rolesRouter = Router();

rolesRouter.route('/').get(rolesController.getRoles).post(rolesController.createRole);

rolesRouter
  .route('/:id')
  .get(rolesController.getRoleById)
  .patch(rolesController.patchRole)
  .delete(rolesController.hardDelete);

rolesRouter.route('/:id/assign').post(rolesController.assignRoleToUsers);

export default rolesRouter;
