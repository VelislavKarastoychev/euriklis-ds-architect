"use strict";

import type { Integer } from "../../../Types";
import type { HeapDataNode } from "../../DataNode";

const shiftDown = (
  heap: HeapDataNode[],
  index: Integer,
  size: Integer,
  type: "max" | "min",
): void => {
  while (true) {
    const left = (index << 1) + 1;
    const right = left + 1;
    let target = index;
    if (
      left < size &&
      (type === "max"
        ? heap[left].id > heap[target].id
        : heap[left].id < heap[target].id)
    ) {
      target = left;
    }
    if (
      right < size &&
      (type === "max"
        ? heap[right].id > heap[target].id
        : heap[right].id < heap[target].id)
    ) {
      target = right;
    }
    if (target === index) break;
    [heap[index], heap[target]] = [heap[target], heap[index]];
    index = target;
  }
};

export const PrimaryShiftDownHeapify = (
  data: HeapDataNode[],
  type: "max" | "min",
): void => {
  for (let i = (data.length - 2) >> 1; i >= 0; i--) {
    shiftDown(data, i, data.length, type);
  }
};
