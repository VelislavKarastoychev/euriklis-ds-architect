"use strict";
import * as errors from "../../Errors";

import type { EdgeType } from "../../../Types";
import { GraphDataEdge, type GraphDataNode } from "../../DataNode";

export const SetGraphEdges = (
  edges: EdgeType[],
  G: Map<string, GraphDataNode>,
): void => {
  for (const edge of edges) {
    let { id, source, target, attributes } = edge;
    const sourceNode = G.get(source);
    const targetNode = G.get(target);
    if (sourceNode && targetNode) {
      if (!id) id = "";
      const edge = new GraphDataEdge({ id, source, target, attributes });
      (sourceNode as GraphDataNode).addOutgoingEdge(edge);
      (targetNode as GraphDataNode).addIncomingEdge(edge);
    }
  }
};
