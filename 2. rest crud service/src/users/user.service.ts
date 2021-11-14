import { Op } from 'sequelize';
import { User, UserCreationAttributes } from './users.model';
import { CrudService } from '../interfaces/crud-service';

export class UserService implements CrudService<User> {
  constructor(private UserModel: typeof User) {}

  public getAll(loginSubstring?: string, limit?: number): Promise<User[]> {
    if (loginSubstring) {
      return this.getAutoSuggested(loginSubstring, limit);
    }
    return this.UserModel.findAll({ limit });
  }

  public findByPk(pk: string): Promise<User | null> {
    return this.UserModel.findByPk(pk);
  }

  public create(user: UserCreationAttributes): Promise<User> {
    return this.UserModel.create(user);
  }

  public patch(user: User, patchValue: Partial<UserCreationAttributes>): Promise<User> {
    user.set(patchValue);
    return user.save();
  }

  public delete(id: string): Promise<number> {
    return this.UserModel.destroy({
      where: { id },
    });
  }

  private getAutoSuggested(loginSubstring?: string, limit?: number): Promise<User[]> {
    return this.UserModel.findAll({
      where: {
        login: { [Op.iLike]: `%${loginSubstring}%` },
      },
      limit,
    });
  }
}
