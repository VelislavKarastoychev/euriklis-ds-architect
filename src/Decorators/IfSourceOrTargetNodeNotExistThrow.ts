"use strict";

import type { Graph } from "../../";
import type { EdgeType } from "../../Types";
import type { GraphDataEdge, GraphDataNode } from "../DataNode";

export function ifSourceOrTargetNodeNotExistThrow(
  error: Function,
): (_: any, __: string, descriptor: PropertyDescriptor) => void {
  return function <V extends GraphDataNode, E extends GraphDataEdge>(
    _: any,
    __: string,
    descriptor: PropertyDescriptor,
  ) {
    const method: (edge: EdgeType) => Graph<V, E> = descriptor.value;
    descriptor.value = function (edge: EdgeType): Graph<V, E> {
      if (!(this as Graph<V, E>).hasNode(edge.source)) error();
      if (!(this as Graph<V, E>).hasNode(edge.target)) error();
      return method.call(this, edge);
    };
  };
}
