import { Optional } from 'sequelize';

export interface UserDTO {
  id: string;
  login: string;
  password: string;
  age: number;
  deletedAt: Date;
}

export type UserDraftDTO = Optional<UserDTO, 'id' | 'deletedAt'>;
