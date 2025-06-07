"use strict";

import type { HeapType, Integer } from "../../../Types";
import type { HeapDataNode } from "../../DataNode";

export const PrimaryHeapSearch = <T = unknown>(
  heap: HeapDataNode<T>[],
  id: string,
  type: HeapType,
): HeapDataNode<T>[] | null => {
  const found: HeapDataNode<T>[] = [];
  const search = (index: Integer): void => {
    if (index >= heap.length) return;
    const node = heap[index];
    if (node.id === id) found.push(node);
    if (type === "max" ? node.id < id : node.id > id) return;
    search((index << 1) + 1);
    search((index << 1) + 2);
  };
  search(0);
  return found.length ? found : null;
};
