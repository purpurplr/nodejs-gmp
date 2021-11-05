import Joi from 'joi';
import { passwordRegEx } from '../shared/regex';

export const userDraftSchema = Joi.object({
  login: Joi.string().min(4).max(20),
  password: Joi.string().regex(passwordRegEx).max(50),
  age: Joi.number().min(4).max(130),
}).min(1);

export const suggestedUsersSchema = Joi.object({
  limit: Joi.number().positive(),
  login: Joi.string().alphanum(),
});
