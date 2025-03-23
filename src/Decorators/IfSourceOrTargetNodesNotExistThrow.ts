"use strict";

import type { ComputationGraph } from "../ComputationGraph";

export function ifSourceOrTargetNodesNotExistThrow(error: Function): (_: any, __: string, descriptor: PropertyDescriptor) => void {
  return function(_: any, __: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    descriptor.value = function(edge: { source: string; target: string }) {
      const { source, target } = edge;
      if (
        !(this as ComputationGraph).hasNode(source)
        || !(this as ComputationGraph).hasNode(target)
      ) error();

      return method.call(this, edge);
    };
  };
};
