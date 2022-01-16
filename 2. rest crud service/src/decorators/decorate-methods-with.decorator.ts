import { ClassDecorator, MethodDecorator, Type } from '../interfaces/utility-types';

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
