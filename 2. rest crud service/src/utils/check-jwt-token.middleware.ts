import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { VerifyErrors } from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

export function checkJwtToken(req: Request, res: Response, next: NextFunction): void {
  if (!secret) throw new Error('Missing JWT secret');

  const token = req.headers.authorization;

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Missing JWT' });
  } else {
    jwt.verify(token, secret, (error: VerifyErrors | null): void => {
      if (!error) next();
      else res.status(StatusCodes.FORBIDDEN).json({ error: error.message });
    });
  }
}
