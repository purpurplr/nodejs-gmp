import { ErrorRequestHandler, RequestHandler } from 'express';
import { MiddlewareFactory, PropertyDecorator, Type } from '../interfaces/utility-types';

export function AppendMiddlewareWith<T>(middlewareFactories: MiddlewareFactory<T>[]): PropertyDecorator<T> {
  return (target: Type<T> | T, propertyKey: string) => {
    const middlewares = middlewareFactories.map((middleware) => middleware(target as Type<T>, propertyKey));
    let value: (RequestHandler | ErrorRequestHandler)[];

    function getter(): (RequestHandler | ErrorRequestHandler)[] {
      return value;
    }
    function setter(newValue: (RequestHandler | ErrorRequestHandler)[]): void {
      value = [...newValue, ...middlewares];
    }

    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
    });
  };
}
