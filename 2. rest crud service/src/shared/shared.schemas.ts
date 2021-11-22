import Joi from 'joi';

export const recordIdSchema = Joi.object({ id: Joi.string().uuid().required() });
