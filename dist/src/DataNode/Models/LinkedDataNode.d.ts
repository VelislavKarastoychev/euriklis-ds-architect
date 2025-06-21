import { DataNode } from "./DataNode";
/**
 * Class representing a linked data node,
 * which can point to the next and previous nodes.
 * Inherits from the DataNode class.
 */
export declare class LinkedDataNode<T = unknown> extends DataNode<T> {
    /**
     * Reference to the next linked data node.
     * @protected
     * @type {LinkedDataNode<T> | null}
     */
    protected _next: LinkedDataNode<T> | null;
    /**
     * Reference to the previous linked data node.
     * @protected
     * @type {LinkedDataNode<T> | null}
     */
    protected _prev: LinkedDataNode<T> | null;
    /**
     * Creates an instance of LinkedDataNode.
     * @param {T} data - Data to associate with the node.
     */
    constructor(data: T);
    /**
     * Gets the reference to the next linked data node.
     * @returns {LinkedDataNode<T> | null} - The next linked data node.
     */
    get next(): LinkedDataNode<T> | null;
    /**
     * Sets the reference to the next linked data node.
     * @param {LinkedDataNode | null} node - The next linked data node.
     */
    set next(node: LinkedDataNode<T> | null);
    /**
     * Gets the reference to the previous linked data node.
     * @returns {LinkedDataNode<T> | null} - The previous linked data node.
     */
    get prev(): LinkedDataNode<T> | null;
    /**
     * Sets the reference to the previous linked data node.
     * @param {LinkedDataNode<T> | null} node - The previous linked data node.
     */
    set prev(node: LinkedDataNode<T> | null);
}
