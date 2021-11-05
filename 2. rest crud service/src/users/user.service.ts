import { Op } from 'sequelize';
import { User } from './users.model';

export class UserService {
  constructor(private UserModel: typeof User) {}

  public getAll(loginSubstring?: string, limit?: number): Promise<User[]> {
    if (loginSubstring) {
      return this.getAutoSuggestedUsers(loginSubstring, limit);
    }
    return this.UserModel.findAll({ limit });
  }

  public getAutoSuggestedUsers(loginSubstring?: string, limit?: number): Promise<User[]> {
    return this.UserModel.findAll({
      where: {
        login: { [Op.iLike]: `%${loginSubstring}%` },
      },
      limit,
    });
  }
}
