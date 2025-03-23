"use strict";

import type { NodeType } from "../../Types";
import type { Graph } from "../Graph";

export function ifNodeNotExistsThrow(
  error: Function,
): (_: any, __: string, descriptor: PropertyDescriptor) => void {
  return function (_: any, __: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    descriptor.value = function (node: NodeType) {
      const { name } = node;
      if (!(this as Graph).hasNode(name)) error();

      return method.call(this, node);
    };
  };
}
