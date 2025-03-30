"use strict";
import type { SecureStoreType } from "../../../Types";
import { AVLTree } from "../../AVL";
import type { LinkedDataNode } from "../../DataNode";

export const GenerateMap = <T>(
  secureStore: SecureStoreType,
): Map<string, LinkedDataNode<T>> | AVLTree<T> | null => {
  if (secureStore === "Map") {
    return new Map<string, LinkedDataNode<T>>();
  }
  if (secureStore === "AVL") {
    const avl = new AVLTree<T>();
    avl.unique = true;

    return avl;
  }

  return null;
};
