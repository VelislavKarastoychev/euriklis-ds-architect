"use strict";

import { AVLTree } from "../../AVL";
import type { LinkedDataNode } from "../../DataNode";

export const MapInsertion = <T = undefined>(
  Node: LinkedDataNode<T>,
  map: null | Map<string, LinkedDataNode<T>> | AVLTree<LinkedDataNode<T>>,
): void => {
  if (map instanceof Map) map.set(Node.id, Node);
  if (map instanceof AVLTree) map.insert(Node, Node.id);
};

export const MapDeletion = <T = unknown>(
  id: string,
  map: null | Map<string, LinkedDataNode> | AVLTree<LinkedDataNode<T>>,
): void => {
  if (map) map.delete(id as any);
};

export const MapHas = <T = unknown>(
  id: string,
  map: Map<string, LinkedDataNode> | AVLTree<LinkedDataNode<T>>,
) => {
  if (map) return map.has(id);
  else return false;
};
