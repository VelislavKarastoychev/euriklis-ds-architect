"use strict";

import type { DoublyLinkedList } from "..";
import type { LinkedDataNode } from "../../DataNode";

export const DLLTraverse = (
  callback: (d: any, id: string, list: DoublyLinkedList) => void,
  node: LinkedDataNode | null,
  list: DoublyLinkedList,
  inversed: boolean,
): void => {
  if (!node) return;
  callback(node.data, node.id, list);
  node = inversed ? node.prev : node.next;
  
  return DLLTraverse(callback, node, list, inversed);
};

export const DLLLoop = (
  callback: (
    data: any,
    id: string,
    list: DoublyLinkedList,
  ) => boolean,
  node: LinkedDataNode | null,
  list: DoublyLinkedList,
  inversed: boolean,
): void => {
  if (!node) return;
  if (!callback(node.data, node.id, list)) return;
  node = inversed ? node.prev : node.next;

  return DLLLoop(callback, node, list, inversed);
};
