"use strict";
import * as models from "./Models";
import type { Integer } from "../../Types";
import type { BSTNodeValueComparisonCallbackType } from "../../Types";
import { BSTDataNode } from "../DataNode";
import { DynamicStack } from "../Stack";
import { Queue } from "../Queue";
import { max } from "../utils";

/**
 * This class implements the concept of Binary Search Trees (BSTs)
 * using the BSTDataNode extension of the DataNode model.
 *
 * The implementation employs a dynamic approach, using linked nodes
 * rather than arrays to store the nodes of the BST, providing flexibility
 * and efficiency in memory usage.
 *
 * Additionally, the class uses recursive algorithms for BST operations,
 * which have been found to be more time-efficient compared to loop-based
 * implementations.
 *
 * The class is designed with a generic type parameter to support specialized
 * data structures such as AVL trees and Red-Black Binary Search Trees, making
 * it versatile and extensible for various use cases.
 */
export class BST<T> {
  /** A callback function which is used
   * for the correct classification of
   * the nodes.
   * It compares two nodes to determine their order in the BST.
   */
  public order = models.CompareNodes;
  /** a callback function which is used to
   * find the position of a node with a
   * given value.
   * It compares a node to a value to
   * determine their relative position in the BST.
   */
  public search: BSTNodeValueComparisonCallbackType =
    models.CompareNodeWithValue;

  /**
   * The root node of the BST.
   * This node serves as the starting
   * point for all BST operations.
   * @type {BSTDataNode<T> | null}
   * @protected
   */
  protected _root: BSTDataNode<T> | null = null;

  /**
   * Indicates whether the BST allows only unique node values.
   * When set to true, inserting a node with an existing ID will replace the existing node.
   * Defaults to false (allowing duplicate IDs).
   */
  protected __unique__: boolean = false;

  /**
   * Creates an instance of the BST class.
   * If data is provided, it sets the root
   * of the BST to a new node containing this data.
   *
   * @param {T} [data] - The initial data to set as
   * the root of the BST.
   * If not provided, the BST is initialized empty.
   */
  constructor(data?: T) {
    if (data) this.root = data;
  }

  /**
   * Gets the data of the root node of the BST.
   *
   * @returns {T} The data of the root node, or null if the BST is empty.
   */
  get root(): T | null {
    return this._root?.data || null;
  }

  /**
   * Sets the root of the BST to a new node
   * containing the provided data.
   * If no data is provided, the root is not changed.
   *
   * @param {T} data - The data to set as the root
   * of the BST. If not provided, the root remains unchanged.
   */
  set root(data: T) {
    if (data) {
      this._root = new BSTDataNode<T>(data);
    }
  }

  /**
   * Gets the root node of the BST.
   *
   * @returns {BSTDataNode<T> | null} The root node
   * of the BST, or null if the BST is empty.
   */
  get rootNode(): BSTDataNode<T> | null {
    return this._root;
  }

  /**
   * Sets the root node of the BST to the provided node.
   *
   * @param {BSTDataNode<T>} node - The node to set as the root of the BST.
   *
   * @remarks
   * Be cautious when using the `rootNode` setter, as directly setting the root node can bypass
   * certain invariants or validations that might be enforced by other methods in the class.
   */
  set rootNode(node: BSTDataNode<T>) {
    this._root = node;
  }

  /**
   * Checks if the BST is empty.
   *
   * @returns {boolean} True if the BST is empty, false otherwise.
   */
  get isEmpty(): boolean {
    return !this._root;
  }

  /**
   * Returns the number of nodes in the BST.
   *
   * @returns {Integer} The size of the BST, i.e., the number of nodes.
   */
  get size(): Integer {
    let s: Integer = 0;
    this.BFS((_: BSTDataNode<T>): number => s++);

    return s;
  }

  /**
   * @returns{boolean} If True no unique records are allowed,
   * otherwise the duplicate records according to the order
   * callback are allowed.
   */
  get unique(): boolean {
    return this.__unique__;
  }

  /**
   * Sets the ability of the BST to contain unique items.
   */
  set unique(isUnique: boolean) {
    this.__unique__ = isUnique;
  }

  /**
   * Retrieves a node by its unique identifier.
   *
   * @param {string} id - The id of the node to search for.
   * @returns {BSTDataNode<T> | null} The found node or null if no node
   * with the provided id exists.
   */
  private getNodeById(id: string): BSTDataNode<T> | null {
    let found: BSTDataNode<T> | null = null;
    this.loop((node) => {
      if (node.id === id) {
        found = node as BSTDataNode<T>;
        return false;
      }

      return true;
    });

    return found;
  }

  /**
   * Calculates the height of the tree from the given node.
   * The height is the number of edges on the longest path from the node to a leaf.
   *
   * @param {BSTDataNode<T> | null} [node=this._root] - The
   * node from which to calculate the height. Defaults to the root node.
   * @returns {Integer} The height of the tree from the given node.
   */
  height(node: BSTDataNode<T> | null = this._root): Integer {
    if (!node) return 0;
    return (
      1 +
      max(
        this.height(node.left as BSTDataNode<T> | null),
        this.height(node.right as BSTDataNode<T> | null),
      )
    );
  }

  /**
   * Cleans the Binary Search Tree by resetting its root node to null
   * and clearing the callback functions used for node comparison and search.
   *
   * @returns {BST<T>} The instance of the BST after cleaning.
   */
  clean(): BST<T> {
    this._root = null;
    this.order = models.CompareNodes;
    this.search = models.CompareNodeWithValue;

    return this;
  }

  /**
   * Creates a deep copy of the Binary Search Tree.
   *
   * @returns {BST<T>} A new instance of BST
   * containing copies of all nodes with the
   * same order and search criteria as the
   * original tree.
   */
  copy(): this {
    // 1) Cast the constructor to a function returning a BST<T>
    const Ctor = this.constructor as {
      new (...args: any[]): BST<T>;
    };

    // 2) Construct a new BST<T>, then assert it back to `this`
    const tree = new Ctor() as this;
    tree.order = this.order;
    tree.search = this.search;
    this.BFS((node) => {
      tree.insert(node?.data as T, node?.id);
    });

    return tree;
  }

  /**
   * Checks if the current Binary Search Tree is
   * identical to another tree (the same data and IDs).
   *
   * @param {BST<T>} tree - The tree to compare with.
   * @returns {boolean} True if both trees have
   * identical structures, node values and IDs, false otherwise.
   */
  isExactlySame(tree: BST<T>): boolean {
    const r1 = this._root,
      r2 = tree._root,
      S1 = new DynamicStack<BSTDataNode<T> | null>(r1),
      S2 = new DynamicStack<BSTDataNode<T> | null>(r2);

    if (!S1.isEmpty && !S2.isEmpty) return models.IsNodeExactlySame(S1, S2);

    return false;
  }

  /**
   * Checks if the current Binary Search Tree is
   * identical to another tree and have the sane data.
   *
   * @param {BST<T>} tree - The tree to compare with.
   * @returns {boolean} True if both trees have
   * identical structures, node values, false otherwise.
   */
  isSame(tree: BST<T>): boolean {
    const r1 = this._root,
      r2 = tree._root,
      S1 = new DynamicStack<BSTDataNode<T> | null>(r1),
      S2 = new DynamicStack<BSTDataNode<T> | null>(r2);

    if (!S1.isEmpty && !S2.isEmpty) return models.IsNodeSame(S1, S2);

    return false;
  }

  /**
   * Checks if node with id property equals to "id"
   * exists in the current BST instance.
   * @param{string} id - The "id" value of the node.
   * @returns {boolean} "true" if node with id property
   * equals to the "id" parameter exists and false otherwise.
   */
  has(id: string): boolean {
    let hasId = false;
    this.loop((node) => ((hasId = node.id !== id), !hasId));

    return hasId;
  }

  /**
   * Traverses the BST using a level-order
   * traversal (BFS) and applies a callback
   * function to each node.
   *
   * @param {(node: BSTDataNode<T>, tree: BST<T>) => boolean} callback - The callback
   * function to apply to each node. The callback receives the current node
   * and the BST as arguments. If the callback returns `false`, the traversal stops.
   */
  loop(callback: (node: BSTDataNode<T>, tree: BST<T>) => boolean): void {
    const queue = new Queue<BSTDataNode<T> | null>(this._root);

    return models.BSTLoop(callback, queue, this);
  }

  /**
   * Inserts a new node with the provided data
   * into the Binary Search Tree.
   * If data is object and contains an 'id' property,
   * it can optionally be used as the node's ID.
   *
   * @param {T} data The data to be inserted into the tree.
   * @param {string} [id] Optional ID for the node. If not
   * provided, 'data.id' will be used if available.
   * @returns {this} The updated Binary Search Tree after insertion.
   */
  insert(data: T, id?: string): this {
    if (typeof data === "object") {
      if ((data as { [prop: string]: unknown })?.id)
        id = (data as { [prop: string]: unknown }).id as string;
    }
    const node = new BSTDataNode<T>(data);
    models.InsertNodeInBST(this, node, id);

    return this;
  }

  /**
   * Inserts multiple nodes into the Binary Search Tree
   * from an array of data.
   * Each element in the array will be inserted as a
   * separate node.
   *
   * @param {T[]} data An array of data elements to
   * be inserted into the tree.
   * @returns {BST<T>} The updated Binary Search Tree
   * after all insertions.
   */
  insertMany(data: T[], ids: string[] = []): BST<T> {
    const n = data.length;
    let i: Integer;
    if (ids.length) {
      if (ids.length !== data.length)
        throw new Error(
          "The ids is declared but the length is not identical to the data length.",
        );
    }
    for (i = 0; i < n - 1; i++) {
      this.insert(data[i], ids[i++]);
      this.insert(data[i], ids[i]);
    }

    if (i === n - 1) this.insert(data[n - 1], ids[n - 1]);

    return this;
  }

  /**
   * Deletes a node with the specified value
   * from the Binary Search Tree.
   *
   * @param {T} value The value to search for
   * and delete from the tree.
   * @param {BSTNodeValueComparisonCallbackType} [callback=this.search] Optional
   * callback function used to compare node values. Defaults to the search callback of the tree.
   * @returns {any | null} The data of the deleted node if found and deleted; otherwise, null.
   */
  delete(
    value: T | string,
    callback: BSTNodeValueComparisonCallbackType = this.search,
  ): T | null {
    let node: BSTDataNode<T> | null = null;

    if (typeof value === "string") {
      node = this.getNodeById(value);
    }

    if (!node) node = models.BinarySearch(this._root, value as T, callback);
    models.DeleteNodeInBST(node, this);
    // It is no needed to delete the node connection
    // because the garbadge collector will delete it.
    return node?.data || null;
  }

  /**
   * Deletes a specific node from the Binary Search Tree
   * using a callback function to find the node.
   *
   * @param {(node: BSTDataNode<T>, tree?: BST<T>) => -1 | 0 | 1} callback - A
   * callback function that returns
   *        -1 if the node should be searched in the left subtree,
   *         0 if the node is found,
   *         1 if the node should be searched in the right subtree.
   * @returns {BSTDataNode<T> | null} The deleted node if found and deleted; otherwise, null.
   */
  deleteNode(
    callback: (node: BSTDataNode<T>, tree?: BST<T>) => -1 | 0 | 1,
  ): BSTDataNode<T> | null {
    const node = this.binarySearchNode(callback);
    if (!node) return null;
    models.DeleteNodeInBST(node, this);
    // delete the connection of the node because it is deleted.
    node.prev = null;
    node.right = null;
    node.left = null;

    return node;
  }

  /**
   * Searches for a node in the Binary Search Tree
   * based on the given value.
   *
   * @param {T} value The value to search for in the tree nodes.
   * @param {BSTNodeValueComparisonCallbackType} [callback=this.search] Optional
   * callback function to determine the comparison logic between nodes.
   * @returns {T | null} The data of the node if found; otherwise, null.
   */
  binarySearch(
    value: T,
    callback: BSTNodeValueComparisonCallbackType = this.search,
  ): T | null {
    return models.BinarySearch(this._root, value, callback)?.data || null;
  }

  /**
   * Searches for a node in the Binary Search Tree
   * based on the given callback function.
   *
   * @param {(node: BSTDataNode<T>, tree?: BST<T>) => -1 | 0 | 1} callback - The
   * callback function that determines the comparison logic between nodes.
   * @returns {BSTDataNode<T> | null} The node matching the callback condition
   * if found; otherwise, null.
   */
  binarySearchNode(
    callback: (node: BSTDataNode<T>, tree?: BST<T>) => -1 | 0 | 1,
  ): BSTDataNode<T> | null {
    return models.BinarySearchNode(this, this._root, callback);
  }

  /**
   * Finds the minimum value in the Binary Search Tree
   * starting from the specified node.
   *
   * @param {BSTDataNode<T> | null} x The starting node to search from.
   * Defaults to the root of the tree.
   * @returns {T} The minimum value found, or null if the tree is empty.
   */
  min(x: BSTDataNode<T> | null = this._root): any {
    // shallow copy of x!
    let y: BSTDataNode<T> | null = x;
    if (y?.left) return this.min(y.left as BSTDataNode<T>);

    return y?.data || null;
  }

  /**
   * Finds the node containing the minimum value in the
   * Binary Search Tree starting from the specified node.
   *
   * @param {BSTDataNode<T> | null} x The starting node to search from.
   * Defaults to the root of the tree.
   * @returns {BSTDataNode<T> | null} The node containing the minimum value,
   * or null if the tree is empty.
   */
  minNode(x: BSTDataNode<T> | null = this._root): BSTDataNode<T> | null {
    let y: BSTDataNode<T> | null = x;
    if (y?.left) return this.minNode(y.left as BSTDataNode<T>);
    return y;
  }

  /**
   * Finds the maximum value in the Binary Search Tree
   * starting from the specified node.
   *
   * @param {BSTDataNode<T> | null} x The starting node to search from.
   * Defaults to the root of the tree.
   * @returns {T | null} The maximum value found in the tree,
   * or null if the tree is empty.
   */
  max(x: BSTDataNode<T> | null = this._root): T | null {
    let y: BSTDataNode<T> | null = x;
    if (y?.right) return this.max(y.right as BSTDataNode<T>);
    return y?.data || null;
  }

  /**
   * Finds the node with the maximum value in the Binary Search Tree
   * starting from the specified node.
   *
   * @param {BSTDataNode<T> | null} x The starting node to search from. Defaults to
   * the root of the tree.
   * @returns {BSTDataNode<T> | null} The node containing the maximum value found
   * in the tree, or null if the tree is empty.
   */
  maxNode(x: BSTDataNode<T> | null = this._root): BSTDataNode<T> | null {
    let y: BSTDataNode<T> | null = x;
    if (y?.right) return this.maxNode(y.right as BSTDataNode<T> | null);
    return y;
  }

  /**
   * Finds the predecessor value of a given node
   * in the Binary Search Tree.
   *
   * @param {BSTDataNode<T> | null} x The node for which to find
   * the predecessor. Defaults to the root of the tree.
   * @returns {T | null} The predecessor value of the
   * given node, or null if the node is not found.
   */
  predecessor(x: BSTDataNode<T> | null = this._root): T | null {
    if (x?.left) return this.max(x.left as BSTDataNode<T>);
    else return models.LeftBackward(x)?.data || null;
  }

  /**
   * Finds the predecessor node of a given node
   * in the Binary Search Tree.
   *
   * @param {BSTDataNode<T> | null} x - The node for which to find
   * kkkkkkthe predecessor node.
   * Defaults to the root of the tree.
   * @returns {BSTDataNode<T> | null} The predecessor node of the given
   * node, or null if the node is not found.
   */
  predecessorNode(
    x: BSTDataNode<T> | null = this._root,
  ): BSTDataNode<T> | null {
    if (x?.left) return this.maxNode(x.left as BSTDataNode<T>);
    else return models.LeftBackward(x) as BSTDataNode<T> | null;
  }

  /**
   * Finds the successor value of a given node in the
   * Binary Search Tree.
   *
   * @param {BSTDataNode<T> | null} x The node for which to find the
   * successor value. Defaults to the root of the tree.
   * @returns {T | null} The successor value of the given node,
   * or null if the node is not found.
   */
  successor(x: BSTDataNode<T> | null = this._root): T | null {
    if (x?.right) return this.min(x.right as BSTDataNode<T>);
    else return models.RightBackward(x)?.data || null;
  }

  /**
   * Finds the successor node of a given node in the
   * Binary Search Tree.
   *
   * @param {BSTDataNode<T> | null} x - The node for which to find
   * the successor node. Defaults to the root of the tree.
   * @returns {BSTDataNode<T> | null} The successor node of the given node,
   * or null if the node is not found.
   */
  successorNode(x: BSTDataNode<T> | null = this._root): BSTDataNode<T> | null {
    if (x?.right) return this.minNode(x.right as BSTDataNode<T> | null);
    else return models.RightBackward(x) as BSTDataNode<T> | null;
  }

  /**
   * Creates a new Binary Search Tree containing nodes
   * that satisfy the provided condition.
   *
   * @param {Function} callback - A function that tests each
   * node in the Binary Search Tree. Returns true to include
   * the node, false otherwise.
   * @returns {BST<T>} A new Binary Search Tree containing nodes
   * that satisfy the callback condition.
   */
  filter(
    callback: (node: BSTDataNode<T> | null, tree?: BST<T>) => boolean,
  ): BST<T> {
    const tree = new BST<T>();
    tree.order = this.order;

    // Perform Breadth-First Search (BFS) to traverse the tree
    this.BFS((node, bst) => {
      if (callback(node as BSTDataNode<T>, bst)) tree.insert(node?.data as T);
    });

    return tree as BST<T>;
  }

  /**
   * Performs Breadth-First Search (BFS) traversal
   * on the Binary Search Tree.
   * Executes the provided callback function on each
   * node in BFS order.
   *
   * @param {Function} callback A function to execute
   * on each node. Receives the node and the current BST instance.
   * @returns {BST<T>} The Binary Search Tree instance after BFS traversal.
   */
  BFS(callback: (node: BSTDataNode<T>, tree: BST<T>) => void): BST<T> {
    // Initialize a queue with the root node
    const Q = new Queue<BSTDataNode<T> | null>(this._root);
    // Call BFS implementation with the queue and callback
    models.CallBFS(this, Q, callback);

    // Return the BST instance for method chaining
    return this;
  }

  /**
   * Performs Depth-First Search (DFS) traversal
   * on the Binary Search Tree.
   * Executes the provided callback function on
   * each node in DFS order.
   *
   * @param {Function} callback A function to execute
   * on each node. Receives the node and the current BST instance.
   * @returns {BST<T>} The Binary Search Tree instance after DFS traversal.
   */
  DFS(callback: (node: BSTDataNode<T>, tree: BST<T>) => void): BST<T> {
    // Initialize a stack with the root node
    const S = new DynamicStack<BSTDataNode<T> | null>(this._root);
    // call the DFS implementation with the stack and the callback.
    models.CallDFS(this, S, callback);

    // Return the BST instance for method chaining.
    return this;
  }

  /**
   * Performs a single right rotation on the specified node.
   * This operation is typically used to rebalance an AVL tree.
   *
   * @param {BSTDataNode<T> | null} node - The node on which to perform the right rotation.
   * @returns {BST<T>} The updated tree after the rotation.
   */
  singleRightRotation(node: BSTDataNode<T> | null): BST<T> {
    if (!node!) return this;
    models.SingleRightRotation(node, this);

    return this;
  }

  /**
   * Performs a single left rotation on the specified node.
   * This operation is typically used to rebalance an AVL tree.
   *
   * @param {BSTDataNode<T> | null} node - The node on which to perform the left rotation.
   * @returns {BST<T>} The updated tree after the rotation.
   */
  singleLeftRotation(node: BSTDataNode<T> | null): BST<T> {
    if (!node) return this;
    models.SingleLeftRotation(node, this);

    return this;
  }

  /**
   * Performs a double left-right rotation on the specified node.
   * This operation is typically used to rebalance an AVL tree when
   * a left-right imbalance is detected.
   *
   * @param {BSTDataNode<T> | null} node - The node on which to perform the double left-right rotation.
   * @returns {BST<T>} The updated tree after the rotation.
   */
  doubleLeftRightRotation(node: BSTDataNode<T> | null): BST<T> {
    if (!node) return this;
    models.DoubleLeftRightRotation(node, this);

    return this;
  }

  /**
   * Performs a double right-left rotation on the specified node.
   * This operation is typically used to rebalance an AVL tree when
   * a right-left imbalance is detected.
   *
   * @param {BSTDataNode<T>} node - The node on which to perform the double right-left rotation.
   * @returns {BST<T>} The updated tree after the rotation.
   */
  doubleRightLeftRotation(node: BSTDataNode<T>): BST<T> {
    if (!node) return this;
    models.DoubleRightLeftRotation(node, this);

    return this;
  }

  /**
   * Converts the Binary Search Tree into an array
   * based on the specified traversal mode.
   * Default traversal mode is Depth-First Search (DFS).
   *
   * @param {"BFS" | "DFS"} mode - The traversal mode to
   * use: "BFS" for Breadth-First Search, "DFS" for
   * Depth-First Search (default: "DFS").
   * @returns {T[]} An array containing the data of all
   * nodes in the BST, based on the specified traversal mode.
   */
  toArray(mode: "BFS" | "DFS" = "DFS"): any[] {
    const __values__: T[] = [];
    this[mode]((node: BSTDataNode<T>): number =>
      __values__.push(node?.data as T),
    );

    return __values__;
  }

  /**
   * Implements the iterator protocol for the binary search tree,
   * allowing the tree to be iterated over in level-order (breadth-first) traversal.
   *
   * @returns {Iterator<T>} An iterator that yields the data of each node in the tree.
   */
  [Symbol.iterator](): Iterator<T | null> {
    let S = new Queue<BSTDataNode<T> | null>();
    S.enqueue(this._root);
    return {
      next(): IteratorResult<T | null> {
        if (!S.isEmpty) {
          const node = S.dequeue() as BSTDataNode;
          const value = node.data as T;
          if (node.left) S.enqueue(node.left as BSTDataNode<T>);
          if (node.right) S.enqueue(node.right as BSTDataNode<T>);
          return { value, done: false };
        }
        return { value: undefined, done: true };
      },
    };
  }

  /**
   * Prints the structure of the Binary Search Tree
   * starting from the specified node.
   *
   * @param {BSTDataNode<T> | null} node The starting node to begin
   * printing the BST structure (default: this._root).
   * @param {Integer} level The current level of the node
   * in the BST (default: 0).
   * @param {string} prefix The prefix label indicating the
   * position relative to its parent (default: "Root: ").
   * @returns {void}
   */
  print(
    node: BSTDataNode<T> | null = this._root,
    level: Integer = 0,
    prefix: string = "Root: ",
    callback: (node: BSTDataNode<T>, tree?: BST<T>) => any = (node) =>
      node.id || null,
  ): void {
    if (node === null) {
      return;
    }
    console.log(" ".repeat(level * 2) + prefix + callback(node, this));

    if (node.left) {
      this.print(node.left as BSTDataNode<T>, level + 1, "L--> ", callback);
    }

    if (node.right) {
      this.print(node.right as BSTDataNode<T>, level + 1, "R--> ", callback);
    }
  }
}
