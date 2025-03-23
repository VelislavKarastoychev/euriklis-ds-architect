"use strict";

import type { HeapType, Integer } from "../../../Types";
import type { HeapDataNode } from "../../DataNode";

const PrimaryHeapSearchIterator = (
  heap: HeapDataNode[],
  id: string,
  index: Integer,
  stopCondition: string,
  found: HeapDataNode[]
) => Function(
    "heap",
    "id",
    "index",
    `
    const PrimaryHeapSearchRecursion = (heap, id, index) => {
      const node = heap[index];
      if (!node) return;
      if (node.id === id) found.push(node);
      if (${stopCondition}) return;
      else PrimaryHeapSearchRecursion(heap, id, index << 1 + 1);
      PrimaryHeapSearchRecursion(heap, id, index + 1)
    }
    `
  )(heap, id, index);

export const PrimaryHeapSearch = (
  heap: HeapDataNode[],
  id: string,
  type: HeapType,
) => {
  const found: HeapDataNode[] = [];
  const stopCondition = type === "max" ? `node.id < id`: `heap[index].id > id`;
  return PrimaryHeapSearchIterator(heap, id, 0, stopCondition, found);
};
