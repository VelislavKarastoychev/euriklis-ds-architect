"use strict";

export function ifNodeExistsThrow(
  errorFn: (name: string) => never,
): (
  target: unknown,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
) => PropertyDescriptor | void {
  return function (
    _: unknown,
    __: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor | void {
    const method = descriptor.value;
    descriptor.value = function ({
      name,
      data,
      value,
    }: {
      name: string;
      data: unknown;
      value?: number;
    }): void {
      if (this.hasNode(name)) errorFn(name);

      return method.call(this, { name, data, value });
    };
  };
}
