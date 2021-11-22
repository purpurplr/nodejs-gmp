import Joi from 'joi';
import { passwordRegEx } from '../shared/regex';

export interface User {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
}

export type UserDraft = Omit<User, 'id' | 'isDeleted'>;

const MIN_AGE = 4;
const MAX_AGE = 130;
export const userDraftSchema = Joi.object({
  login: Joi.string(),
  password: Joi.string().regex(passwordRegEx),
  age: Joi.number().min(MIN_AGE).max(MAX_AGE),
}).min(1);

export const suggestedUsersSchema = Joi.object({
  limit: Joi.number().positive(),
  login: Joi.string().alphanum(),
});
