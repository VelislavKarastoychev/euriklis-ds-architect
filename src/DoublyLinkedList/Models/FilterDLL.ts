"use strict";

import type { DoublyLinkedList } from "..";
import type { LinkedDataNode } from "../../DataNode";

export const FilterDLL = <T = undefined>(
  node: LinkedDataNode<T> | null,
  callback: (d: any, id?: string, list?: DoublyLinkedList<T>) => boolean,
  l1: DoublyLinkedList<T>,
  l2: DoublyLinkedList<T>,
  inversed: boolean,
): void => {
  if (!node) return;
  const { data, id } = node;
  if (callback(data, id, l1)) l2.addLast(data as T, id);
  node = inversed ? node.prev : node.next;

  return FilterDLL(node, callback, l1, l2, inversed);
};
