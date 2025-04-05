"use strict";
// 02 / 9759052
// 0888239365
// Wrong or missing product - we have to call the Primio api and to check
// which products are part of this order and their prices. Sometimes
// when someone byy a product he can get a gift. So the product is not
// wrong but is a gift.
// Order not shipped - we have to use the order status check.
// cancel order - I have to send a request to the Primio
// reversal in the prim.
// modify order - we have to ask the Prim.
// loyalty program issue - we have to provide the model with the
// yotpo points.
// order_information - like a prompt we have to check in primio
// what is the comments in the getSingleSalesOrder.
// reship order - If someone ask again to sent his order we
// have to check in primio API the parameters of the order and
// to ensure throuh communication with the client that these
// parameters remain as before.
// product return: We have to inform the client what kind of
// actions are needed to be made in order to return the product.
// To check in teams.
// escalate to humman - to send the conversation in infobip.
// Order status check - the same in order_informattion.
// loyalty_points_check - we have check
// loyalty_birthday_check - to check if the client has got
// points for its birthday.
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
  constructor(data?: T) {
    this.data = data;
    if ((data as { id: string; [prop: string]: unknown })?.id && !this.id)
      this.id = (data as { id: string; [prop: string]: unknown }).id;
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
