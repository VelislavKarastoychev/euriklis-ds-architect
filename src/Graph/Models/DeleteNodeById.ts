"use strict";

import type { GraphType } from "../../../Types";

export const DeleteNodeById = (G: GraphType, name: string): void => {
  const hasNode = G.has(name);
  if (hasNode) {
    G.delete(name);
    for (const [_, node] of G) {
      if (node.inputs.has(name)) node.inputs.delete(name);
      if (node.outputs.has(name)) node.outputs.delete(name);
    }
  } 
};
