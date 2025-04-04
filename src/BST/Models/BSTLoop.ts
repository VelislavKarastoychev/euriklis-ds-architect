"use strict";

import type { BST } from "..";
import type { BSTDataNode } from "../../DataNode";
import type { Queue } from "../../Queue";

export const BSTLoop = <T extends any, AbstractBSTDataNode extends BSTDataNode>(
  callback: (node: AbstractBSTDataNode, bst: BST<T>) => boolean,
  queue: Queue<AbstractBSTDataNode | null>,
  tree: BST<T>,
): void => {
  if (queue.isEmpty) return;
  const node: AbstractBSTDataNode | null = queue.dequeue();
  if (!callback(node as AbstractBSTDataNode, tree)) return;
  if ((node as AbstractBSTDataNode).right)
    queue.enqueue((node as AbstractBSTDataNode).right);
  if ((node as AbstractBSTDataNode).left)
    queue.enqueue((node as AbstractBSTDataNode).left);
  return BSTLoop(callback, queue, tree);
};
