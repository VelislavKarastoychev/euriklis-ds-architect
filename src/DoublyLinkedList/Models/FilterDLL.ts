"use strict";

import type { DoublyLinkedList } from "..";
import type { LinkedDataNode } from "../../DataNode";

export const FilterDLL = (
  node: LinkedDataNode | null,
  callback: (d: any, id?: string, list?: DoublyLinkedList) => boolean,
  l1: DoublyLinkedList,
  l2: DoublyLinkedList,
  inversed: boolean,
): void => {
  if (!node) return;
  const { data, id } = node;
  if (callback(data, id, l1)) l2.addLast(data, id);
  node = inversed ? node.prev : node.next;

  return FilterDLL(node, callback, l1, l2, inversed);
};
