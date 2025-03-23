"use strict";

import type { EdgeType } from "../../../Types";
import type { GraphDataNode } from "../../DataNode";

export const GetGraphEdges = (G: Map<string, GraphDataNode>): EdgeType[] => {
  const edges: EdgeType[] = [];
  for (const [source, u] of G) {
    for (const [target, v] of u.outputs) {
      edges.push({ source, target, attributes: v.data });
    }
  }
  
  return edges;
};
