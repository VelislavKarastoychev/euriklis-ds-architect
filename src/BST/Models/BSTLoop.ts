"use strict";

import type { BST } from "..";
import type { BSTDataNode } from "../../DataNode";
import type { Queue } from "../../Queue";

export const BSTLoop = <T extends any, AbstractBSTDataNode extends BSTDataNode>(
  callback: (node: AbstractBSTDataNode, bst: BST<T>) => boolean,
  queue: Queue,
  tree: BST<T>,
): void => {
  if (queue.isEmpty) return;
  const node: AbstractBSTDataNode = queue.dequeue();
  if (!callback(node, tree)) return;
  if (node.right) queue.enqueue(node.right);
  if (node.left) queue.enqueue(node.left);
  return BSTLoop(callback, queue, tree);
};
