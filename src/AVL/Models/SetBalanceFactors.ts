"use strict";

import type { AVLTree } from "..";
import type { AVLDataNode } from "../../DataNode";

export const SetBalanceFactorsForward = <T>(
  node: AVLDataNode | null,
  tree: AVLTree<T>,
): void => {
  if (!node) return;
  node.balance =
    tree.height(node.right as AVLDataNode<T>) -
    tree.height(node.left as AVLDataNode<T>);
  SetBalanceFactorsForward(node.left, tree);
  SetBalanceFactorsForward(node.right, tree);
};

export const SetBalanceFactorsAfterDeletion = <T>(
  node: AVLDataNode | null,
  tree: AVLTree<T>,
): void => {
  if (!node) return;
  SetBalanceFactorsForward(node, tree);
  UpdateNodeBalance(node, tree);
  return SetBalanceFactorsAfterDeletion(node.prev, tree);
};

export const UpdateNodeBalance = <T>(
  node: AVLDataNode<T>,
  tree: AVLTree<T>,
) => {
  if (node.balance === -2) {
    if ((node.left as AVLDataNode<T>)?.balance < 0) {
      tree.singleRightRotation(node);
      SetBalanceFactorsForward<T>(node, tree);
    } else if ((node.left as AVLDataNode<T>)?.balance > 0) {
      tree.doubleLeftRightRotation(node);
      SetBalanceFactorsForward<T>(node, tree);
    }
  } else if (node.balance === 2) {
    if ((node.right as AVLDataNode<T>)?.balance > 0) {
      tree.singleLeftRotation(node);
      SetBalanceFactorsForward<T>(node, tree);
    }
    if ((node.right as AVLDataNode<T>)?.balance < 0) {
      tree.doubleRightLeftRotation(node);
      SetBalanceFactorsForward<T>(node, tree);
    }
  }
};

export const SetBalanceFactorsBackward = <T>(
  node: AVLDataNode<T>,
  tree: AVLTree<T>,
  rebalancing: boolean = true,
): void => {
  if (node.prev) {
    if (node === node.prev.left) node.prev.balance -= 1;
    else node.prev.balance += 1;
    node = node.prev as AVLDataNode<T>;
    if (!node.balance) return;
    if (rebalancing) UpdateNodeBalance(node, tree);

    return SetBalanceFactorsBackward<T>(node, tree);
  }
};
