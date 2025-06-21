import { DataNode } from "./DataNode";
/**
 * Class representing a binary search tree (BST) data node.
 * Inherits from the DataNode class.
 */
export declare class BSTDataNode<T = unknown> extends DataNode<T> {
    /**
     * Reference to the parent BST data node.
     * @protected
     * @type {this | null}
     */
    protected _prev: this | null;
    /**
     * Reference to the right child BST data node.
     * @protected
     * @type {this | null}
     */
    protected _right: this | null;
    /**
     * Reference to the left child BST data node.
     * @protected
     * @type {this | null}
     */
    protected _left: this | null;
    /**
     * Creates an instance of BSTDataNode.
     * @param {T} data - Data to associate with the node.
     */
    constructor(data: T);
    /**
     * Gets the reference to the parent BST data node.
     * @returns {this | null} - The parent BST data node.
     */
    get prev(): this | null;
    /**
     * Sets the reference to the parent BST data node.
     * @param {this | null} node - The parent BST data node.
     */
    set prev(node: this | null);
    /**
     * Gets the reference to the right child BST data node.
     * @returns {this | null} - The right child BST data node.
     */
    get right(): this | null;
    /**
     * Sets the reference to the right child BST data node.
     * @param {this | null} node - The right child BST data node.
     */
    set right(node: this | null);
    /**
     * Gets the reference to the left child BST data node.
     * @returns {this | null} - The left child BST data node.
     */
    get left(): this | null;
    /**
     * Sets the reference to the left child BST data node.
     * @param {this | null} node - The left child BST data node.
     */
    set left(node: this | null);
}
