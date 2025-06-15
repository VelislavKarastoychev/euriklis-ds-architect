"use strict";

import type { BST } from "..";
import type { BSTDataNode } from "../../DataNode";
import { ShiftNodes } from "./ShiftNodes";

export const DeleteNodeInBST = <
  T extends any,
  AbstractBSTDataNode extends BSTDataNode<T>,
>(
  node: AbstractBSTDataNode | null,
  tree: BST<T>,
) => {
  if (!node) return null;
  if (!node.left) ShiftNodes(tree, node, node?.right);
  else if (!node.right) ShiftNodes(tree, node, node?.left || null);
  else {
    const successor = tree.successorNode(
      node as BSTDataNode<T>,
    ) as AbstractBSTDataNode;
    if (successor.prev !== node) {
      ShiftNodes(tree, successor, successor.right as AbstractBSTDataNode);
      successor.right = node?.right || null;
      (successor.right as AbstractBSTDataNode).prev = successor;
    }
    ShiftNodes(tree, node, successor);
    if (!node.prev) (tree.rootNode as AbstractBSTDataNode) = successor;
    if (node === node.prev?.left) node.prev.left = successor;
    if (node === node.prev?.right) node.prev.right = successor;
    successor.left = node.left;
    (successor.left as AbstractBSTDataNode).prev = successor;
  }

  return node.prev;
};
