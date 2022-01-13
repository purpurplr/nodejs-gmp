import { ErrorRequestHandler, RequestHandler } from 'express';

export interface Type<T> extends Function {
  new (...args: any[]): T;
  name: string;
}

export type ClassDecorator<T> = (target: Type<T>) => void;

export type MethodDecorator<T> = (
  target: Function,
  propertyKey: string,
  descriptor: PropertyDescriptor,
  parentConstructor?: Type<T>,
) => void;

export type PropertyDecorator<T> = (target: Type<T> | T, propertyKey: string) => void;

export type MiddlewareFactory<T> = (
  parentConstructor: Type<T>,
  propertyKey: string,
) => ErrorRequestHandler | RequestHandler;
