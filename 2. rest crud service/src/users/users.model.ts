import { DataTypes, Model } from 'sequelize';
import { orm } from '../orm';
import { UserDraftDTO, UserDTO } from './user.interfaces';

class User extends Model<UserDTO, UserDraftDTO> implements UserDTO {
  public id: string;
  public login: string;
  public password: string;
  public age: number;
  public deletedAt: Date;
}

User.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false, unique: true },
    login: { type: DataTypes.STRING(20), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(50), allowNull: false },
    age: { type: DataTypes.SMALLINT, allowNull: false },
    deletedAt: { type: DataTypes.DATE },
  },
  {
    sequelize: orm.sequelize,
    modelName: 'User',
    timestamps: true,
    createdAt: false,
    updatedAt: false,
    paranoid: true,
  },
);

export { User };
