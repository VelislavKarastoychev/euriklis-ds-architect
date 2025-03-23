"use strict";

import { Graph, Queue } from "../..";
import type { TraverseCallback } from "../../../Types";
import type { GraphDataEdge, GraphDataNode } from "../../DataNode";

export const BFS = <V extends GraphDataNode, E extends GraphDataEdge>(
  g: Graph<V, E>,
  callback: TraverseCallback<V, E>,
  Q: Queue,
  direction: "outputs" | "inputs",
  visited: Set<string> = new Set(),
) => {
  if (Q.isEmpty) return;
  const id = Q.dequeue();
  const node = g.getNodeById(id) as GraphDataNode;
  const neigbourhood = node[direction];
  for (const [arcName, edge] of neigbourhood) {
    // avoid cycles.
    if (!visited.has(arcName)) {
      Q.enqueue(arcName);
      callback(g.getNodeById(arcName) as GraphDataNode, edge, g, node);
    }
  }
  visited.add(id);

  BFS(g, callback, Q, direction, visited);
};
