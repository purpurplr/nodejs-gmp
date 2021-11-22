import { CrudService } from '../interfaces/crud-service';
import { RoleDraftDTO, RoleDTO } from './roles.interfaces';
import { Role } from './roles.model';
import { UserRole } from '../user-role/user-role.model';
import { M2NService } from '../interfaces/m2n-service';

export class RolesService implements CrudService<RoleDTO, RoleDraftDTO>, M2NService {
  constructor(private RolesModel: typeof Role, private UserRolesModel: typeof UserRole) {}

  public getAll(): Promise<Role[]> {
    return this.RolesModel.findAll();
  }

  public findByPk(pk: string): Promise<Role | null> {
    return this.RolesModel.findByPk(pk);
  }

  public create(user: RoleDraftDTO): Promise<Role> {
    return this.RolesModel.create(user);
  }

  public async patch(pk: string, patchValue: Partial<RoleDraftDTO>): Promise<Role | -1> {
    const user = await this.findByPk(pk);
    if (!user) return -1;
    user.set(patchValue);
    return user.save();
  }

  public delete(id: string): Promise<number> {
    return this.RolesModel.destroy({
      where: { id },
    });
  }

  public async assignRoleToUsers(roleId: string, userIds: string[]): Promise<void> {
    const connections = userIds.map((userId: string) => ({ user_id: userId, role_id: roleId }));
    await this.UserRolesModel.bulkCreate(connections);
  }
}
