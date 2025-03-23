"use strict";

import type { Graph } from "..";
import type { GraphNodeType, GraphType } from "../../../Types";
import type { Queue } from "../../Queue";

export const ForwardBFS = (
  G: GraphType,
  callback: (node: GraphNodeType, g: Graph) => void,
  Q: Queue,
  GraphInstance: Graph,
) => {
  if (Q.isEmpty) return;
  const node: GraphNodeType | undefined = G.get(Q.dequeue());
  for (const [t, u] of G) {
    if (!node) return;
  }
};
