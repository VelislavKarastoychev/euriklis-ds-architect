"use strict";
import validator from "@euriklis/validator-ts";
import type { Integer, NodeType } from "../../Types";

export function ifIsNotArrayOfStringsOrNodeTypesThrow(
  error: Function,
): (_: any, __: string, descriptor: PropertyDescriptor) => void {
  return function (_: any, __: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    descriptor.value = function (count: Integer, nodes: string | NodeType[]) {
      const isNotNodeTypedOrStringArray = new validator(nodes).forAny((n) =>
        n.not.isString.and.not.interface({
          name: name => name.isString,
          attributes: (attr) =>
            attr.interface({
              value: (v) =>
                v.isNumber
                  .or.isTypedArray
                  .or.isNumberArray
                  .or.isArrayOfNumberArraysWithEqualSize,
            }),
        })
      ).answer;
      if (isNotNodeTypedOrStringArray) error();
      
      return method.call(this, count, nodes);
    };
  };
}
