"use strict";

import type { BST } from "..";
import type { BSTDataNode } from "../../DataNode";

/**
 * Performs single right rotation of an AVL
 * tree.
 *
 * @param a - The node which has to be rotated.
 * @returns{void}
 */
export const SingleRightRotation = <
  T extends any,
  AbstractBSTDataNode extends BSTDataNode,
>(
  a: AbstractBSTDataNode,
  tree: BST<T>,
): void => {
  const b = a.left as AbstractBSTDataNode;
  if (a.prev) {
    if (a === a.prev.left) a.prev.left = b;
    else a.prev.right = b;
  } else tree.rootNode = b;

  b.prev = a.prev;
  a.prev = b;
  if (b.right) b.right.prev = a;
  a.left = b.right;
  b.right = a;
};
