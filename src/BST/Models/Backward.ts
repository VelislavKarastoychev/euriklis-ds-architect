"use strict";
import type { BSTDataNode } from "../../DataNode";
export const RightBackward = <AbstractBSTDataNode extends BSTDataNode>(
  x: AbstractBSTDataNode | null,
): AbstractBSTDataNode | null => {
  if (x?.prev && (x === x?.prev?.right)) {
    return RightBackward(x.prev) as AbstractBSTDataNode;
  } else if (!x?.prev && (x?.right)) return null;

  return x;
};

export const LeftBackward = <AbstractBSTDataNode extends BSTDataNode>(
  x: AbstractBSTDataNode | null,
): AbstractBSTDataNode | null => {
  if (x?.prev && (x === x?.prev?.left)) {
    return LeftBackward(x?.prev) as AbstractBSTDataNode;
  } else if (!x?.prev && (x?.left)) return null;

  return x;
};
