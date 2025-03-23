"use strict";
import type { Integer } from "../../../Types";
import { BSTDataNode } from "./BSTDataNode";

/**
 * Class representing an AVL tree data node.
 * Inherits from the BSTDataNode class.
 */
export class AVLDataNode extends BSTDataNode {
  /**
   * Balance factor of the AVL tree node.
   * @private
   * @type {Integer}
   */
  private bf: Integer = 0;

  /**
   * Creates an instance of AVLDataNode.
   * @param {*} data - Data to associate with the node.
   */
  constructor(data: any) {
    super(data);
    this.balance = 0;
  }

  /**
   * Gets the balance factor of the AVL tree node.
   * @returns {Integer} The balance factor.
   */
  get balance(): Integer {
    return this.bf;
  }

  /**
   * Sets the balance factor of the AVL tree node.
   * @param {Integer} n - The balance factor.
   */
  set balance(n: Integer) {
    this.bf = n;
  }

  /**
   * Gets the reference to the right child AVL tree node.
   * @returns {AVLDataNode | null} - The right child AVL tree node.
   */
  get right(): AVLDataNode | null {
    return (this._right as AVLDataNode) || null;
  }

  /**
   * Sets the reference to the right child AVL tree node.
   * @param {AVLDataNode | null} node - The right child AVL tree node.
   */
  set right(node: AVLDataNode | null) {
    this._right = node || null;
  }

  /**
   * Gets the reference to the left child AVL tree node.
   * @returns {AVLDataNode | null} The left child AVL tree node.
   */
  get left(): AVLDataNode | null {
    return (this._left as AVLDataNode) || null;
  }

  /**
   * Sets the reference to the left child AVL tree node.
   * @param {AVLDataNode | null} node - The left child AVL tree node.
   */
  set left(node: AVLDataNode | null) {
    this._left = node || null;
  }

  /**
   * Gets the reference to the parent AVL tree node.
   * @returns {AVLDataNode | null} The parent AVL tree node.
   */
  get prev(): AVLDataNode | null {
    return (this._prev as AVLDataNode) || null;
  }

  /**
   * Sets the reference to the parent AVL tree node.
   * @param {AVLDataNode | null} node - The parent AVL tree node.
   */
  set prev(node: AVLDataNode | null) {
    this._prev = node || null;
  }
}
