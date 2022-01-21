import { ErrorRequestHandler, NextFunction, RequestHandler } from 'express';

export function skipMiddleware(mockMiddleware: RequestHandler | ErrorRequestHandler): void {
  jest.mocked(mockMiddleware).mockImplementation((...args) => {
    const next: NextFunction = args[args.length - 1];
    next();
  });
}
