import { GraphDataElement } from "./GraphDataElement";
import type { AbstractAttributesType, GraphValuesDomain, Integer, NumericType } from "../../../Types";
/**
 * Class representing an edge in a graph.
 * Extends the abstract class GraphDataElement and
 * includes additional functionality for edge weights.
 * An edge may be assumed as a subsed of the Cartesion
 * product of the nodds of a graph.
 */
export declare class GraphDataEdge extends GraphDataElement {
    protected _source: string;
    protected _target: string;
    /**
     * Creates an instance of GraphDataEdge.
     *
     * @param {Object | string | number} options - Options
     * for the graph data edge or an identifier.
     * @param {string} options.id - Unique identifier for the edge
     * to be consistent with the Graph data element type.
     * @param {string} options.source - The source node of the edge.
     * @param {string} options.target - The target node of the edge.
     * @param {AbstractAttributesType & { weight?: GraphValuesDomain }} [options.attributes] -
     * Attributes for the edge, including weight.
     */
    constructor(options: {
        id: string;
        source: string;
        target: string;
        attributes?: AbstractAttributesType & {
            weight?: GraphValuesDomain;
        };
    });
    get source(): string;
    set source(s: string);
    get target(): string;
    set target(t: string);
    /**
     * Gets the attributes of the edge, including weight.
     *
     * @returns {AbstractAttributesType & { weight: GraphValuesDomain }} The attributes including weight.
     */
    get data(): AbstractAttributesType & {
        weight: GraphValuesDomain;
    };
    /**
     * Sets the data for the edge.
     *
     * This setter method updates the edge's attributes.
     * If the `weight` attribute is not defined, it defaults to 1.
     *
     * @param {AbstractAttributesType & { weight?: GraphValuesDomain }} d - The new data attributes for the edge.
     */
    set data(d: AbstractAttributesType & {
        weight?: GraphValuesDomain;
    });
    /**
     * Updates the data attributes of the edge.
     *
     * This method merges the provided attributes with the existing data attributes of the edge.
     * If the `weight` attribute is not defined, it remains unchanged.
     *
     * @param {AbstractAttributesType & { weight?: GraphValuesDomain }} attributes - The new data
     * attributes to merge with the existing ones.
     * @returns {GraphDataEdge} The updated instance of the graph data edge.
     */
    updateData(attributes: AbstractAttributesType & {
        weight?: GraphValuesDomain;
    }): GraphDataEdge;
    /**
     * Gets the weight of the edge.
     *
     * @returns {GraphValuesDomain} - The weight of the edge.
     */
    get weight(): GraphValuesDomain;
    /**
     * Sets the weight of the edge.
     *
     * @param {GraphValuesDomain} w - The weight of the edge.
     */
    set weight(w: GraphValuesDomain);
    /**
     * Assigns a random number to the edge weight
     * within the specified range and seed.
     *
     * @param {number} from - The minimum value of the random range.
     * @param {number} to - The maximum value of the random range.
     * @param {Integer} seed - The seed for the random number generator.
     * @returns {GraphDataEdge} The current edge instance.
     */
    assignRandomNumberToWeight(from: number, to: number, seed: Integer): GraphDataEdge;
    /**
     * Assigns a unique random number to the edge
     * weight within the specified range.
     *
     * @param {number} from - The minimum value of the random range.
     * @param {number} to - The maximum value of the random range.
     * @returns {GraphDataEdge} The current edge instance.
     */
    assignUniqueRandomNumberToWeight(from: number, to: number): GraphDataEdge;
    /**
     * Assigns a random vector to the edge weight
     * within the specified range and seed.
     *
     * @param {Integer} size - The size of the vector.
     * @param {number} from - The minimum value of the random range.
     * @param {number} to - The maximum value of the random range.
     * @param {Integer} seed - The seed for the random number generator.
     * @returns {GraphDataEdge} The current edge instance.
     */
    assignRandomVectorToWeight(size: Integer, from: number, to: number, seed: Integer, type?: NumericType): GraphDataEdge;
    /**
     * Assigns a unique random vector to the edge
     * weight within the specified range.
     *
     * @param {Integer} size - The size of the vector.
     * @param {number} from - The minimum value of the random range.
     * @param {number} to - The maximum value of the random range.
     * @returns {GraphDataEdge} - The current edge instance.
     */
    assignUniqueRandomVectorToWeight(size: Integer, from: number, to: number, type?: NumericType): GraphDataEdge;
    /**
     * Assigns a random matrix to the edge weight
     * within the specified range and seed.
     *
     * @param {Integer} rows - The number of rows in the matrix.
     * @param {Integer} columns - The number of columns in the matrix.
     * @param {number} from - The minimum value of the random range.
     * @param {number} to - The maximum value of the random range.
     * @param {Integer} seed - The seed for the random number generator.
     * @returns {GraphDataEdge} The current edge instance.
     */
    assignRandomMatrixToWeight(rows: Integer, columns: Integer, from: number, to: number, seed: Integer, type?: NumericType): GraphDataEdge;
    /**
     * Assigns a unique random matrix to the edge
     * weight within the specified range.
     *
     * @param {Integer} rows - The number of rows in the matrix.
     * @param {Integer} columns - The number of columns in the matrix.
     * @param {number} from - The minimum value of the random range.
     * @param {number} to - The maximum value of the random range.
     * @param {NumericType} type -  The type of the matrix rows.
     * @returns {GraphDataEdge} - The current edge instance.
     */
    assignUniqueRandomMatrixToWeight(rows: Integer, columns: Integer, from: number, to: number, type?: NumericType): GraphDataEdge;
}
