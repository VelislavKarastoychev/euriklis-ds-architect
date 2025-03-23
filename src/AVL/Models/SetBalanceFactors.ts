"use strict";

import type { AVLTree } from "..";
import type { AVLDataNode } from "../../DataNode";

export const SetBalanceFactorsForward = (
  node: AVLDataNode | null,
  tree: AVLTree,
): void => {
  if (!node) return;
  node.balance = tree.height(node.right) - tree.height(node.left);
  SetBalanceFactorsForward(node.left, tree);
  SetBalanceFactorsForward(node.right, tree);
};

export const SetBalanceFactorsAfterDeletion = (
  node: AVLDataNode | null,
  tree: AVLTree,
): void => {
  if (!node) return;
  SetBalanceFactorsForward(node, tree);
  UpdateNodeBalance(node, tree);
  return SetBalanceFactorsAfterDeletion(node.prev, tree);
};

export const UpdateNodeBalance = (node: AVLDataNode, tree: AVLTree) => {
  if (node.balance === -2) {
    if (((node.left as AVLDataNode)?.balance) < 0) {
      tree.singleRightRotation(node);
      SetBalanceFactorsForward(node, tree);
    } else if (((node.left as AVLDataNode)?.balance) > 0) {
      tree.doubleLeftRightRotation(node);
      SetBalanceFactorsForward(node, tree);
    }
  } else if (node.balance === 2) {
    if (((node.right as AVLDataNode)?.balance) > 0) {
      tree.singleLeftRotation(node);
      SetBalanceFactorsForward(node, tree);
    }
    if (((node.right as AVLDataNode)?.balance) < 0) {
      tree.doubleRightLeftRotation(node);
      SetBalanceFactorsForward(node, tree);
    }
  }
};

export const SetBalanceFactorsBackward = (
  node: AVLDataNode,
  tree: AVLTree,
  rebalancing: boolean = true,
): void => {
  if (node.prev) {
    if (node === node.prev.left) node.prev.balance -= 1;
    else node.prev.balance += 1;
    node = node.prev as AVLDataNode;
    if (!node.balance) return;
    if (rebalancing) UpdateNodeBalance(node, tree);

    return SetBalanceFactorsBackward(node, tree);
  }
};
