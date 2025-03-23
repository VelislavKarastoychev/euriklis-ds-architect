"use strict";

import type { GraphEdgeType, GraphNodeType, GraphType } from "../../../Types";

export const AssignWeightsToUnit = (G: GraphType) => {
  for (const [s, u] of G) {
    if (!u.inputs) continue;
    for (const [t, v] of u.inputs) {
      v.attributes.weight = 1;
      const targetNode = G.get(t) as GraphNodeType;
      (targetNode.outputs.get(s) as GraphEdgeType).attributes.weight = 1;
    }
  }
};
