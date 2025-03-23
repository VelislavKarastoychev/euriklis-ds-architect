"use strict";
import type { AbstractAttributesType } from "../../../Types";
import { v4 as uuidv4 } from "uuid";
/**
 * Abstract class representing a graph data element.
 * Provides common functionality for nodes and edges in a graph.
 *
 * @abstract
 */
export abstract class GraphDataElement {
  /**
   * Unique identifier for the graph data element.
   * @protected
   * @type {string}
   */
  protected _id: string = "";

  /**
   * Attributes associated with the graph data element.
   * @protected
   * @type {AbstractAttributesType}
   */
  protected _data: AbstractAttributesType = {};

  /**
   * Creates an instance of GraphDataElement.
   *
   * @param {Object} [options] - Options for the graph data element.
   * @param {string | number} [options.id] - Unique identifier for the element.
   * @param {AbstractAttributesType} [options.attributes] - Attributes for the element.
   */
  constructor(
    options:
      | { id?: string | number; attributes?: AbstractAttributesType }
      | undefined,
  ) {
    if (!options) return;
    this.id = options.id || uuidv4();
    this.data = options.attributes;
  }

  /**
   * Gets the unique identifier of the graph data element.
   *
   * @returns {string} The unique identifier.
   */
  get id(): string {
    return this._id;
  }

  /**
   * Sets the unique identifier of the graph data element.
   *
   * @param {string | number} id - The unique identifier.
   */
  set id(id: string | number) {
    this._id = "" + id;
  }

  /**
   * Gets the attributes of the graph data element.
   *
   * @returns {AbstractAttributesType} The attributes.
   */
  get data(): AbstractAttributesType {
    return { ...this._data };
  }

  /**
   * Sets the attributes of the graph data element.
   *
   * @param {AbstractAttributesType} [d] - The attributes.
   */
  set data(d: AbstractAttributesType | undefined) {
    if (d) this._data = d;
  }
}
