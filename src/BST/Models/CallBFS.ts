"use strict";

import type { BST } from "..";
import type { BSTDataNode } from "../../DataNode";
import type { Queue } from "../../Queue";

export const CallBFS = <T extends any, AbstractBSTDataNode extends BSTDataNode>(
  tree: BST<T>,
  Q: Queue<AbstractBSTDataNode | null>,
  callback: (node: AbstractBSTDataNode, tree: BST<T>) => void,
): void => {
  if (Q.isEmpty) return;
  const node: AbstractBSTDataNode | null = Q.dequeue();
  if ((node as AbstractBSTDataNode).left)
    Q.enqueue((node as AbstractBSTDataNode).left);
  if ((node as AbstractBSTDataNode).right)
    Q.enqueue((node as AbstractBSTDataNode).right);
  callback(node as AbstractBSTDataNode, tree);

  return CallBFS(tree, Q, callback);
};
