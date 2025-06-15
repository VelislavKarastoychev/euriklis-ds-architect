"use strict";

import type { BST } from "..";
import type { BSTDataNode } from "../../DataNode";

export const ShiftNodes = <
  T extends unknown,
  AbstractBSTDataNode extends BSTDataNode<T>,
>(
  tree: BST<T>,
  u: AbstractBSTDataNode,
  v: AbstractBSTDataNode | null,
) => {
  if (!u?.prev) (tree.root as AbstractBSTDataNode | null) = v;
  else if (u === u.prev.left) u.prev.left = v;
  else u.prev.right = v;
  if (v) v.prev = u.prev;
};
