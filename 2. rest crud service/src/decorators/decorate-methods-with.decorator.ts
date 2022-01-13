import { ErrorRequestHandler, RequestHandler } from 'express';
import {
  ClassDecorator,
  MethodDecorator,
  MiddlewareFactory,
  PropertyDecorator,
  Type,
} from '../interfaces/utility-types';

export function DecorateMethodsWith<T>(decorators: MethodDecorator<T>[]): ClassDecorator<T> {
  return (target: Type<T>): void => {
    const descriptors = Object.getOwnPropertyDescriptors(target.prototype);
    Object.entries(descriptors)
      .filter(([key, descriptor]) => key !== 'constructor' && typeof descriptor.value === 'function')
      .forEach(([key, descriptor]) =>
        decorators.forEach((decorate) => decorate(descriptor.value, key, descriptor, target)),
      );
  };
}

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
