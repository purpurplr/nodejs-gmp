import { v4 as uuid } from 'uuid';

export interface User {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
}

export type UserDraft = Omit<User, 'id' | 'isDeleted'>;

// just a mock for now
class UsersModel {
  private userList: User[] = [];

  constructor() {
    const MOCK_SIZE = 40;
    for (let i = 0; i < MOCK_SIZE; i += 1) {
      this.userList.push({
        id: uuid(),
        age: i,
        isDeleted: false,
        password: String(i),
        login: String(i),
      });
    }
  }

  public getAll(): User[] {
    return this.userList;
  }

  public getSuggested(limit?: number, loginSubstring?: string): User[] {
    let result = this.userList.sort((prev: User, curr: User) => prev.login.localeCompare(curr.login));
    if (loginSubstring) {
      result = result.filter(({ login }) => {
        return login.toLowerCase().includes(loginSubstring.toLowerCase());
      });
    }
    if (limit) {
      result = result.slice(0, limit);
    }
    return result;
  }

  public getById(id: string): User | undefined {
    return this.userList.find((user) => user.id === id);
  }

  public create(userDraft: UserDraft): User {
    const newUser: User = { ...userDraft, id: uuid(), isDeleted: false };
    this.userList = [...this.userList, newUser];
    return newUser;
  }

  public edit(updateId: string, updates: Partial<UserDraft>): User {
    const user = this.userList.find(({ id }) => id === updateId) as User;
    Object.assign(user, updates);
    return user;
  }

  public softDelete(deleteId: string): User {
    const user = this.userList.find(({ id }) => id === deleteId) as User;
    user.isDeleted = true;
    return user;
  }
}

export const usersModel = new UsersModel();
