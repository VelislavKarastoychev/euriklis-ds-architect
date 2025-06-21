import type { Integer } from "../../../Types";
import { BSTDataNode } from "./BSTDataNode";
/**
 * Class representing an AVL tree data node.
 * Inherits from the BSTDataNode class.
 */
export declare class AVLDataNode<T = unknown> extends BSTDataNode<T> {
    /**
     * Balance factor of the AVL tree node.
     * @private
     * @type {Integer}
     */
    private bf;
    /**
     * Creates an instance of AVLDataNode.
     * @param {T} data - Data to associate with the node.
     */
    constructor(data?: T);
    /**
     * Gets the balance factor of the AVL tree node.
     * @returns {Integer} The balance factor.
     */
    get balance(): Integer;
    /**
     * Sets the balance factor of the AVL tree node.
     * @param {Integer} n - The balance factor.
     */
    set balance(n: Integer);
}
