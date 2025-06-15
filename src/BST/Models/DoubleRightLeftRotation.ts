"use strict";

import type { BST } from "..";
import type { BSTDataNode } from "../../DataNode";

export const DoubleRightLeftRotation = <
  T extends any,
  AbstractBSTDataNode extends BSTDataNode,
>(
  a: AbstractBSTDataNode,
  tree: BST<T>,
): void => {
  const b = a.right as AbstractBSTDataNode;
  const c = b.left as AbstractBSTDataNode;
  if (a.prev) {
    if (a === a.prev.left) a.prev.left = c;
    else a.prev.right = c;
  } else (tree.rootNode as any) = c;

  c.prev = a.prev || null;
  a.prev = c;
  b.prev = c;

  b.left = c.right;
  if (c.right) c.right.prev = b;
  a.right = c.left;
  if (c.left) c.left.prev = a;
  c.right = b;
  c.left = a;
};
