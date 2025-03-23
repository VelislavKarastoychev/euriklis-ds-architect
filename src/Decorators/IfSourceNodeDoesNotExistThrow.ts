"use strict";

import type { EdgeType } from "../../Types";
import type { Graph } from "../Graph";

export function ifSourceNodeDoesNotExistThrow(
  error: Function,
): (_: any, __: string, descriptor: PropertyDescriptor) => void {
  return function (_: any, __: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    descriptor.value = function (options: EdgeType) {
      const { source } = options;
      if (!(this as Graph).hasNode(source)) error();

      return method.call(this, options);
    };
  };
}
