import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { Type } from '../interfaces/utility-types';

export function errorLoggerFactory<T>(parentConstructor: Type<T>, propertyKey: string): ErrorRequestHandler {
  return (error: Error | undefined, req: Request, res: Response, next: NextFunction) => {
    if (error) {
      console.error(
        `Error in class ${parentConstructor.constructor.name}! Method: ${String(propertyKey)}; Arguments.; Error: ${
          error.message
        }, ${JSON.stringify(error)}`,
      );
    }
    next(error);
  };
}
