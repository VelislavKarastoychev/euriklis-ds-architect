"use strict";

import { AVLTree } from "../../AVL";
import type { LinkedDataNode } from "../../DataNode";

export const FindNodeFromMap = (
  id: string,
  map: Map<string, LinkedDataNode> | AVLTree,
): LinkedDataNode | null => {
  if (map instanceof Map) return map.get(id) || null;
  else if (map instanceof AVLTree) return map.binarySearch(id);
  return null;
};

export const FindNodeFromDLL = (
  id: string,
  node: LinkedDataNode | null,
): LinkedDataNode | null => {
  if (!node) return null;
  if (node.id === id) return node;
  node = node.next;
  return FindNodeFromDLL(id, node);
};
