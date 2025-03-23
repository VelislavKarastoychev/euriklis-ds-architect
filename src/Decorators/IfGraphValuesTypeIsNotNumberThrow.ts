"use strict";

import type { Graph } from "..";
import type { GraphDataEdge, GraphDataNode } from "../DataNode";

export function ifGraphValuesTypeIsNotNumberThrow(
  error: Function,
): (_: any, __: string, descriptor: PropertyDescriptor) => void {
  return function <V extends GraphDataNode, E extends GraphDataEdge>(
    _: any,
    __: string,
    descriptor: PropertyDescriptor,
  ) {
    const method: (...args: any[]) => Graph<V, E> = descriptor.value;
    descriptor.value = function (...args: any[]): Graph<V, E> {
      if ((this as Graph<V, E>).valuesType !== "Numeric") error();

      return method.call(this, ...args);
    };
  };
}
