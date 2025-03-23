"use strict";

import type { EdgeType } from "../../Types";
import type { GraphDataEdge, GraphDataNode } from "../DataNode";
import { Graph } from "../Graph2";
// import { Graph } from "../Graph";

export function ifEdgeExistsThrow(
  error: Function,
): (_: any, __: string, descriptor: PropertyDescriptor) => void {
  return function <V extends GraphDataNode, E extends GraphDataEdge>(
    _: any,
    __: string,
    descriptor: PropertyDescriptor,
  ) {
    const method = descriptor.value;
    descriptor.value = function (options: EdgeType) {
      const { source, target } = options;
      if (this instanceof Graph) {
        if ((this as Graph<V, E>).hasEdge({ source, target })) error();
      }

      // if (this instanceof Graph) {
      //   if ((this as Graph<V, E>).hasEdge({ source, target })) error();
      // }

      return method.call(this, options);
    };
  };
}
