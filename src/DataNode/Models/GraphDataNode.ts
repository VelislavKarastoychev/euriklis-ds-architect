"use strict";
import type {
  AbstractAttributesType,
  EdgeType,
  GraphValuesDomain,
  Integer,
  NodeType,
  NumericType,
} from "../../../Types";
import { GraphDataElement } from "./GraphDataElement";
import { GraphDataEdge } from "./GraphDataEdge";
import { v4 as uuidv4 } from "uuid";
// import { Matrix } from "../../../Matrix";
/**
 * Class representing a node in a graph.
 * Extends the abstract class GraphDataElement
 * and includes additional functionality for
 * managing edges and node values.
 */
export class GraphDataNode extends GraphDataElement {
  /**
   * Private field which holds the incomming edges
   * of the grap.
   * @protected
   * @type{Map<string, GraphDataEdge>}
   */
  protected _inputs: Map<string, GraphDataEdge> = new Map();

  /**
   * A field which holds the outgoing edges
   * of the grap.
   * @protected
   * @type{Map<string, GraphDataEdge>}
   */
  protected _outputs: Map<string, GraphDataEdge> = new Map();

  /**
   * Creates an instance of GraphDataNode.
   *
   * @param {Object | string | number} options - Options
   * for the graph data node or an identifier.
   * @param {string} [options.id] - Unique identifier for the node.
   * @param {AbstractAttributesType & { value?: GraphValuesDomain }} [options.attributes] - Attributes
   * for the node, including value.
   */
  constructor(
    options:
      | {
          id?: string | number;
          attributes?: AbstractAttributesType & { value?: GraphValuesDomain };
        }
      | number
      | string,
  ) {
    if (typeof options === "string" || typeof options === "number") {
      if (typeof options === "string") {
        options = { id: "" + options, attributes: { value: 1 } };
      } else options = { id: "" + options, attributes: { value: options } };
    }

    if (!options.id) options.id = uuidv4();
    if (!options.attributes) options.attributes = { value: 1 };
    else options.attributes = { value: 1, ...options.attributes };
    super(options);
  }

  /**
   * @override
   * Gets the attributes of the node, including value.
   *
   * @returns {AbstractAttributesType & { value: GraphValuesDomain }} The attributes including value.
   */
  get data(): AbstractAttributesType & { value: GraphValuesDomain } {
    return super.data as AbstractAttributesType & { value: GraphValuesDomain };
  }

  /**
   * Sets the attributes of the node, including value.
   *
   * @param {AbstractAttributesType & { value?: GraphValuesDomain }} d - The attributes including value.
   */
  set data(d: AbstractAttributesType & { value?: GraphValuesDomain }) {
    super.data = d;
    if (typeof this.data.value === "undefined") this._data.value = 1;
  }

  /**
   * Gets the incoming edges of the node.
   *
   * @returns {Map<string, GraphDataEdge>}The incoming edges.
   */
  get inputs(): Map<string, GraphDataEdge> {
    return this._inputs;
  }

  /**
   * Sets the incoming edges of the node.
   *
   * @param {Map<string, GraphDataEdge>} d - The incoming edges.
   */
  set inputs(d: Map<string, GraphDataEdge>) {
    this._inputs = d;
  }

  /**
   * Gets the outgoing edges of the node.
   *
   * @returns {Map<string, GraphDataEdge>} The outgoing edges.
   */
  get outputs(): Map<string, GraphDataEdge> {
    return this._outputs;
  }

  /**
   * Sets the outgoing edges of the node.
   *
   * @param {Map<string, GraphDataEdge>} d - The outgoing edges.
   */
  set outputs(d: Map<string, GraphDataEdge>) {
    this._outputs = d;
  }

  /**
   * Gets the value of the node.
   *
   * @returns {GraphValuesDomain} - The value of the node.
   */
  get value(): GraphValuesDomain {
    return this.data.value;
  }

  /**
   * Sets the value of the node.
   *
   * @param {GraphValuesDomain} v - The value of the node.
   */
  set value(v: GraphValuesDomain) {
    this._data.value = v;
  }

  /**
   * Updates the data attributes of the node.
   *
   * This method merges the existing data attributes of the node with the provided
   * new attributes. If an attribute already exists, it will be updated with the new value.
   * This can be used to update the value or add new attributes to the node.
   *
   * @param {AbstractAttributesType & { value?: GraphValuesDomain }} d - The new data attributes
   * to merge with the existing data.
   *   - `value` (optional): The new value to assign to the node.
   * @returns {GraphDataNode} The updated instance of the GraphDataNode.
   */
  updateData(
    d: AbstractAttributesType & { value?: GraphValuesDomain },
  ): GraphDataNode {
    this.data = { ...this._data, ...d };

    return this;
  }

  /**
   * Adds an outgoing edge to the node.
   *
   * @param {GraphDataEdge} edge - The edge which has to be added.
   * @returns {GraphDataNode} - The current node instance.
   */
  addOutgoingEdge(edge: GraphDataEdge): GraphDataNode {
    this.outputs.set(edge.target, edge);

    return this;
  }

  /**
   * Adds an incoming edge to the node.
   *
   * @param {GraphDataEdge} edge - The edge which have to be added.
   * for the edge, including weight.
   * @returns {GraphDataNode} - The current node instance.
   */
  addIncomingEdge(edge: GraphDataEdge): GraphDataNode {
    this.inputs.set(edge.source, edge);

    return this;
  }

  /**
   * Finds an incoming edge by its identifier.
   *
   * @param {string} id - The identifier of the edge.
   * @returns {GraphDataEdge | null} - The found edge or null if not found.
   */
  findIncomingEdgeById(id: string): GraphDataEdge | null {
    return this.inputs.get(id) || null;
  }

  /**
   * Finds an outgoing edge by its identifier.
   *
   * @param {string} id - The identifier of the edge.
   * @returns {GraphDataEdge | null} - The found edge or null if not found.
   */
  findOutgoingEdgeById(id: string): GraphDataEdge | null {
    return this.outputs.get(id) || null;
  }

  /**
   * Finds outgoing edges that satisfy
   * the given callback condition.
   *
   * @param {Function} callback - The callback function to test each edge.
   * @param {Object} params - Additional parameters to pass to the callback.
   * @returns {Map<string, GraphDataEdge>} - The edges that satisfy the condition.
   */
  findOutgoingEdgesWhichSatisfy(
    callback: (source: NodeType, edge: EdgeType, params?: any) => boolean,
    params?: any,
  ): Map<string, GraphDataEdge> {
    const source: NodeType = { name: this.id, attributes: this.data };
    const edgesCollection: Map<string, GraphDataEdge> = new Map();
    for (const [id, edge] of this.outputs) {
      if (
        callback(
          source,
          { source: this.id, target: edge.id, attributes: edge.data },
          params,
        )
      )
        edgesCollection.set(id, edge);
    }

    return edgesCollection;
  }

  /**
   * Finds incoming edges that satisfy
   * the given callback condition.
   *
   * @param {Function} callback - The callback function to test each edge.
   * @param {Object} params - Additional parameters to pass to the callback.
   * @returns {Map<string, GraphDataEdge>} - The edges that satisfy the condition.
   */
  findIncomingEdgesWichSatisfy(
    callback: (target: NodeType, edge: EdgeType, params?: any) => boolean,
    params?: any,
  ): Map<string, GraphDataEdge> {
    const target: NodeType = { name: this.id, attributes: this.data };
    const edgesCollection: Map<string, GraphDataEdge> = new Map();
    for (const [id, edge] of this.inputs) {
      if (
        callback(
          target,
          { source: edge.id, target: this.id, attributes: edge.data },
          params,
        )
      )
        edgesCollection.set(id, edge);
    }

    return edgesCollection;
  }

  /**
   * Removes all incoming edges from the node.
   *
   * @returns {GraphDataNode} - The current node instance.
   */
  removeIncomingEdges(): GraphDataNode {
    this.inputs = new Map();

    return this;
  }

  /**
   * Removes all outgoing edges from the node.
   *
   * @returns {GraphDataNode} - The current node instance.
   */
  removeOutgoingEdges(): GraphDataNode {
    this.outputs = new Map();

    return this;
  }

  /**
   * Removes all edges (both incoming and outgoing) from the node.
   *
   * @returns {GraphDataNode} - The current node instance.
   */
  removeAllEdges(): GraphDataNode {
    this.removeIncomingEdges().removeOutgoingEdges();

    return this;
  }

  /**
   * Removes an incoming edge from the current node.
   *
   * This method deletes the incoming edge from the
   * specified source node to the current node.
   *
   * @param {string} source - The ID of the source
   * node from which the incoming edge is to be removed.
   * @returns {GraphDataNode} - The current node instance
   * with the specified incoming edge removed.
   */
  removeIncomingEdge(source: string): GraphDataNode {
    this.inputs.delete(source);

    return this;
  }

  /**
   * Removes an outgoing edge from the current node.
   *
   * This method deletes the outgoing edge from the
   * current node to the specified target node.
   *
   * @param {string} target - The ID of the target
   * node to which the outgoing edge is to be removed.
   * @returns {GraphDataNode} - The current node
   * instance with the specified outgoing edge removed.
   */
  removeOutgoingEdge(target: string): GraphDataNode {
    this.outputs.delete(target);

    return this;
  }

  /**
   * Assigns a weight of 1 to all incoming edges.
   *
   * @returns {GraphDataNode} - The current node instance.
   */
  assignIncomingWeightsToUnit(): GraphDataNode {
    for (const [_, e] of this.inputs) {
      e.data.weight = 1;
    }

    return this;
  }

  /**
   * Assigns a weight of 1 to all outgoing edges.
   *
   * @returns {GraphDataNode} - The current node instance.
   */
  assignOutgoingWeightsToUnit(): GraphDataNode {
    for (const [_, e] of this.outputs) {
      e.data.weight = 1;
    }

    return this;
  }

  /**
   * Assigns a weight of 1 to all incoming and outgoing edges.
   *
   * @returns {GraphDataNode} - The current node instance.
   */
  assignNeighbourWeightsToUnit(): GraphDataNode {
    this.assignIncomingWeightsToUnit().assignOutgoingWeightsToUnit();

    return this;
  }

  /**
   * Assigns random numbers as weights to all incoming edges of the current node.
   *
   * This method iterates over all incoming edges of the node and assigns a random
   * number as the weight for each edge. The random numbers are generated within the
   * specified range [from, to], and a seed is used to ensure reproducibility. The seed
   * is incremented for each edge to generate unique random numbers.
   *
   * @param {Integer} [from=0] - The lower bound of the random number range (inclusive).
   * @param {Integer} [to=1] - The upper bound of the random number range (exclusive).
   * @param {Integer} [seed=123456] - An optional seed for the random number generator to
   * ensure reproducibility. The seed is incremented for each incoming edge.
   * @returns {GraphDataNode} The current node instance, allowing for method chaining.
   */
  assignIncomingWeightsToRandomNumber(
    from: Integer = 0,
    to: Integer = 1,
    seed: Integer = 123456,
  ): GraphDataNode {
    for (const [_, edge] of this.inputs) {
      edge.assignRandomNumberToWeight(from, to, seed++);
    }
    return this;
  }

  /**
   * Assigns random numbers as weights to all outgoing edges of the current node.
   *
   * This method iterates over all outgoing edges of the node and assigns a random
   * number as the weight for each edge. The random numbers are generated within the
   * specified range [from, to], and a seed is used to ensure reproducibility. The seed
   * is incremented for each edge to generate unique random numbers.
   *
   * @param {Integer} [from=0] - The lower bound of the random number range (inclusive).
   * @param {Integer} [to=1] - The upper bound of the random number range (exclusive).
   * @param {Integer} [seed=6543210] - An optional seed for the random number generator
   * to ensure reproducibility. The seed is incremented for each outgoing edge.
   * @returns {GraphDataNode} The current node instance, allowing for method chaining.
   */
  assignOutgoingWeightsToRandomNumber(
    from: Integer = 0,
    to: Integer = 1,
    seed: Integer = 6543210,
  ): GraphDataNode {
    for (const [_, edge] of this.outputs) {
      edge.assignRandomNumberToWeight(from, to, seed++);
    }

    return this;
  }

  /**
   * Assigns random numbers as weights to all incoming and outgoing edges of the current node.
   *
   * This method assigns random weights to both the incoming and outgoing edges of the node.
   * The random numbers are generated within the specified range [from, to], and a seed is used
   * to ensure reproducibility. The seed is incremented when assigning weights to the incoming
   * edges and then passed along for the outgoing edges.
   *
   * @param {Integer} [from=0] - The lower bound of the random number range (inclusive).
   * @param {Integer} [to=1] - The upper bound of the random number range (exclusive).
   * @param {Integer} [seed=123456] - An optional seed for the random number generator
   * to ensure reproducibility. The seed is incremented when assigning weights to the incoming edges.
   * @returns {GraphDataNode} The current node instance, allowing for method chaining.
   */
  assignRandomNumberToNeighbourhoodWeights(
    from: Integer = 0,
    to: Integer = 1,
    seed: Integer = 123456,
  ): GraphDataNode {
    this.assignIncomingWeightsToRandomNumber(
      seed++,
    ).assignOutgoingWeightsToRandomNumber(from, to, seed);
    return this;
  }

  /**
   * Assigns a unique random number to the incoming weights of the node.
   *
   * This method updates the weights of all incoming edges to the node, assigning each edge a unique
   * random number within the specified range. The random number is generated within the inclusive
   * range `[from, to)`.
   *
   * @param {number} [from=0] - The minimum value in the range for the random numbers (inclusive).
   * @param {number} [to=1] - The maximum value in the range for the random numbers (exclusive).
   * @returns {GraphDataNode} The current instance of the node with updated incoming weights.
   */
  assignIncomingWeightsToUniqueRandomNumber(
    from: number = 0,
    to: number = 1,
  ): GraphDataNode {
    for (const [_, edge] of this.inputs) {
      edge.assignUniqueRandomNumberToWeight(from, to);
    }

    return this;
  }

  /**
   * Assigns a unique random number to the outgoing weights of the node.
   *
   * This method updates the weights of all outgoing edges from the node, assigning each edge a unique
   * random number within the specified range. The random number is generated within the inclusive
   * range `[from, to)`.
   *
   * @param {number} [from=0] - The minimum value in the range for the random numbers (inclusive).
   * @param {number} [to=1] - The maximum value in the range for the random numbers (exclusive).
   * @returns {GraphDataNode} The current instance of the node with updated outgoing weights.
   */
  assignOutgoingWeightsToUniqueRandomNumber(
    from: number = 0,
    to: number = 1,
  ): GraphDataNode {
    for (const [_, edge] of this.outputs) {
      edge.assignUniqueRandomNumberToWeight(from, to);
    }

    return this;
  }

  /**
   * Assigns unique random numbers to both incoming and outgoing weights of the node.
   *
   * This method updates the weights of all incoming and outgoing edges from the node. Each edge will
   * have its weight set to a unique random number within the specified range `[from, to)`.
   * The random number generation is performed separately for incoming and outgoing edges.
   *
   * @param {number} [from=0] - The minimum value in the range for the random numbers (inclusive).
   * @param {number} [to=1] - The maximum value in the range for the random numbers (exclusive).
   * @returns {GraphDataNode} The current instance of the node with updated weights for its neighborhood.
   */
  assignUniqueRandomNumberToNeighbourhoodWeights(
    from: number = 0,
    to: number = 1,
  ): GraphDataNode {
    this.assignIncomingWeightsToUniqueRandomNumber(
      from,
      to,
    ).assignOutgoingWeightsToUniqueRandomNumber(from, to);

    return this;
  }

  /**
   * Assigns random vector weights to all incoming edges of the node.
   *
   * This method iterates through all incoming edges of the current node and assigns a random vector
   * as the weight to each edge. The random vector is generated with the specified size and each element
   * is within the range [from, to]. An optional seed value is used to control the randomness and ensure
   * reproducibility of the random number generation.
   *
   * @param {Integer} size - The size (number of elements) of the random vector to be assigned to each edge weight.
   * @param {Integer} [from=0] - The lower bound of the random number range for each vector element (inclusive).
   * @param {Integer} [to=1] - The upper bound of the random number range for each vector element (exclusive).
   * @param {Integer} [seed=123456] - An optional seed for the random number generator to ensure reproducibility
   * of the random vectors across the node's incoming edges.
   * @returns {GraphDataNode} The current instance of the graph data node, allowing for method chaining.
   */
  assignIncomingWeightsToRandomVector(
    size: Integer,
    from: Integer = 0,
    to: Integer = 1,
    seed: Integer = 123456,
  ): GraphDataNode {
    for (const [_, edge] of this.inputs) {
      edge.assignRandomVectorToWeight(size, from, to, seed++);
    }

    return this;
  }
  /**
   * Assigns unique random vector weights to all incoming edges of the current node.
   *
   * This method iterates through all incoming edges of the current node and assigns a unique random vector
   * to the weight of each edge. The random vectors are generated with a specified size, and each element of the vector
   * falls within the specified range [from, to]. The type of the numeric data can also be specified.
   *
   * @param {Integer} size - The size (number of elements) of the random vector to be assigned to each incoming edge weight.
   * @param {number} [from=0] - The lower bound of the random number range for each vector element (inclusive).
   * @param {number} [to=0] - The upper bound of the random number range for each vector element (exclusive).
   * @param {NumericType} [type="float64"] - The numeric type of the random vector elements, defaulting to "float64".
   * @returns {GraphDataNode} The current instance of the graph data node, allowing for method chaining.
   */
  assignIncomingWeightsToUniqueRandomVector(
    size: Integer,
    from: number = 0,
    to: number = 0,
    type: NumericType = "float64",
  ): GraphDataNode {
    for (const [_, edge] of this.inputs) {
      edge.assignUniqueRandomVectorToWeight(size, from, to, type);
    }

    return this;
  }
  /**
   * Assigns unique random vector weights to all outgoing edges of the current node.
   *
   * This method iterates through all outgoing edges of the current node and assigns a unique random vector
   * to the weight of each edge. The random vectors are generated with a specified size, and each element of the vector
   * falls within the specified range [from, to]. The type of the numeric data can also be specified.
   *
   * @param {Integer} size - The size (number of elements) of the random vector to be assigned to each outgoing edge weight.
   * @param {Integer} [from=0] - The lower bound of the random number range for each vector element (inclusive).
   * @param {Integer} [to=1] - The upper bound of the random number range for each vector element (exclusive).
   * @param {NumericType} [type="float64"] - The numeric type of the random vector elements, defaulting to "float64".
   * @returns {GraphDataNode} The current instance of the graph data node, allowing for method chaining.
   */
  assignOutgoingWeightsToUniqueRandomVector(
    size: Integer,
    from: Integer = 0,
    to: Integer = 1,
    type: NumericType = "float64",
  ): GraphDataNode {
    for (const [_, edge] of this.outputs) {
      edge.assignUniqueRandomVectorToWeight(size, from, to, type);
    }

    return this;
  }

  /**
   * Assigns unique random vector weights to all incoming and outgoing edges of the current node.
   *
   * This method assigns unique random vector weights to the weights of all edges connected to the current node.
   * It updates both incoming and outgoing edges with random vectors of specified size, each element of which falls
   * within the specified range [from, to]. The type of numeric data for the vectors can also be specified.
   *
   * @param {Integer} size - The size (number of elements) of the random vector to be assigned to each edge weight.
   * @param {Integer} [from=0] - The lower bound of the random number range for each vector element (inclusive).
   * @param {Integer} [to=1] - The upper bound of the random number range for each vector element (exclusive).
   * @param {NumericType} [type="float64"] - The numeric type of the random vector elements, defaulting to "float64".
   * @returns {GraphDataNode} The current instance of the graph data node, allowing for method chaining.
   */
  assignUniqueRandomVectorToNeighbourhoodWeights(
    size: Integer,
    from: Integer = 0,
    to: Integer = 1,
    type: NumericType = "float64",
  ): GraphDataNode {
    this.assignIncomingWeightsToUniqueRandomVector(
      size,
      from,
      to,
      type,
    ).assignOutgoingWeightsToUniqueRandomVector(size, from, to, type);
    return this;
  }

  /**
   * Assigns random vector weights to all outgoing edges of the node.
   *
   * This method iterates through all outgoing edges of the current node and assigns a random vector
   * as the weight to each edge. The random vector is generated with the specified size, and each element
   * is within the range [from, to]. An optional seed value is used to control the randomness and ensure
   * reproducibility of the random number generation.
   *
   * @param {Integer} size - The size (number of elements) of the random vector to be assigned to each edge weight.
   * @param {Integer} [from=0] - The lower bound of the random number range for each vector element (inclusive).
   * @param {Integer} [to=1] - The upper bound of the random number range for each vector element (exclusive).
   * @param {Integer} [seed=123456] - An optional seed for the random number generator to ensure reproducibility
   * of the random vectors across the node's outgoing edges.
   * @returns {GraphDataNode} The current instance of the graph data node, allowing for method chaining.
   */
  assignOutgoingWeightsToRandomVector(
    size: Integer,
    from: number = 0,
    to: number = 1,
    seed: Integer = 123456,
  ): GraphDataNode {
    for (const [_, edge] of this.outputs) {
      edge.assignRandomVectorToWeight(size, from, to, seed++);
    }
    return this;
  }
  /**
   * Assigns random vector weights to all edges in the graph.
   *
   * This method iterates through all nodes in the graph and assigns random vector weights to each edge
   * in the neighborhood of every node. The random vectors are generated with a specified size and each element
   * falls within the specified range [from, to]. The randomness can be controlled using an optional seed value
   * to ensure reproducibility of the random number generation.
   *
   * @param {Integer} [size=1] - The size (number of elements) of the random vector to be assigned to each edge weight.
   * @param {Integer} [from=0] - The lower bound of the random number range for each vector element (inclusive).
   * @param {Integer} [to=1] - The upper bound of the random number range for each vector element (exclusive).
   * @param {Integer} [seed=123456] - An optional seed for the random number generator to ensure reproducibility
   * of the random vectors assigned to the edges.
   * @returns {Graph} The current instance of the graph, allowing for method chaining.
   */
  assignRandomVectorToNeighbourhoodWeights(
    size: Integer,
    from: number = 0,
    to: number = 1,
    seed: Integer = 123456,
  ): GraphDataNode {
    this.assignIncomingWeightsToRandomVector(
      size,
      from,
      to,
      seed++,
    ).assignOutgoingWeightsToRandomVector(size, from, to, seed++);
    return this;
  }

  /**
   * Assigns random matrix weights to all incoming edges of the node.
   *
   * This method iterates over all incoming edges of the current node and assigns a random matrix
   * as the weight to each edge. The matrix is generated with specified dimensions (rows and columns),
   * and each element in the matrix is a random number within the range [from, to]. The randomness can be controlled
   * using an optional seed value for reproducibility.
   *
   * @param {Integer} [rows=1] - The number of rows in the random matrix to be assigned as the weight.
   * @param {Integer} [columns=1] - The number of columns in the random matrix to be assigned as the weight.
   * @param {number} [from=0] - The lower bound of the random number range for each matrix element (inclusive).
   * @param {number} [to=1] - The upper bound of the random number range for each matrix element (exclusive).
   * @param {Integer} [seed=123456] - An optional seed for the random number generator to ensure reproducibility of the random matrix.
   * @param {NumericType} [type="float64"] - The type of the row element of the matrix.
   * @returns {GraphDataNode} The current instance of the graph data node, allowing for method chaining.
   */
  assignIncomingWeightsToRandomMatrix(
    rows: Integer = 1,
    columns: Integer = 1,
    from: number = 0,
    to: number = 1,
    seed: Integer = 123456,
    type: NumericType = "float64",
  ): GraphDataNode {
    for (const [_, edge] of this.inputs) {
      edge.assignRandomMatrixToWeight(rows, columns, from, to, seed, type);
    }

    return this;
  }

  /**
   * Assigns random matrix weights to all outgoing edges of the node.
   *
   * This method iterates over all outgoing edges of the current node and assigns a random matrix
   * as the weight to each edge. The matrix is generated with specified dimensions (rows and columns),
   * and each element in the matrix is a random number within the specified range [from, to]. The randomness can be controlled
   * using an optional seed value to ensure reproducibility.
   *
   * @param {Integer} [rows=1] - The number of rows in the random matrix to be assigned as the weight.
   * @param {Integer} [columns=1] - The number of columns in the random matrix to be assigned as the weight.
   * @param {number} [from=0] - The lower bound of the random number range for each matrix element (inclusive).
   * @param {number} [to=1] - The upper bound of the random number range for each matrix element (exclusive).
   * @param {Integer} [seed=123456] - An optional seed for the random number generator to ensure reproducibility of the random matrix.
   * @param {NumericType} [type="float64"] - The type of the row elements of the matrix.
   * @returns {GraphDataNode} The current instance of the graph data node, allowing for method chaining.
   */
  assignOutgoingWeightsToRandomMatrix(
    rows: Integer = 1,
    columns: Integer = 1,
    from: number = 0,
    to: number = 1,
    seed: Integer = 123456,
    type: NumericType = "float64",
  ): GraphDataNode {
    for (const [_, edge] of this.outputs) {
      edge.assignRandomMatrixToWeight(rows, columns, from, to, seed++, type);
    }

    return this;
  }

  /**
   * Assigns random matrix weights to both incoming and outgoing edges of the node.
   *
   * This method assigns random matrix weights to all incoming and outgoing edges connected to the current node.
   * The matrix is generated with specified dimensions (rows and columns), and each element in the matrix is a random
   * number within the specified range [from, to]. The randomness can be controlled using an optional seed value to ensure
   * reproducibility. The seed is incremented between assignments to ensure unique random matrices for each edge.
   *
   * @param {Integer} [rows=1] - The number of rows in the random matrix to be assigned as the weight.
   * @param {Integer} [columns=1] - The number of columns in the random matrix to be assigned as the weight.
   * @param {number} [from=0] - The lower bound of the random number range for each matrix element (inclusive).
   * @param {number} [to=1] - The upper bound of the random number range for each matrix element (exclusive).
   * @param {Integer} [seed=123456] - An optional seed for the random number generator to ensure reproducibility of the random matrices.
   * @param {NumericType} [type="float64"] - The type of the row elements of the matrix.
   * @returns {GraphDataNode} The current instance of the graph data node, allowing for method chaining.
   */
  assignRandomMatrixToNeighbourhoodWeights(
    rows: Integer = 1,
    columns: Integer = 1,
    from: number = 0,
    to: number = 1,
    seed: Integer = 123456,
    type: NumericType = "float64",
  ): GraphDataNode {
    this.assignIncomingWeightsToRandomMatrix(
      rows,
      columns,
      from,
      to,
      seed++,
      type,
    ).assignOutgoingWeightsToRandomMatrix(
      rows,
      columns,
      from,
      to,
      seed++,
      type,
    );
    return this;
  }

  /**
   * Assigns a unique random matrix as the weight to each incoming edge of the node.
   *
   * This method generates a unique random matrix with the specified number of rows and columns,
   * and assigns it as the weight to each incoming edge of the node. The values in the matrix are
   * randomly generated within the specified range [from, to]. The numeric type for the matrix elements
   * can be specified (e.g., "float64").
   *
   * @param {Integer} [rows=1] - The number of rows in the random matrix to be assigned as the weight.
   * @param {Integer} [columns=1] - The number of columns in the random matrix to be assigned as the weight.
   * @param {number} [from=0] - The lower bound of the random number range for each matrix element (inclusive).
   * @param {number} [to=0] - The upper bound of the random number range for each matrix element (exclusive).
   * @param {NumericType} [type="float64"] - The numeric type for the matrix elements (e.g., "float64", "int32").
   * @returns {GraphDataNode} The current instance of the graph data node, allowing for method chaining.
   */
  assignIncomingWeightsToUniqueRandomMatrix(
    rows: Integer = 1,
    columns: Integer = 1,
    from: number = 0,
    to: number = 0,
    type: NumericType = "float64",
  ): GraphDataNode {
    for (const [_, edge] of this.inputs) {
      edge.assignUniqueRandomMatrixToWeight(rows, columns, from, to, type);
    }

    return this;
  }

  /**
   * Assigns unique random matrices as weights to all outgoing edges of the node.
   *
   * This method iterates through all outgoing edges of the current node and assigns a unique random
   * matrix to each edge's weight. The matrix is generated with the specified dimensions (rows and columns),
   * and each element in the matrix is a unique random number within the specified range [from, to]. The
   * type of numeric values in the matrix can also be specified (e.g., "float64").
   *
   * @param {Integer} [rows=1] - The number of rows in the random matrix to be assigned as the weight.
   * @param {Integer} [columns=1] - The number of columns in the random matrix to be assigned as the weight.
   * @param {number} [from=0] - The lower bound of the random number range for each matrix element (inclusive).
   * @param {number} [to=0] - The upper bound of the random number range for each matrix element (exclusive).
   * @param {NumericType} [type="float64"] - The numeric type for the matrix elements (e.g., "float64", "int32").
   * @returns {GraphDataNode} The current instance of the graph data node, allowing for method chaining.
   */
  assignOutgoingWeightsToUniqueRandomMatrix(
    rows: Integer = 1,
    columns: Integer = 1,
    from: number = 0,
    to: number = 1,
    type: NumericType = "float64",
  ): GraphDataNode {
    for (const [_, edge] of this.outputs) {
      edge.assignUniqueRandomMatrixToWeight(rows, columns, from, to, type);
    }

    return this;
  }

  /**
   * Assigns unique random matrices as weights to both incoming and outgoing edges of the node.
   *
   * This method first assigns a unique random matrix to the weight of each incoming edge, then assigns
   * a unique random matrix to the weight of each outgoing edge. The matrices are generated with the
   * specified dimensions (rows and columns), and each element is a unique random number within the
   * specified range [from, to]. The type of numeric values in the matrix can also be specified (e.g., "float64").
   *
   * @param {Integer} [rows=1] - The number of rows in the random matrix to be assigned as the weight.
   * @param {Integer} [columns=1] - The number of columns in the random matrix to be assigned as the weight.
   * @param {number} [from=0] - The lower bound of the random number range for each matrix element (inclusive).
   * @param {number} [to=1] - The upper bound of the random number range for each matrix element (exclusive).
   * @param {NumericType} [type="float64"] - The numeric type for the matrix elements (e.g., "float64", "int32").
   * @returns {GraphDataNode} The current instance of the graph data node, allowing for method chaining.
   */
  assignUniqueRandomMatrixToNeighbourhoodWeights(
    rows: Integer = 1,
    columns: Integer = 1,
    from: number = 0,
    to: number = 1,
    type: NumericType = "float64",
  ): GraphDataNode {
    this.assignIncomingWeightsToUniqueRandomMatrix(
      rows,
      columns,
      from,
      to,
      type,
    ).assignOutgoingWeightsToUniqueRandomMatrix(rows, columns, from, to, type);

    return this;
  }

  /**
   * Assigns a random number to the node value
   * within the specified range and seed.
   *
   * @param {number} from - The minimum value of the random range.
   * @param {number} to - The maximum value of the random range.
   * @param {Integer} seed - The seed for the random number generator.
   * @returns {GraphDataNode} - The current node instance.
   */
  assignRandomNumberToValue(
    from: number,
    to: number,
    seed: Integer,
  ): GraphDataNode {
    seed <<= 0;
    const k = (seed / 127773) >> 0;
    seed = (16807 * (seed - k * 127773) - k * 2836) >> 0;
    if (seed < 0) seed += 2147483647;
    this.value = from + (to - from) * seed * 4.656612875e-10;

    return this;
  }

  /**
   * Assigns a unique random number to the node value
   * within the specified range.
   *
   * @param {number} from - The minimum value of the random range.
   * @param {number} to - The maximum value of the random range.
   * @returns {GraphDataNode} - The current node instance.
   */
  assignUniqueRandomNumberToValue(from: number, to: number): GraphDataNode {
    this.value = from + (to - from) * Math.random();

    return this;
  }

  /**
   * Assigns a random vector to the node value
   * within the specified size, seed and min and max borders.
   * @param {Integer} size - a positive integer which represents
   * the size of the vector.
   * @param {number} from - the minimum border of the value.
   * @param {number} to - the maximum border of the value.
   * @param {Integer} seed - a positive integer used for seed of
   * the random number generator.
   * @returns {GraphDataNode} The updated node instance.
   */
  assignRandomVectorToValue(
    size: Integer,
    from: number,
    to: number,
    seed: Integer,
    type: NumericType = "float64",
  ): GraphDataNode {
    const matrix = [[]];
    this.value = matrix;

    return this;
  }

  /**
   * Assigns an unique random vector to the node value.
   * @param {Integer} size - a positive integer which represents
   * the size of the vector (number of elements).
   * @param {number} from - the minimum number border of the vector
   * elements.
   * @param {number} to - the maximum number border of the vector
   * elements.
   * @returns {GraphDataNode} The updated node instance.
   */
  assignUniqueRandomVectorToValue(
    size: Integer,
    from: number,
    to: number,
    type: NumericType = "float64",
  ): GraphDataNode {
    const matrix = [[]];
    this.value = matrix;

    return this;
  }

  /**
   * Assigns random matrix to the value property of the node.
   * @param {Integer} rows - the number of the rows of the matrix.
   * @param {Integer} columns - the number of the columns of the matrix.
   * @param {number} from - the minimum number border of the matrix elements.
   * @param {number} to - the maximum number border of the matrix elements.
   * @param {Integer} seed - an large positive integer, which is used as seed
   * in the random number generator function for the matrix elements.
   * @returns {GraphDataNode} The updated node instance.
   */
  assignRandomMatrixToValue(
    rows: Integer,
    columns: Integer,
    from: number,
    to: number,
    seed: Integer,
    type: NumericType = "float64",
  ): GraphDataNode {
    const matrix = [[]];
    this.value = matrix;

    return this;
  }

  /**
   * Assigns an unique random matrix to the value property of the node instance.
   * @param {Integer} rows - the rows of the matrix.
   * @param {Integer} columns - the columns of the matrix.
   * @param {number} from - the minimum number border of the matrix elements.
   * @param {number} to - the maximum numeric value of the matrix elements.
   * @returns {GraphDataNode} The updated node instance.
   */
  assignUniqueRandomMatrixToValue(
    rows: Integer,
    columns: Integer,
    from: number,
    to: number,
    type: NumericType = "float64",
  ): GraphDataNode {
    const matrix = [[]];
    this.value = matrix;

    return this;
  }
}
