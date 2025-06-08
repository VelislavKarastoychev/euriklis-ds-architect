"use strict";

import type { HeapType, Integer } from "../../../Types";
import type { HeapDataNode } from "../../DataNode";

export const PrimaryHeapSearchIndex = <T = unknown>(
  heap: HeapDataNode<T>[],
  id: string,
  type: HeapType,
): Integer => {
  let found: Integer = -1;
  const search = (index: Integer): void => {
    if (index >= heap.length) return;
    const node = heap[index];
    if (node.id === id) {
      found = index;
      return;
    }
    if (type === "max" ? node.id < id : node.id > id) return;
    search((index << 1) + 1);
    search((index << 1) + 2);
  };
  search(0);
  return found;
};
