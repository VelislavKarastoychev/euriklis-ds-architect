"use strict";
import type { BST } from "..";
import type { BSTNodeValueComparisonCallbackType } from "../../../Types";
import type { BSTDataNode } from "../../DataNode";

export const BinarySearchNode = <
  T extends any,
  AbstractBSTDataNode extends BSTDataNode,
>(
  tree: BST<T>,
  node: AbstractBSTDataNode | null,
  callback: (node: AbstractBSTDataNode, tree?: BST<T>) => -1 | 0 | 1,
): AbstractBSTDataNode | null => {
  if (!node) return null;
  const comparison = callback(node, this);
  if (comparison < 0) {
    return BinarySearchNode(
      tree,
      node.left as AbstractBSTDataNode | null,
      callback,
    );
  }
  if (comparison > 0) {
    return BinarySearchNode(
      tree,
      node.right as AbstractBSTDataNode | null,
      callback,
    );
  }
  return node;
};

export const BinarySearch = <
  T extends any,
  AbstractBSTDataNode extends BSTDataNode,
>(
  node: AbstractBSTDataNode | null,
  value: T,
  callback: BSTNodeValueComparisonCallbackType,
): AbstractBSTDataNode | null => {
  if (node) {
    const comparison = callback(node, value);
    if (comparison < 0) {
      return BinarySearch(node.left, value, callback) as
        | AbstractBSTDataNode
        | null;
    } else if (comparison > 0) {
      return BinarySearch(node.right, value, callback) as
        | AbstractBSTDataNode
        | null;
    } else return node;
  } else return null;
};
