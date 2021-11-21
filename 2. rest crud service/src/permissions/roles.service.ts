import { CrudService } from '../interfaces/crud-service';
import { RoleDraftDTO, RoleDTO } from './roles.interfaces';
import { Role } from './roles.model';

export class RolesService implements CrudService<RoleDTO, RoleDraftDTO> {
  constructor(private PermissionGroupModel: typeof Role) {}

  public getAll(): Promise<Role[]> {
    return this.PermissionGroupModel.findAll();
  }

  public findByPk(pk: string): Promise<Role | null> {
    return this.PermissionGroupModel.findByPk(pk);
  }

  public create(user: RoleDraftDTO): Promise<Role> {
    return this.PermissionGroupModel.create(user);
  }

  public async patch(pk: string, patchValue: Partial<RoleDraftDTO>): Promise<Role | -1> {
    const user = await this.findByPk(pk);
    if (!user) return -1;
    user.set(patchValue);
    return user.save();
  }

  public delete(id: string): Promise<number> {
    return this.PermissionGroupModel.destroy({
      where: { id },
    });
  }
}
