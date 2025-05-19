"use strict";

import { AVLTree } from "../../AVL";
import type { LinkedDataNode } from "../../DataNode";

export const FindNodeFromMap = <T>(
  id: string,
  map: Map<string, LinkedDataNode<T>> | AVLTree<LinkedDataNode<T>>,
): LinkedDataNode<T> | null => {
  if (map instanceof Map) return map.get(id) || null;
  else if (map instanceof AVLTree)
    return map.binarySearch(id) as LinkedDataNode<T>;
  return null;
};

export const FindNodeFromDLL = <T>(
  id: string,
  node: LinkedDataNode<T> | null,
): LinkedDataNode<T> | null => {
  if (!node) return null;
  if (node.id === id) return node;
  node = node.next;
  return FindNodeFromDLL<T>(id, node);
};
