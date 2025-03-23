"use strict";

import type { NodeType } from "../../../Types";
import type { GraphDataNode } from "../../DataNode";

export const GetGraphNodes = (G: Map<string, GraphDataNode>): NodeType[] => {
  const nodes: NodeType[] = [];
  for (const [name, node] of G) {
    nodes.push({ name, attributes: node.data });
  }

  return nodes;
};
