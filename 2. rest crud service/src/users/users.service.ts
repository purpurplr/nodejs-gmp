import { Op } from 'sequelize';
import { User } from './users.model';
import { CrudService } from '../interfaces/crud-service';
import { UserDraftDTO } from './users.interfaces';
import { LogCalls } from '../decorators/call-logger.decorator';
import { DecorateMethodsWith } from '../decorators/decorate-methods-with.decorator';

@DecorateMethodsWith([LogCalls])
export class UsersService implements CrudService<User, UserDraftDTO> {
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

  public create(user: UserDraftDTO): Promise<User> {
    return this.UserModel.create(user);
  }

  public async patch(pk: string, patchValue: Partial<UserDraftDTO>): Promise<User | -1> {
    const user = await this.findByPk(pk);
    if (!user) return -1;
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
