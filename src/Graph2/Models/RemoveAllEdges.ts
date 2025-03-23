"use strict";

import type { GraphDataNode } from "../../DataNode";

export const RemoveAllEdges = (G: Map<string, GraphDataNode>): void => {
  for (const [_, node] of G) node.removeAllEdges();
};
