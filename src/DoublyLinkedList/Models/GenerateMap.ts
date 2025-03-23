"use strict";
import type { SecureStoreType } from "../../../Types";
import { AVLTree } from "../../AVL";

export const GenerateMap = (secureStore: SecureStoreType) => {
  if (secureStore === "Map") {
    return new Map();
  }
  if (secureStore === "AVL") {
    const avl = new AVLTree();
    avl.unique = true;

    return avl;
  } 

  return null;
}
