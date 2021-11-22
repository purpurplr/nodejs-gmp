import { DataTypes, Model } from 'sequelize';
import { orm } from '../orm';
import { Permission, RoleDraftDTO, RoleDTO } from './roles.interfaces';

class Role extends Model<RoleDraftDTO, RoleDraftDTO> implements RoleDTO {
  public id: string;
  public name: string;
  public permissions: Permission[];
}

Role.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false, unique: true },
    name: { type: DataTypes.STRING(20), allowNull: false, unique: false },
    permissions: { type: DataTypes.ARRAY(DataTypes.TEXT), allowNull: false },
  },
  {
    sequelize: orm.sequelize,
    modelName: 'Roles',
    timestamps: true,
    createdAt: false,
    updatedAt: false,
  },
);

export { Role };
