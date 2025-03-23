"use strict";
import { DataNode } from "./DataNode";
/**
 * Class representing a linked data node,
 * which can point to the next and previous nodes.
 * Inherits from the DataNode class.
 */
export class LinkedDataNode extends DataNode {
  /**
   * Reference to the next linked data node.
   * @protected
   * @type {LinkedDataNode | null}
   */
  protected _next: LinkedDataNode | null = null;

  /**
   * Reference to the previous linked data node.
   * @protected
   * @type {LinkedDataNode | null}
   */
  protected _prev: LinkedDataNode | null = null;

  /**
   * Creates an instance of LinkedDataNode.
   * @param {*} data - Data to associate with the node.
   */
  constructor(data: any) {
    super(data);
  }

  /**
   * Gets the reference to the next linked data node.
   * @returns {LinkedDataNode | null} - The next linked data node.
   */
  get next(): LinkedDataNode | null {
    return (this as LinkedDataNode)._next;
  }

  /**
   * Sets the reference to the next linked data node.
   * @param {LinkedDataNode | null} node - The next linked data node.
   */
  set next(node: LinkedDataNode | null) {
    (this as LinkedDataNode)._next = node;
  }

  /**
   * Gets the reference to the previous linked data node.
   * @returns {LinkedDataNode | null} - The previous linked data node.
   */
  get prev(): LinkedDataNode | null {
    return this._prev;
  }

  /**
   * Sets the reference to the previous linked data node.
   * @param {LinkedDataNode | null} node - The previous linked data node.
   */
  set prev(node: LinkedDataNode | null) {
    this._prev = node;
  }
}
