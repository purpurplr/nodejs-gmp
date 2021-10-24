import { createValidator } from 'express-joi-validation';
import { StatusCodes } from 'http-status-codes';

export const validator = createValidator({ statusCode: StatusCodes.BAD_REQUEST });
