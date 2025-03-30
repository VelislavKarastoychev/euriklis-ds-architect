"use strict";
import { DataNode } from "./DataNode";
/**
 * Class representing a linked data node,
 * which can point to the next and previous nodes.
 * Inherits from the DataNode class.
 */
export class LinkedDataNode<T = unknown> extends DataNode {
  /**
   * Reference to the next linked data node.
   * @protected
   * @type {LinkedDataNode<T> | null}
   */
  protected _next: LinkedDataNode<T> | null = null;

  /**
   * Reference to the previous linked data node.
   * @protected
   * @type {LinkedDataNode<T> | null}
   */
  protected _prev: LinkedDataNode<T> | null = null;

  /**
   * Creates an instance of LinkedDataNode.
   * @param {T} data - Data to associate with the node.
   */
  constructor(data: T) {
    super(data);
  }

  /**
   * Gets the reference to the next linked data node.
   * @returns {LinkedDataNode<T> | null} - The next linked data node.
   */
  get next(): LinkedDataNode | null {
    return (this as LinkedDataNode)._next;
  }

  /**
   * Sets the reference to the next linked data node.
   * @param {LinkedDataNode | null} node - The next linked data node.
   */
  set next(node: LinkedDataNode<T> | null) {
    (this as LinkedDataNode<T>)._next = node;
  }

  /**
   * Gets the reference to the previous linked data node.
   * @returns {LinkedDataNode | null} - The previous linked data node.
   */
  get prev(): LinkedDataNode<T> | null {
    return this._prev;
  }

  /**
   * Sets the reference to the previous linked data node.
   * @param {LinkedDataNode<T> | null} node - The previous linked data node.
   */
  set prev(node: LinkedDataNode<T> | null) {
    this._prev = node;
  }
}
