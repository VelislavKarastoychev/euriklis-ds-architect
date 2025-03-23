"use strict";

import { AVLTree } from "../../AVL";
import type { LinkedDataNode } from "../../DataNode";

export const MapInsertion = (
  Node: LinkedDataNode,
  map: null | Map<string, LinkedDataNode> | AVLTree,
): void => {
  if (map instanceof Map) map.set(Node.id, Node);
  if (map instanceof AVLTree) map.insert(Node, Node.id);
};

export const MapDeletion = (
  id: string,
  map: null | Map<string, LinkedDataNode> | AVLTree,
): void => {
  if (map) map.delete(id);
};

export const MapHas = (
  id: string,
  map: Map<string, LinkedDataNode> | AVLTree,
) => {
  if (map) return map.has(id);
  else return false;
};
