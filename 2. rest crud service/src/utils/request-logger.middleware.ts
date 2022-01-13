import { NextFunction, Request, Response } from 'express';

export function requestLoggerMiddleware(req: Request, res: Response, next: NextFunction): void {
  const { method, url, headers, body, params } = req;

  console.log(`${method} ${url}
    Headers: ${JSON.stringify(headers)}
    Body: ${JSON.stringify(body)}
    Params: ${JSON.stringify(params)}
  `);
  next();
}
