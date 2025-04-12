"use strict";

export function ifSourceOrTargetNodeNotExistThrow(
  errorFn: (source: string) => never,
): (
  _: unknown,
  __: string,
  descriptor: PropertyDescriptor,
) => PropertyDescriptor | void {
  return function (
    _: unknown,
    __: string,
    descriptor: PropertyDescriptor,
  ): void {
    const method = descriptor.value;
    descriptor.value = function ({
      source,
      target,
      data,
      weight,
    }: {
      source: string;
      target: string;
      data: unknown;
      weight: number;
    }): void {
      if (!this.hasNode(source)) errorFn(source);
      if (!this.hasNode(target)) errorFn(target);

      return method.call(this, { source, target, data, weight });
    };
  };
}
