"use strict";

import { v4 as uuidv4 } from "uuid";

/**
 * Abstract class representing a generic data node.
 * This class serves as a base for different types of data nodes.
 */
export abstract class DataNode<T = unknown> {
  /**
   * Unique identifier for the data node.
   * @protected
   * @type {string}
   */
  protected _id: string = "";

  /**
   * Data associated with the node.
   * @protected
   * @type {T | null}
   */
  protected _data: T | null = null;

  /**
   * Creates an instance of DataNode.
   * @param {T} [data] - Optional data to associate with the node.
   * If the "data" argument is an object whch contains
   * the property id, then the id will be set from the
   * data, otherwise, the id property will be set automatically.
   */
  constructor(data?: T, id?: string) {
    this.data = data;
    if ((data as { id: string; [prop: string]: unknown })?.id && !this.id)
      this.id = (data as { id: string; [prop: string]: unknown }).id;
    else if (id) this.id = id;
    else this.id = uuidv4();
  }

  /**
   * Gets the unique identifier for the data node.
   * @returns {string} - The unique identifier.
   */
  get id(): string {
    return this._id;
  }

  /**
   * Sets the unique identifier for the data node.
   * @param {string} id - The unique identifier.
   */
  set id(id: string) {
    this._id = id;
  }

  /**
   * Gets the data associated with the node.
   * @returns {T | null} - The data associated with the node.
   */
  get data(): T | null {
    return this._data;
  }

  /**
   * Sets the data associated with the node.
   * @param {T} d - The data to associate with the node.
   */
  set data(d: T | undefined) {
    if (typeof d !== "undefined") this._data = d;
  }
}
