"use strict";

import type { DynamicStack, Graph as Graph } from "../..";
import type { TraverseCallback } from "../../../Types";
import type { GraphDataEdge, GraphDataNode } from "../../DataNode";

export const DFS = <V extends GraphDataNode, E extends GraphDataEdge>(
  g: Graph<V, E>,
  callback: TraverseCallback<V, E>,
  S: DynamicStack<string>,
  direction: "outputs" | "inputs",
  visited: Set<string> = new Set(),
): void => {
  if (S.isEmpty) return;
  const id = S.pop() as string;
  const node = g.getNodeById(id) as GraphDataNode;
  const neigbours = node[direction];
  for (const [name, edge] of neigbours) {
    // avoid cycles.
    if (!visited.has(name)) {
      visited.add(name);
      S.push(name);
      callback(g.getNodeById(name) as GraphDataNode, edge, g, node);
      DFS(g, callback, S, direction, visited);
    }
  }
};
