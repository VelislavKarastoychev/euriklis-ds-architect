"use strict";

import type { PrimaryHeap } from "..";

export function ifLengthIsGreaterThanSizeThrow<T = unknown>(
  error: () => never,
): (_: any, __: string, descriptor: PropertyDescriptor) => void {
  return function (_: any, __: string, descriptor: PropertyDescriptor): void {
    const method = descriptor.value;

    descriptor.value = function (data: T) {
      if (
        typeof data !== "undefined" &&
        (this as PrimaryHeap<T>).length >= (this as PrimaryHeap<T>).size
      ) {
        error();
      }
      return method.call(this as PrimaryHeap<T>, data);
    };
  };
}
