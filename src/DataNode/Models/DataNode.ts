"use strict";
import { v4 as uuidv4 } from "uuid";

/**
 * Abstract class representing a generic data node.
 * This class serves as a base for different types of data nodes.
 */
export abstract class DataNode {
  /**
   * Unique identifier for the data node.
   * @protected
   * @type {string}
   */
  protected _id: string = "";

  /**
   * Data associated with the node.
   * @protected
   * @type {*}
   */
  protected _data: any = null;

  /**
   * Creates an instance of DataNode.
   * @param {*} [data] - Optional data to associate with the node.
   * If the "data" argument is an object whch contains
   * the property id, then the id will be set from the
   * data, otherwise, the id property will be set automatically.
   */
  constructor(data?: any) {
    this.data = data;
    if (data?.id && !this.id) this.id = data.id;
    else if (typeof data === "string" || typeof data === "number") {
      this.id = data + "";
    } else this.id = uuidv4();
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
   * @returns {*} - The data associated with the node.
   */
  get data(): any {
    return this._data;
  }

  /**
   * Sets the data associated with the node.
   * @param {*} d - The data to associate with the node.
   */
  set data(d: any) {
    if (typeof d !== "undefined") this._data = d;
  }
}
