"use strict";

import type { Integer } from "../../../Types";
import type { ComputationGraphDataNode } from "../../DataNode";

export const RemoveNodes = (
  G: Map<string, ComputationGraphDataNode>,
  ids: string[],
) => {
  let i: Integer, id: string, id2: string;
  const n = ids.length;
  for (i = n; i-- > 1; ) {
    id = ids[i--];
    id2 = ids[i];
    for (const [name, node] of G) {
      if (id === name) G.delete(id);
      else {
        if (node.outputs.has(id)) {
          node.outputs.delete(id);
        }
        if (node.inputs.has(id)) {
          node.inputs.delete(id);
        }
      }
      if (id2 === name) G.delete(id2);
      else {
        if (node.outputs.has(id2)) {
          node.outputs.delete(id2);
        }
        if (node.inputs.has(id2)) {
          node.inputs.delete(id2);
        }
      }
    }
  }
  if (i === 0) {
    id = ids[0];
    for (const [name, node] of G) {
      if (id === name) G.delete(id);
      else {
        if (node.outputs.has(id)) {
          node.outputs.delete(id);
        }
        if (node.inputs.has(id)) {
          node.inputs.delete(id);
        }
      }
    }
  }
};
