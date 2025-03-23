"use strict";

import validator from "@euriklis/validator-ts";

export function ifIsNotArrayThrow(
  error: Function,
): (_: any, __: string, descriptor: PropertyDescriptor) => void {
  return function (_: any, __: string, descriptor: PropertyDescriptor) {
    const method: (items: any[]) => void = descriptor.value;
    descriptor.value = function (items: any[]) {
      if (new validator(items).not.isArray.answer) error();
      return method.call(this, items);
    };
  };
}
