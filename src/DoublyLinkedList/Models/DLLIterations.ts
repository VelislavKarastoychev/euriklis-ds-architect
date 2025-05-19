"use strict";

import type { DoublyLinkedList } from "..";
import type { LinkedDataNode } from "../../DataNode";

export const DLLTraverse = <T>(
  callback: (d: any, id: string, list: DoublyLinkedList<T>) => void,
  node: LinkedDataNode<T> | null,
  list: DoublyLinkedList<T>,
  inversed: boolean,
): void => {
  if (!node) return;
  callback(node.data, node.id, list);
  node = inversed ? node.prev : node.next;

  return DLLTraverse(callback, node, list, inversed);
};

export const DLLLoop = <T>(
  callback: (data: T | null, id: string, list: DoublyLinkedList<T>) => boolean,
  node: LinkedDataNode<T> | null,
  list: DoublyLinkedList<T>,
  inversed: boolean,
): void => {
  if (!node) return;
  if (!callback(node.data, node.id, list)) return;
  node = inversed ? node.prev : node.next;

  return DLLLoop(callback, node, list, inversed);
};
