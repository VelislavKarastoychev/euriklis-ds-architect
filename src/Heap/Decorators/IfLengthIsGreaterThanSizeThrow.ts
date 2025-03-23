"use strict";

import type { PrimaryHeap } from "..";

export function ifLengthIsGreaterThanSizeThrow(
  error: Function,
): (_: any, __: string, descriptor: PropertyDescriptor) => void {
  return function (_: any, __: string, descriptor: PropertyDescriptor): void {
    const method = descriptor.value;

    descriptor.value = function (data: any) {
      if (
        data && ((this as PrimaryHeap).length >= (this as PrimaryHeap).size)
      ) error();
      return method.call(this as PrimaryHeap, data);
    };
  };
}
