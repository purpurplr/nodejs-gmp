import { Optional } from 'sequelize';

export const permissionNames = ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES'];
export type Permission = typeof permissionNames[number];

export interface RoleDTO {
  id: string;
  name: string;
  permissions: Permission[];
}

export type RoleDraftDTO = Optional<RoleDTO, 'id'>;
