import { Type } from '../interfaces/utility-types';

export function LogCalls<T>(
  target: Function,
  propertyKey: string,
  descriptor: PropertyDescriptor,
  parentConstructor?: Type<T>,
): void {
  if (!parentConstructor) return;

  function newValue(this: T, ...args: unknown[]): unknown {
    console.log(`Class: ${parentConstructor!.name}; Method: ${propertyKey}; Arguments: ${JSON.stringify(args)}.`);
    return target.apply(this, args);
  }
  Object.defineProperty(parentConstructor.prototype, propertyKey, {
    ...descriptor,
    value: newValue,
  });
}
