"use strict";
import { DataNode } from "./DataNode";

/**
 * Class representing a binary search tree (BST) data node.
 * Inherits from the DataNode class.
 */
export class BSTDataNode extends DataNode {
  /**
   * Reference to the parent BST data node.
   * @protected
   * @type {BSTDataNode | null}
   */
  protected _prev: BSTDataNode | null = null;

  /**
   * Reference to the right child BST data node.
   * @protected
   * @type {BSTDataNode | null}
   */
  protected _right: BSTDataNode | null = null;

  /**
   * Reference to the left child BST data node.
   * @protected
   * @type {BSTDataNode | null}
   */
  protected _left: BSTDataNode | null = null;

  /**
   * Creates an instance of BSTDataNode.
   * @param {*} data - Data to associate with the node.
   */
  constructor(data: any) {
    super(data);
  }

  /**
   * Gets the reference to the parent BST data node.
   * @returns {BSTDataNode | null} - The parent BST data node.
   */
  get prev(): BSTDataNode | null {
    return this._prev;
  }

  /**
   * Sets the reference to the parent BST data node.
   * @param {BSTDataNode | null} node - The parent BST data node.
   */
  set prev(node: BSTDataNode | null) {
    this._prev = node;
  }

  /**
   * Gets the reference to the right child BST data node.
   * @returns {BSTDataNode | null} - The right child BST data node.
   */
  get right(): BSTDataNode | null {
    return this._right || null;
  }

  /**
   * Sets the reference to the right child BST data node.
   * @param {BSTDataNode | null} node - The right child BST data node.
   */
  set right(node: BSTDataNode | null) {
    this._right = node || null;
  }

  /**
   * Gets the reference to the left child BST data node.
   * @returns {BSTDataNode | null} - The left child BST data node.
   */
  get left(): BSTDataNode | null {
    return this._left || null;
  }

  /**
   * Sets the reference to the left child BST data node.
   * @param {BSTDataNode | null} node - The left child BST data node.
   */
  set left(node: BSTDataNode | null) {
    this._left = node || null;
  }
}
