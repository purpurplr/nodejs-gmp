import { DataTypes, Model, Optional } from 'sequelize';
import { orm } from '../orm';

export interface UserAttributes {
  id: string;
  login: string;
  password: string;
  age: number;
  deletedAt: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'deletedAt'> {}

class User extends Model<UserAttributes, UserCreationAttributes> {}
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
