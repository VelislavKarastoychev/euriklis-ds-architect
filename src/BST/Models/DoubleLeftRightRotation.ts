"use strict";

import type { BST } from "..";
import type { BSTDataNode } from "../../DataNode";

export const DoubleLeftRightRotation = <
  T extends any,
  AbstractBSTDataNode extends BSTDataNode<T>,
>(
  a: BSTDataNode,
  tree: BST<T>,
): void => {
  const b = a.left as AbstractBSTDataNode;
  const c = b.right as AbstractBSTDataNode;
  if (a.prev) {
    if (a === a.prev.left) a.prev.left = c;
    else a.prev.right = c;
  } else (tree.rootNode as AbstractBSTDataNode) = c;

  (c.prev as any) = a.prev || null;
  a.prev = c;
  b.prev = c;

  b.right = c.left;
  if (c.left) c.left.prev = b;
  a.left = c.right;
  if (c.right) (c.right.prev as any) = a;
  c.left = b;
  (c.right as any) = a;
};
