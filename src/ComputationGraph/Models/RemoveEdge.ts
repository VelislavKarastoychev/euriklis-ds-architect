"use strict";

import type { ComputationGraphDataNode } from "../../DataNode";

export const RemoveEdge = (
  G: Map<string, ComputationGraphDataNode>,
  source: string,
  target: string,
): void => {
  G.get(source)?.outputs.delete(target);
  G.get(target)?.inputs.delete(source);
};
