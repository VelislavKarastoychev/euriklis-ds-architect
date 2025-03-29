"use strict";
import type { Integer, NodeType } from "../../Types";

export function ifIsNotIntegerOrArrayOfNodeTypesThrow(
  error: Function,
): (_: any, __: string, descriptor: PropertyDescriptor) => void {
  return function (_: any, __: string, descriptor: PropertyDescriptor): void {
    const method: (nodes: NodeType[] | Integer) => {} = descriptor.value;
    descriptor.value = function (nodes: NodeType[] | Integer) {
      // if (!IsInteger(nodes) && !IsArrayOfNodeTypes(nodes)) error();

      return method.call(this, nodes);
    };
  };
}
