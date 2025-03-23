"use strict";

import type { Graph } from "..";
import type { GraphDataEdge, GraphDataNode } from "../DataNode";

export function ifValuesTypeIsNotNumericMatrixThrow(
  error: Function,
): (_: any, __: string, descriptor: PropertyDescriptor) => void {
  return function <V extends GraphDataNode, E extends GraphDataEdge>(
    _: any,
    __: string,
    descriptor: PropertyDescriptor,
  ) {
    const method: (...args: any[]) => Graph<V, E> = descriptor.value;
    descriptor.value = function (...args: any[]) {
      if ((this as Graph<V, E>).valuesType !== "NumericMatrix") error();

      return method.call(this, ...args);
    };
  };
}
