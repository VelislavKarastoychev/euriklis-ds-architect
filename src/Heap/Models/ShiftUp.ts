"use strict";

import type { Integer } from "../../../Types";
import type { HeapDataNode } from "../../DataNode";

export const PrimaryShiftUp = (
  heap: HeapDataNode[],
  i: Integer,
  type: "max" | "min",
): void => {
  while (i > 0) {
    const parent = (i - 1) >> 1;
    const shouldSwap =
      type === "max"
        ? heap[i].id > heap[parent].id
        : heap[i].id < heap[parent].id;
    if (!shouldSwap) break;
    [heap[i], heap[parent]] = [heap[parent], heap[i]];
    i = parent;
  }
};
