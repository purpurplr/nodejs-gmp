import Joi from 'joi';
import { passwordRegEx } from '../shared/regex';

export const authSchema = Joi.object({
  login: Joi.string().min(4).max(20),
  password: Joi.string().regex(passwordRegEx).max(50),
});
