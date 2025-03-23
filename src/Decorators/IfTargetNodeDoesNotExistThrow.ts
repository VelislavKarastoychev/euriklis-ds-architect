"use strict";

import type { EdgeType } from "../../Types";
import type { Graph } from "../Graph";

export function ifTargetNodeDoesNotExistThrow(
  error: Function,
): (_: any, __: string, descriptor: PropertyDescriptor) => void {
  return function (_: any, __: string, descriptor: PropertyDescriptor) {
    const method: (options: EdgeType) => Graph = descriptor.value;
    descriptor.value = function (options: EdgeType) {
      const { target } = options;
      if (!(this as Graph).hasNode(target)) error();

      return method.call(this, options); };
  };
}
