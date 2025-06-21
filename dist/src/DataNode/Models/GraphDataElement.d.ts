import type { AbstractAttributesType } from "../../../Types";
/**
 * Abstract class representing a graph data element.
 * Provides common functionality for nodes and edges in a graph.
 *
 * @abstract
 */
export declare abstract class GraphDataElement<T> {
    /**
     * Unique identifier for the graph data element.
     * @protected
     * @type {string}
     */
    protected _id: string;
    /**
     * Attributes associated with the graph data element.
     * @protected
     * @type {AbstractAttributesType}
     */
    protected _data: AbstractAttributesType;
    /**
     * Creates an instance of GraphDataElement.
     *
     * @param {Object} [options] - Options for the graph data element.
     * @param {string | number} [options.id] - Unique identifier for the element.
     * @param {AbstractAttributesType} [options.attributes] - Attributes for the element.
     */
    constructor(options: {
        id?: string | number;
        attributes?: AbstractAttributesType;
    } | undefined);
    /**
     * Gets the unique identifier of the graph data element.
     *
     * @returns {string} The unique identifier.
     */
    get id(): string;
    /**
     * Sets the unique identifier of the graph data element.
     *
     * @param {string | number} id - The unique identifier.
     */
    set id(id: string | number);
    /**
     * Gets the attributes of the graph data element.
     *
     * @returns {AbstractAttributesType} The attributes.
     */
    get data(): AbstractAttributesType;
    /**
     * Sets the attributes of the graph data element.
     *
     * @param {AbstractAttributesType} [d] - The attributes.
     */
    set data(d: AbstractAttributesType | undefined);
}
