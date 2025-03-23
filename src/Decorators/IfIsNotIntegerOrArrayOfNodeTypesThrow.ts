"use strict";
import type { Integer, NodeType } from "../../Types";
import type { Graph } from "../Graph2";
import { IsArrayOfNodeTypes, IsInteger } from "../Graph2/Conditions";

export function ifIsNotIntegerOrArrayOfNodeTypesThrow(
  error: Function,
): (_: any, __: string, descriptor: PropertyDescriptor) => void {
  return function (_: any, __: string, descriptor: PropertyDescriptor): void {
    const method: (nodes: NodeType[] | Integer) => Graph = descriptor.value;
    descriptor.value = function (nodes: NodeType[] | Integer) {
      if (!IsInteger(nodes) && !IsArrayOfNodeTypes(nodes)) error();

      return method.call(this, nodes);
    };
  };
}
