"use strict";

import type { Integer } from "../../../Types";

type T = NonNullable<any>;
const ShiftDown = (
  data: T[],
  i: Integer,
  comparison: string,
  chooseMIndex: string,
  n: Integer,
  callback: (a: T, b: T, i: Integer, j: Integer, heap: T[]) => 1 | -1 | 0,
): void =>
  Function(
    "heap",
    "i",
    "n",
    "callback",
    `
    const shiftDownRecursion = (heap, i) => { 
      const left = (i << 1) + 1;
      const right = (i + 1) << 1;
      if (left >= n) return;
      let m = right;
      if (m >= n) m = left;
      else if (${chooseMIndex} < 0) m = left;
      if (${comparison} > 0) {
        [heap[m], heap[i]] = [heap[i], heap[m]];
      }
      
      return shiftDownRecursion(heap, m, n);
      
    }
    return shiftDownRecursion(heap, i, n);
    `,
  )(data, i, n, callback);

const PrimaryShiftDownIterator = (
  data: T[],
  chooseMIndex: string,
  comparison: string,
  n: Integer,
  m: Integer,
  callback: (a: T, b: T, i: Integer, j: Integer, data: T[]) => 1 | -1 | 0,
): void => {
  if (m < 0) return;
  ShiftDown(data, m, comparison, chooseMIndex, n, callback);
  return PrimaryShiftDownIterator(
    data,
    chooseMIndex,
    comparison,
    n,
    m - 1,
    callback,
  );
};

export const PrimaryShiftDownHeapify = (
  data: T[],
  callback: (a: T, b: T, i: Integer, j: Integer, heap: T[]) => 1 | -1 | 0,
) => {
  const n = data.length;
  const m = (n - 2) >> 1;
  if (n < 2) return;
  const chooseMIndex = "callback(heap[right], heap[left], right, left, heap)";
  const comparison = "callback(heap[m], heap[i], m, i, heap)";
  return PrimaryShiftDownIterator(
    data,
    chooseMIndex,
    comparison,
    n,
    m,
    callback,
  );
};
