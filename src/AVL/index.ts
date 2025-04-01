"use strict";

import { BST } from "../BST";
import { AVLDataNode, BSTDataNode } from "../DataNode";
import { BinarySearch, DeleteNodeInBST, InsertNodeInBST } from "../BST/Models";
import * as models from "./Models";
import type { BSTNodeValueComparisonCallbackType, Integer } from "../../Types";

/**
 * AVLTree class extends the Binary Search Tree (BST) class and implements
 * the self-balancing AVL Tree functionality.
 *
 * AVL Trees maintain the property that the difference in heights between
 * the left and right subtrees of any node is at most one, ensuring
 * logarithmic time complexity for insertion, deletion, and lookup operations.
 *
 * @extends {BST<T>}
 */
export class AVLTree<T> extends BST<T> {
  /**
   * Creates an instance of AVLTree.
   *
   * @constructor
   * @param {T} [data] - Initial data to be added to the tree.
   */
  constructor(data?: T) {
    super(data);
  }

  /**
   * Gets the data of the root node of the AVL tree.
   *
   * @override
   * @returns {T | null} The data of the root node,
   * or null if the tree is empty.
   */
  override get root(): T | null {
    return this._root?.data || null;
  }

  /**
   * Sets the root node of the AVL tree with the given data.
   *
   * @override
   * @param {T} data - The data to set as the root of the
   * tree. If data is provided, it creates a new AVLDataNode with this data.
   */
  override set root(data: T) {
    if (data) this._root = new AVLDataNode<T>(data);
  }

  /**
   * Inserts a new node with the given data into the AVL tree.
   * If the data contains an `id`, it uses that `id` to identify the node.
   * This method overrides the `insert` method in the `BST` class.
   *
   * @override
   * @param {T} data - The data to be inserted into the tree. If the
   * data contains an `id`, it will be used.
   * @param {string} [id] - The optional identifier for the node.
   * If not provided, the `id` from the data will be used if available.
   * @returns  The current instance of the AVL tree.
   */
  override insert(data: T, id?: string) {
    if (data?.id) id = data.id;
    const n = new AVLDataNode<T>(data);
    const node = InsertNodeInBST(this, n, id);
    // set the balance factors recursively for the all nodes of the tree.
    if (node) models.SetBalanceFactorsBackward(node, this);

    return this;
  }

  /**
   * Deletes a node with the specified value from the AVL tree.
   * This method overrides the `delete` method in the `BST` class.
   *
   * @override
   * @param {T} value - The value of the node to be deleted.
   * @param {BSTNodeValueComparisonCallbackType} [callback=this.search] - A
   * callback function used to compare node values.
   * @returns {T | null} The data of the deleted node, or null if the node was not found.
   */
  delete(
    value: T,
    callback: BSTNodeValueComparisonCallbackType = this.search,
  ): T | null {
    const node = BinarySearch(this._root, value, callback);
    if (!node) return null;
    const predecessor = DeleteNodeInBST(node, this) as AVLDataNode | null;
    models.SetBalanceFactorsForward(predecessor, this);

    return node.data;
  }

  /**
   * Deletes a node from the AVL tree based on the specified callback function.
   * This method overrides the `deleteNode` method in the `BST` class.
   *
   * @override
   * @param {(node: AVLDataNode<T>, tree?: AVLTree<T>) => -1 | 0 | 1} callback - A
   * callback function used to locate the node to be deleted.
   * The function should return `-1` if the current node is less than the target node,
   * `1` if it is greater, or `0` if it is the target node.
   * @returns {AVLDataNode<T> | null} The deleted node, or null if no node was found.
   */
  override deleteNode(
    callback: (node: AVLDataNode<T>, tree?: AVLTree<T>) => -1 | 0 | 1,
  ): AVLDataNode<T> | null {
    const node = this.binarySearchNode(callback) as AVLDataNode<T> | null;
    if (!node) return null;
    const predecessor = DeleteNodeInBST(node, this) as AVLDataNode | null;
    models.SetBalanceFactorsAfterDeletion(predecessor, this);
    node.prev = null;
    node.left = null;
    node.right = null;
    node.balance = 0;

    return node;
  }

  /**
   * Creates a copy of the AVL tree.
   * This method overrides the `copy` method in the `BST` class.
   *
   * @override
   * @returns {this} A new instance of AVLTree that is a copy of the current tree.
   */
  copy(): this {
    // const tree = new AVLTree<T>();
    // this.BFS((node) => {
    //   const copiedNode = new AVLDataNode<T>(node.data as T);
    //   copiedNode.id = node.id;
    //   const insertedNode = InsertNodeInBST(tree, copiedNode, undefined);
    //   if (insertedNode) models.SetBalanceFactorsBackward<T>(insertedNode, this);
    // });
    // return tree;
    const Ctor = this.constructor as {
      new (...args: any[]): AVLTree<T>;
    };

    // 2) Construct a new BST<T>, then assert it back to `this`
    const newTree = new Ctor() as this;
    // const newTree = new AVLTree<T>();
    // Copy parent properties if needed:
    newTree.order = this.order;
    newTree.search = this.search;
    newTree.unique = this.unique;

    // Re‐insert all nodes in BFS order.
    this.BFS((node) => {
      newTree.insert(node.data as T, node.id);
    });
    return newTree;
  }

  /**
   * Prints the AVL tree starting from the given node.
   * This method overrides the `print` method in the `BST` class.
   *
   * @override
   * @param {AVLDataNode | null} [node=this._root] - The node to
   * start printing from. Defaults to the root node.
   * @param {Integer} [level=0] - The current level in the tree (used for indentation).
   * @param {string} [prefix="Root: "] - The prefix string to print before the node's data.
   * @param {(node: AVLDataNode, tree?: AVLTree) => any} [callback=(node) => node.data] - A
   * callback function to customize the output of each node.
   * @returns {void}
   */
  print(
    node: BSTDataNode | null = this._root as BSTDataNode<T>,
    level: Integer = 0,
    prefix: string = "Root: ",
    callback: (node: AVLDataNode, tree?: AVLTree<T>) => any = (node) =>
      node.data,
  ): void {
    if (node === null) {
      return;
    }
    console.log(
      " ".repeat(level * 2) +
        prefix +
        callback(node as AVLDataNode<T>, this) +
        ` [BF = ${(node as AVLDataNode<T>).balance}]`,
    );

    if (node.left) {
      this.print(node.left as AVLDataNode, level + 1, "L--> ", callback);
    }

    if (node.right) {
      this.print(node.right as AVLDataNode, level + 1, "R--> ", callback);
    }
  }
}
