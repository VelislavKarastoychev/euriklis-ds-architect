"use strict";
import type { Integer } from "../../../Types";
import type { GraphDataNode } from "../../DataNode";

export const ComputeGraphSize = (G: Map<string, GraphDataNode>): Integer => {
  let size = 0;
  for (const [_, u] of G) {
    size += u.outputs.size;
  }

  return size;
};
