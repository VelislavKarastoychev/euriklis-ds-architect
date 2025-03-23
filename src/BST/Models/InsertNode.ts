"use strict";

import type { BST } from "..";
import type { BSTNodeComparisonCallbackType } from "../../../Types";
import { BSTDataNode } from "../../DataNode";
const searchForLeaf = <AbstractBSTDataNode extends BSTDataNode>(
  n1: AbstractBSTDataNode | null,
  n2: AbstractBSTDataNode | null,
  orderCallback: BSTNodeComparisonCallbackType,
  prev: AbstractBSTDataNode | null = null,
): AbstractBSTDataNode | null => {
  if (n1) {
    prev = n1;
    if (
      orderCallback(n2 as AbstractBSTDataNode, n1 as AbstractBSTDataNode) < 0
    ) n1 = n1.left as AbstractBSTDataNode | null;
    else n1 = n1.right as AbstractBSTDataNode | null;
    return searchForLeaf(n1, n2, orderCallback, prev);
  } else return prev;
};

/**
 * Inserts a new node with the given data into the Binary Search Tree (BST).
 * If the BST's `unique` property is set to true and a node with the same ID exists,
 * the existing node will be replaced with the new node.
 * @param tree The BST instance where the node should be inserted.
 * @param data The data to be stored in the new node.
 * @param id Optional. The ID for the new node. If not provided, `data.id` will be used if available.
 * @returns The newly inserted BSTDataNode.
 */
export const InsertNodeInBST = <
  T extends any,
  AbstractBSTDataNode extends BSTDataNode,
>(
  tree: BST<T>,
  node: AbstractBSTDataNode,
  id?: string,
): AbstractBSTDataNode | null => {
  const orderCallback = tree.order;
  let root: AbstractBSTDataNode | null = tree.rootNode as AbstractBSTDataNode,
    y: AbstractBSTDataNode | null;
  if (id) node.id = id;
  y = searchForLeaf(root, node, orderCallback) as AbstractBSTDataNode | null;
  node.prev = y;
  if (!y) tree.rootNode = node as AbstractBSTDataNode;
  else {
    const comparison = orderCallback(node, y);
    if (comparison < 0) y.left = node;
    else if (comparison === 0) {
      if (tree.unique) {
        y.data = (node as AbstractBSTDataNode).data;
        return null;
      } else y.right = node;
    } else y.right = node;
  }

  return node;
};
