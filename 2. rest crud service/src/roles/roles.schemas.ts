import Joi from 'joi';
import { RoleDraftDTO, permissionNames } from './roles.interfaces';

export const roleDraftSchema = Joi.object<RoleDraftDTO>({
  name: Joi.string().min(4).max(20),
  permissions: Joi.array().items(Joi.string().valid(...permissionNames)),
});

export const assigningUserIdsSchema = Joi.object({
  userIds: Joi.array().min(1).items(Joi.string().uuid()),
});
