import { Request, Response } from 'express';
import winston from 'winston';

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [new winston.transports.File({ dirname: 'logs', filename: 'error.log', level: 'error' })],
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function defaultErrorHandler(err: any, req: Request, res: Response): void {
  if (err.message) logger.error(err.message, [req]);

  if (err.statusCode) res.statusCode = err.statusCode;
  if (err.status) res.statusCode = err.status;
  if (res.statusCode < 400) res.statusCode = 500;

  const error = { message: 'Internal server error' };
  res.json({ error });
}
