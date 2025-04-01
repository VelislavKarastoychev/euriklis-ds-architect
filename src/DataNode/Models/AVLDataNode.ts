"use strict";
import type { Integer } from "../../../Types";
import { BSTDataNode } from "./BSTDataNode";

/**
 * Class representing an AVL tree data node.
 * Inherits from the BSTDataNode class.
 */
export class AVLDataNode<T = unknown> extends BSTDataNode<T> {
  /**
   * Balance factor of the AVL tree node.
   * @private
   * @type {Integer}
   */
  private bf: Integer = 0;

  /**
   * Creates an instance of AVLDataNode.
   * @param {T} data - Data to associate with the node.
   */
  constructor(data?: T) {
    if (data) {
      super(data);
      this.balance = 0;
    }
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
}
