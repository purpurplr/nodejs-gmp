import { Router } from 'express';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { Role } from './roles.model';

const rolesService = new RolesService(Role);
const rolesController = new RolesController(rolesService);

const rolesRouter = Router();

rolesRouter.route('/').get(rolesController.getUsers).post(rolesController.createUser);

rolesRouter
  .get('/:id', rolesController.getUserById)
  .patch('/:id', rolesController.patchUser)
  .delete('/:id', rolesController.hardDelete);

export default rolesRouter;
