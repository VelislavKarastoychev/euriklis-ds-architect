"use strict";

import type { DoublyLinkedList } from "..";
import type { Integer } from "../../../Types";

export const FillDLLWithRandomNumbers = (
  l: DoublyLinkedList,
  n: Integer,
  from: number,
  to: number,
  seed: number,
  callback?: (d: number, id: string, list: DoublyLinkedList) => any,
) => {
  let j: Integer, k: number, d: number;
  for (j = n; j-- > 1;) {
    seed <<= 0;
    k = (seed / 127773) >> 0;
    seed = (16807 * (seed - k * 127773) - k * 2836) >> 0;
    if (seed < 0) seed += 2147483647;
    d = from + (to - from) * seed * 4.656612875e-10;
    if (callback) l.addLast(callback(d, `${n - j - 1}`, l));
    else l.addLast(from + (to - from) * seed * 4.656612875e-10, `${n - j - 1}`);
    j--, seed <<= 0;
    k = (seed / 127773) >> 0;
    seed = (16807 * (seed - k * 127773) - k * 2836) >> 0;
    if (seed < 0) seed += 2147483647;
    d = from + (to - from) * seed * 4.656612875e-10;
    if (callback) l.addLast(callback(d, `${n - j - 1}`, l));
    else l.addLast(from + (to - from) * seed * 4.656612875e-10, `${n - j - 1}`);
  }
  if (j === 0) {
    seed <<= 0;
    k = (seed / 127773) >> 0;
    seed = (16807 * (seed - k * 127773) - k * 2836) >> 0;
    if (seed < 0) seed += 2147483647;
    d = from + (to - from) * seed * 4.656612875e-10;
    if (callback) l.addLast(callback(d, `${n - 1}`, l));
    else l.addLast(from + (to - from) * seed * 4.656612875e-10, `${n - 1}`);
  }
};
