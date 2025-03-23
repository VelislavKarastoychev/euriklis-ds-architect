"use strict";

import type { Integer } from "../../../Types";
import type { HeapDataNode } from "../../DataNode";

/**
 * Iteratively executes the shift up
 * algorithm to a heap using recursion.
 * @param {HeapDataNode[]} heap - the heap container.
 * @param {Integer} i - the index of the starting node.
 * @param {string} swapCondition - a string which codes
 * the swap condition according to the type of the heap.
 */
const PrimaryShiftUpIterator = (
  heap: HeapDataNode[],
  i: Integer,
  swapCondition: string,
) =>
  Function(
    "heap",
    "i",
    `
    function ShiftUpRecursion (heap, i) {
      if (i === 0) return;
      const k = i >> 1;
      if (${swapCondition}) [heap[k], heap[i]] = [heap[i], heap[k]];
      return ShiftUpRecursion(heap, k);
    }
    return ShiftUpRecursion(heap, i);
    `,
  )(heap, i);

/**
 * Implements the shift up algorithm of a binary heap.
 * In order to implement the algorithm in a time efficient
 * way we use the Function object of the JavaScript because
 * we will obtain the different conditions only once..
 * @param {HeapDataNode[]} heap - the heap container.
 * @param {Integer} i - the index of the starting node.
 * @param {"max" | "min"} type - the type of the heap (max heap or min heap).
 */
export const PrimaryShiftUp = (
  heap: HeapDataNode[],
  i: Integer,
  type: "max" | "min",
): void => {
  const swapCondition = type === "max"
    ? `heap[i].id > heap[k].id`
    : `heap[i].id < heap[k].id`;
  return PrimaryShiftUpIterator(heap, i, swapCondition);
};
