import { UserCreationAttributes } from '../users/users.model';

export interface CrudService<T> {
  getAll: (login?: string, limit?: number) => Promise<T[]>;
  findByPk: (id: string) => Promise<T | null>;
  create: (user: UserCreationAttributes) => Promise<T>;
  patch: (user: T, patchValue: Partial<UserCreationAttributes>) => Promise<T>;
  delete: (id: string) => Promise<number>;
}
