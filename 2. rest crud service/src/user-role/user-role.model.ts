import { DataTypes, Model } from 'sequelize';
import { orm } from '../orm';

class UserRole extends Model {
  public user_id: string;
  public role_id: string;
}

UserRole.init(
  {
    user_id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    role_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
  },
  {
    sequelize: orm.sequelize,
    modelName: 'User_Roles',
    timestamps: true,
    createdAt: false,
    updatedAt: false,
  },
);

export { UserRole };
