"use strict";

import type {
  GraphEdgeType,
  GraphNodeType,
  GraphType,
  UpdatableEdgeType,
} from "../../../Types";

export const UpdateEdge = (G: GraphType, edge: UpdatableEdgeType) => {
  const { source, target, attributes } = edge;
  const sourceNode = G.get(source) as GraphNodeType;
  const edgeObject = sourceNode.outputs.get(target) as GraphEdgeType;
  Object.assign(edgeObject.attributes, attributes);
};
