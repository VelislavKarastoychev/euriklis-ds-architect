/**
 * Abstract class representing a generic data node.
 * This class serves as a base for different types of data nodes.
 */
export declare abstract class DataNode<T = unknown> {
    /**
     * Unique identifier for the data node.
     * @protected
     * @type {string}
     */
    protected _id: string;
    /**
     * Data associated with the node.
     * @protected
     * @type {T | null}
     */
    protected _data: T | null;
    /**
     * Creates an instance of DataNode.
     * @param {T} [data] - Optional data to associate with the node.
     * If the "data" argument is an object whch contains
     * the property id, then the id will be set from the
     * data, otherwise, the id property will be set automatically.
     */
    constructor(data?: T, id?: string);
    /**
     * Gets the unique identifier for the data node.
     * @returns {string} - The unique identifier.
     */
    get id(): string;
    /**
     * Sets the unique identifier for the data node.
     * @param {string} id - The unique identifier.
     */
    set id(id: string);
    /**
     * Gets the data associated with the node.
     * @returns {T | null} - The data associated with the node.
     */
    get data(): T | null;
    /**
     * Sets the data associated with the node.
     * @param {T} d - The data to associate with the node.
     */
    set data(d: T | undefined);
}
