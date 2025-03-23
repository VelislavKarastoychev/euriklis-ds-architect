"use strict";

import type {
  AbstractAttributesType,
  EdgeType,
  GraphEdgeType,
  GraphNodeType,
  GraphOptionsType,
  GraphType,
  GraphValuesDomain,
  Integer,
  NodeType,
  NumericType,
  UpdatableEdgeType,
  UpdatableNodeType,
} from "../../Types";
import {
  ifEdgeExistsThrow,
  ifIsNotArrayOfStringsOrNodeTypesThrow,
  ifNodeExistsThrow,
  ifNodeNotExistsThrow,
  ifSourceNodeDoesNotExistThrow,
  ifTargetNodeDoesNotExistThrow,
} from "../Decorators";

import {
  IncorrectEdgeDeclaration,
  IncorrectNodeName,
  IncorrectNodesDeclaration,
} from "../Errors";
import { Queue } from "../Queue";
import * as models from "./Models";

/**
 * This class implements the Graph data structure
 * concept. A graph is an abstract data structure,
 * which contans a set of points called also nodes,
 * and a sub set of the Cartesion product of these
 * nodes, called edges or arcs. For the full description
 * of a node is nessesary to use an object (abstract dictionary)
 * structure, which includes the keys (properties):
 * attributes and name (id). The id or the name of the
 * node has to be a string, while the attributes is
 * also an object (or dictionary abstract structure).
 * It is good practice the attributes of each node
 * to contain the propery "value". The value of a node
 * is usually a real number, but in our implementetion
 * we allow for the value of a node to be a number, vector,
 * Matrix (Typed or numeric) and collection of matrices.
 * The edges are a subset of the Cartesian product of the
 * nodes space, so an edge has to be fully described
 * from an object (or abstract dictionary structure),
 * which contains the properies (keys) "source", "target"
 * and "attributes". It is good practice the attributes
 * property to contains a property "weight". The weight is
 * a concept similar to the "value" concept in the nodes.
 * We implement the Graph useing the Map data structure
 * of the JavaScript (TlypeScript) language. It was found
 * that this structure is more time efficient than the
 * AVL data structure and the Heap.  The Map is a realization
 * of the hash table data structure in JavaScript and allows
 * the execution of operations like insertion, deletion, searching
 * and updationg for a constant time (In fact the complexity of all
 * these operations is 0(1)).
 */
export class Graph {
  /**
   * Indicates whether the graph is simple (no loops or multiple edges).
   * @private
   * @type {boolean}
   */
  protected __simple__: boolean = false;

  /**
   * Indicates whether the graph is weighted (edges have weights).
   * @private
   * @type {boolean}
   */
  protected __weighted__: boolean = true;

  /**
   * Indicates whether the graph is symmetric (edges are bidirectional).
   * @private
   * @type {boolean}
   */
  protected __symmetric__: boolean = false;

  /**
   * Internal representation of the graph as a Map.
   * The keys are node IDs and the values are the corresponding node objects.
   * @private
   * @type {GraphType}
   */
  protected __G__: GraphType = new Map();

  /**
   * Generates a new graph with a specified number of nodes.
   *
   * @param {Integer} count - The number of nodes to generate.
   * @param {(NodeType | string)[]} [nodes] - Optional array of nodes or node names to include in the graph.
   * @returns {Graph} The generated graph instance.
   * @throws {IncorrectNodesDeclaration} If the nodes parameter is not an array of NodeType or string.
   */
  @ifIsNotArrayOfStringsOrNodeTypesThrow(IncorrectNodesDeclaration)
  public static generateGraphWithNodes(
    count: Integer,
    nodes?: (NodeType | string)[],
  ): Graph {
    const g = new Graph();
    const G = g.__G__;
    models.SetNodesAutomatically(G, count, nodes);

    return g;
  }

  /**
   * Creates an instance of a Graph.
   *
   * @constructor
   * @param {GraphOptionsType | null} [options=null] - The options to initialize the graph with.
   * @param {boolean} [options.simple] - Indicates if the graph is simple (no loops or multiple edges).
   * @param {boolean} [options.weighted] - Indicates if the graph is weighted.
   * @param {boolean} [options.symmetric] - Indicates if the graph is symmetric.
   * @param {NodeType[]} [options.nodes] - An array of nodes to initialize the graph with.
   * @param {EdgeType[]} [options.edges] - An array of edges to initialize the graph with.
   */
  constructor(options: GraphOptionsType | null = null) {
    if (options) {
      this.simple = options.simple;
      this.weighted = options.weighted;
      this.symmetric = options.symmetric;
      this.nodes = options.nodes;
      this.edges = options.edges;
    }
  }

  /**
   * Gets the current value indicating if the graph is simple.
   *
   * @returns {boolean} - `true` if the graph is simple (no loops
   * or multiple edges), otherwise `false`.
   */
  get simple(): boolean {
    return this.__simple__;
  }

  /**
   * Sets whether the graph is simple.
   *
   * If `isSimple` is `undefined`, the
   * value remains unchanged.
   *
   * @param {boolean | undefined} isSimple - Indicates
   * if the graph should be simple. If `undefined`,
   * the value is not changed.
   */
  set simple(isSimple: boolean | undefined) {
    if (isSimple !== undefined) this.__simple__ = isSimple;
  }

  /**
   * Gets the current value indicating if the
   * graph is weighted.
   *
   * @returns {boolean} - `true` if the graph is
   * weighted (edges have weights), otherwise `false`.
   */
  get weighted(): boolean {
    return this.__weighted__;
  }

  /**
   * Sets whether the graph is weighted.
   *
   * If `isWeighted` is `undefined`, the
   * value remains unchanged.
   * If `isWeighted` is false, then all
   * the weights will be set to unit automatically.
   *
   * @param {boolean | undefined} isWeighted - Indicates
   * if the graph should be weighted. If `undefined`,
   * the value is not changed.
   */
  set weighted(isWeighted: boolean | undefined) {
    const wasWeighted = this.weighted;
    if (isWeighted !== undefined) {
      this.__weighted__ = isWeighted;
      if (wasWeighted && !isWeighted) {
        models.AssignWeightsToUnit(this.__G__);
      }
    }
  }

  /**
   * Checks if the graph is empty.
   *
   * @returns {boolean} - `true` if
   * the graph has no nodes, otherwise `false`.
   */
  get empty(): boolean {
    return this.__G__.size === 0;
  }

  /**
   * Gets the symmetry property of the graph.
   *
   * @returns {boolean} - `true` if the graph
   * is symmetric, otherwise `false`.
   */
  get symmetric(): boolean {
    return this.__symmetric__;
  }

  /**
   * Sets the symmetry property of the graph.
   *
   * @param {boolean | undefined} isSymmetric - If `true`, sets
   * the graph to be symmetric; if `false`, sets
   * it to be asymmetric;
   * if `undefined`, does not change the current symmetry setting.
   */
  set symmetric(isSymmetric: boolean | undefined) {
    const wasSymmetric = this.symmetric;
    if (isSymmetric !== undefined) {
      this.__symmetric__ = isSymmetric;
      if (!wasSymmetric && isSymmetric) {
        models.Symmetrize(this.__G__, "average");
      }
    }
  }

  /**
   * Retrieves an array of nodes in the graph.
   *
   * Each node is represented as an object with
   * a `name` and `attributes`.
   *
   * @returns {NodeType[]} - An array of nodes,
   * where each node is an object containing the
   * `name` and `attributes` of the node.
   */
  get nodes(): NodeType[] {
    const nodes: NodeType[] = [];
    for (const [name, node] of this.__G__) {
      const { attributes } = node;
      nodes.push({ name, attributes });
    }

    return nodes;
  }

  /**
   * Sets the nodes of the graph.
   *
   * This method generates the graph's nodes
   * based on the provided array. If `nodes` is
   * defined, it clears the existing nodes and
   * uses the `SetNodesAutomatically` utility
   * function to set the nodes in the graph.
   * The nodes can be either strings (representing node names) or
   * `NodeType` objects. If `nodes` is undefined, no changes are made to the graph's nodes.
   *
   * @param {string[] | NodeType[] | undefined} nodes - An array of nodes to set in the graph.
   *    Each node can be either a string (node name) or a `NodeType` object. If undefined,
   *    the existing nodes remain unchanged.
   */
  set nodes(nodes: (string | NodeType)[] | undefined) {
    if (nodes) {
      this.clear();
      models.SetNodesAutomatically(this.__G__, Infinity, nodes);
    }
  }

  /**
   * Retrieves all edges in the graph.
   *
   * This getter method returns an array of `EdgeType` objects representing all the edges
   * in the graph.
   * @returns {EdgeType[]} An array of `EdgeType` objects, where each object represents an edge
   *    with `source`, `target`, and `attributes`.
   */
  get edges(): EdgeType[] {
    return models.GetGraphEdges(this.__G__);
  }

  /**
   * Sets the edges of the graph.
   *
   * This setter method updates the graph by removing all existing edges and then
   * adding new edges based on the provided `edges` array.
   * If the provided `edges` is `undefined`,
   * no changes are made to the edges of the graph.
   *
   * @param {EdgeType[] | undefined} edges - An optional array of `EdgeType` objects representing
   *    the edges to be added to the graph. Each edge object contains `source`, `target`, and
   *    `attributes`. If `undefined`, the graph's edges remain unchanged.
   */
  set edges(edges: EdgeType[] | undefined) {
    if (edges) {
      this.removeAllEdges(); // complexity O(V);
      models.SetGraphEdges(this.__G__, edges); // complexity O(E)
    }
  }

  /**
   * This getter method returns the order of
   * the graph, which represents the total number of
   * nodes present.
   *
   * @returns {Integer} The number of nodes in the graph.
   */
  get order(): Integer {
    return this.__G__.size;
  }

  /**
   * Gets the size, i.e. the total number of edges in the graph.
   *
   * @returns {Integer} The total number of edges in the graph.
   */
  get size(): Integer {
    const G: GraphType = this.__G__;
    let edgeCount = 0;
    for (const [_, v] of G) edgeCount += v.inputs.size;

    return edgeCount;
  }

  /**
   * Converts the graph into a fully connected graph, including loops.
   *
   * This method ensures that every node in the graph is connected to every other node, including itself.
   * Each edge is assigned a weight of 1. This operation modifies the graph by adding edges where none existed before.
   *
   * @returns {Graph} The updated graph instance, now fully connected.
   */
  makeFullyConnected(): Graph {
    models.PopulateGraphWithFullEdgesSet(this.__G__);

    return this;
  }

  /**
   * Assigns random values to all nodes in the graph within a specified range.
   *
   * This method updates each node's attributes in the graph to random values. The values are generated within the
   * range defined by the `from` and `to` parameters. The `seed` parameter ensures that the random values can be
   * reproduced exactly the same way in subsequent calls.
   *
   * @param {number} [from=0] - The minimum value (inclusive) for the random values.
   * @param {number} [to=1] - The maximum value (exclusive) for the random values.
   * @param {Integer} [seed=123456] - The seed for the random number generator to ensure reproducibility.
   * @returns {Graph} The updated graph instance with nodes assigned random values.
   */
  assignRandomValuesToNodes(
    from: number = 0,
    to: number = 1,
    seed: Integer = 123456,
  ): Graph {
    const G: GraphType = this.__G__;
    models.AssignRandomValuesToGraphNodes(G, from, to, seed);

    return this;
  }

  /**
   * Assigns unique random values to all nodes
   * in the graph within a specified range.
   *
   * This method updates each node's attributes
   * in the graph to unique random values. The
   * values are generated within the range defined
   * by the `from` and `to` parameters. Each value
   * assigned to a node is guaranteed to be unique.
   *
   * @param {number} [from=0] - The minimum value
   * (inclusive) for the random values.
   * @param {number} [to=1] - The maximum value
   * (exclusive) for the random values.
   * @returns {Graph} The updated graph instance
   * with nodes assigned unique random values.
   */
  assignUniqueRandomValuesToNodes(
    from: number = 0,
    to: number = 1,
  ): Graph {
    const G: GraphType = this.__G__;
    models.AssignUniqueRandomValuesToGraphNodes(G, from, to);

    return this;
  }

  /**
   * Assigns random matrix values to
   * all nodes in the graph.
   *
   * This method updates each node's
   * attributes in the graph with random
   * matrices. The matrices are generated
   * with values within the range defined
   * by the `from` and `to` parameters.
   * The shape and type of the matrices
   * are determined by the `rows`, `columns`,
   * and `type` parameters. The `seed` parameter
   * ensures reproducibility of the random values.
   *
   * @param {number} [from=0] - The minimum value
   * (inclusive) for the random matrix values.
   * @param {number} [to=1] - The maximum value
   * (exclusive) for the random matrix values.
   * @param {Integer} rows - The number of rows
   * in each matrix.
   * @param {Integer} columns - The number of columns
   * in each matrix.
   * @param {NumericType} [type="float64"] - The data
   * type of the matrix values.
   * @param {Integer} [seed=123456] - The seed for the
   * random number generator, allowing reproducibility.
   * @returns {Graph} The updated graph instance with
   * nodes assigned random matrix values.
   */
  assignRandomMatrixValuesToNodes(
    from: number = 0,
    to: number = 1,
    rows: Integer,
    columns: Integer,
    type: NumericType = "float64",
    seed: Integer = 123456,
  ): Graph {
    const G = this.__G__;
    models.AssignRandomMatrixValuesToGraphNodes(G, from, to, seed, {
      type,
      rows,
      columns,
    });

    return this;
  }

  /**
   * Assigns unique random matrix values
   * to all nodes in the graph.
   *
   * This method updates each node's attributes
   * in the graph with unique random matrices.
   * The matrices are generated with values within
   * the range defined by the `from` and `to` parameters.
   * The shape and type of the matrices are
   * determined by the `rows`, `columns`, and `type` parameters.
   *
   * @param {number} [from=0] - The minimum value
   * (inclusive) for the random matrix values.
   * @param {number} [to=1] - The maximum value
   * (exclusive) for the random matrix values.
   * @param {Integer} rows - The number of rows in each matrix.
   * @param {Integer} columns - The number of columns in each matrix.
   * @param {NumericType} [type="float64"] - The data type of the matrix values.
   * @returns {Graph} The updated graph instance with nodes
   * assigned unique random matrix values.
   */
  assignUniqueRandomMatrixValuesToNodes(
    from: number = 0,
    to: number = 1,
    rows: Integer,
    columns: Integer,
    type: NumericType = "float64",
  ): Graph {
    const G = this.__G__;
    models.AssignUniqueRandomMatrixValuesToGraphNodes(G, from, to, {
      type,
      rows,
      columns,
    });

    return this;
  }

  /**
   * Assigns random weights to
   * all edges in the graph.
   *
   * This method updates each edge's weight
   * attribute in the graph with random values.
   * The weights are generated
   * within the range defined by the `from` and
   * `to` parameters. The `seed` parameter ensures
   * that the random values can be reproduced.
   *
   * @param {number} [from=0] - The minimum weight
   * value (inclusive) for the random weights.
   * @param {number} [to=1] - The maximum weight value
   * (exclusive) for the random weights.
   * @param {Integer} [seed=123456] - The seed for the
   * random number generator to ensure reproducibility.
   * @returns {Graph} The updated graph instance with
   * edges assigned random weights.
   */
  assignRandomWeightsToEdges(
    from: number = 0,
    to: number = 1,
    seed: Integer = 123456,
  ): Graph {
    const G = this.__G__;
    models.AssignRandomWeightsToGraphEdges(G, from, to, seed);

    return this;
  }

  /**
   * Assigns unique random weights to
   * all edges in the graph.
   *
   * This method updates each edge's weight
   * attribute in the graph with unique random
   * values. The weights are generated within
   * the range specified by the `from` and `to`
   * parameters. Unlike other weight assignment methods,
   * this ensures that each edge has a unique weight.
   *
   * @param {number} [from=0] - The minimum weight value
   * (inclusive) for the random weights.
   * @param {number} [to=1] - The maximum weight value
   * (exclusive) for the random weights.
   * @returns {Graph} The updated graph instance with
   * edges assigned unique random weights.
   */
  assignUniqueRandomWeightsToEdges(
    from: number = 0,
    to: number = 1,
  ): Graph {
    const G = this.__G__;
    models.AssignUniqueRandomWeightsToGraphEdges(G, from, to);

    return this;
  }

  /**
   * Assigns random matrix weights to
   * all edges in the graph.
   *
   * This method updates each edge's weight
   * attribute in the graph with random matrices.
   * The matrices are generated with values within
   * the range defined by the `from` and `to` parameters.
   * The matrix dimensions and type can be specified,
   * and the `seed` parameter ensures reproducibility
   * of the generated matrices.
   *
   * @param {number} [from=0] - The minimum value
   * (inclusive) for the random weights in the matrix.
   * @param {number} [to=1] - The maximum value
   * (exclusive) for the random weights in the matrix.
   * @param {Integer} rows - The number of rows in each matrix.
   * @param {Integer} columns - The number of columns in each matrix.
   * @param {NumericType} [type="float64"] - The type of numeric
   * values in the matrix (e.g., "float64", "int32").
   * @param {Integer} [seed=123456] - The seed for the random
   * number generator, allowing reproducibility of the matrices.
   * @returns {Graph} The updated graph instance with edges
   * assigned random matrix weights.
   */
  assignRandomMatrixWeightsToEdges(
    from: number = 0,
    to: number = 1,
    rows: Integer,
    columns: Integer,
    type: NumericType = "float64",
    seed: Integer = 123456,
  ): Graph {
    const G = this.__G__;
    models.AssignRandomMatrixWeightsToGraphEdges(G, from, to, seed, {
      type,
      rows,
      columns,
    });

    return this;
  }

  /**
   * Assigns unique random matrix weights
   * to all edges in the graph.
   *
   * This method updates each edge's weight
   * attribute in the graph with unique random
   * matrices. The matrices are generated with
   * values within the range defined by the `from`
   * and `to` parameters. Each edge receives a unique
   * matrix based on the specified dimensions and numeric type.
   *
   * @param {number} [from=0] - The minimum value
   * (inclusive) for the random weights in the matrix.
   * @param {number} [to=1] - The maximum value
   * (exclusive) for the random weights in the matrix.
   * @param {Integer} rows - The number of rows in each matrix.
   * @param {Integer} columns - The number of columns in each matrix.
   * @param {NumericType} [type="float64"] - The type of numeric
   * values in the matrix (e.g., "float64", "int32").
   * @returns {Graph} The updated graph instance with
   * edges assigned unique random matrix weights.
   */
  assignUniqueRandomMatrixWeightsToEdges(
    from: number = 0,
    to: number = 1,
    rows: Integer,
    columns: Integer,
    type: NumericType = "float64",
  ): Graph {
    const G = this.__G__;
    models.AssignUniqueRandomMatrixWeightsToGraphEdges(G, from, to, {
      type,
      rows,
      columns,
    });

    return this;
  }

  /**
   * Checks if a node with the specified
   * name exists in the graph.
   *
   * This method returns a boolean indicating
   * whether a node with the given name is present in the graph.
   *
   * @param {string} name - The name of the node to check for existence.
   * @returns {boolean} True if the node exists in the graph, false otherwise.
   */
  hasNode(name: string): boolean {
    return this.__G__.has(name);
  }

  /**
   * Adds a node with the specified name and attributes to the graph.
   *
   * This method creates a new node in the graph with the given name and attributes.
   * If the attributes are not provided, it defaults to an object with a `value` of 1.
   * Throws an error if a node with the specified name already exists in the graph.
   *
   * @param {string} name - The name of the node to be added.
   * @param {Object} [attributes] - An optional object containing the attributes of the node.
   * @param {GraphValuesDomain} [attributes.value=1] - The default value attribute of the node.
   * @returns {Graph} The updated graph instance with the newly added node.
   * @throws {IncorrectNodeName} Throws an error if a node with the specified name already exists.
   */
  @ifNodeExistsThrow(IncorrectNodeName)
  addNode(
    options: {
      name: string;
      attributes?: { [prop: string]: any; value: GraphValuesDomain };
    } | string,
  ): Graph {
    const G = this.__G__;
    const {name, attributes} = options as {name: string; attributes: AbstractAttributesType & {value: GraphValuesDomain}};
    G.set(name, {
      id: name,
      attributes,
      inputs: new Map(),
      outputs: new Map(),
    });

    return this;
  }

  /**
   * Adds an edge between two nodes in the graph.
   *
   * This method creates a new edge from the
   * source node to the target node with the
   * specified attributes.
   * Throws an error if the source node, target
   * node, or the edge already exists in the graph.
   *
   * @param {EdgeType} options - An object containing
   * the details of the edge to be added.
   * @param {string} options.source - The name of the source node.
   * @param {string} options.target - The name of the target node.
   * @param {Object} [options.attributes] - An optional object
   * containing the attributes of the edge.
   * @returns {Graph} The updated graph instance with the newly added edge.
   * @throws {Error} Throws an error if the source node,
   * target node, or edge already exists.
   */
  @ifSourceNodeDoesNotExistThrow(IncorrectEdgeDeclaration("addEdge"))
  @ifTargetNodeDoesNotExistThrow(IncorrectEdgeDeclaration("addEdge"))
  @ifEdgeExistsThrow(IncorrectEdgeDeclaration("addEdge"))
  addEdge(options: EdgeType): Graph {
    const G = this.__G__;
    const { source, target, attributes } = options;
    const sourceNode = G.get(source);
    const targetNode = G.get(target);
    sourceNode?.outputs.set(target, { id: target, attributes });
    targetNode?.inputs.set(source, { id: source, attributes });

    return this;
  }

  /**
   * Retrieves a node by its name from the graph.
   *
   * This method returns the node with the specified
   * name if it exists in the graph.
   * If the node does not exist, it returns null.
   *
   * @param {string} name - The name of the node to be retrieved.
   * @returns {NodeType | null} The node object containing the
   * name and attributes, or null if the node does not exist.
   */
  getNodeById(name: string): NodeType | null {
    const node = this.__G__.get(name);
    if (node) return { name, attributes: node.attributes };

    return null;
  }

  /**
   * Retrieves an edge between two nodes in the graph.
   *
   * This method returns the edge object with the
   * specified source and target nodes if it exists.
   * If the edge does not exist, it returns null.
   *
   * @param {string} source - The name of the source node.
   * @param {string} target - The name of the target node.
   * @returns {EdgeType | null} The edge object containing
   * the source, target, and attributes, or null if the edge
   * does not exist.
   */
  getEdge(source: string, target: string): EdgeType | null {
    const G = this.__G__;
    const sourceNode = G.get(source);
    if (!sourceNode) return null;
    const edge = sourceNode.outputs.get(target);
    if (!edge) return null;
    return { source, target: edge.id, attributes: edge.attributes };
  }

  /**
   * Checks if an edge exists between two nodes
   * in the graph.
   *
   * This method returns a boolean indicating whether
   * there is an edge from the source node to the target node.
   *
   * @param {string} source - The name of the source node.
   * @param {string} target - The name of the target node.
   * @returns {boolean} True if the edge exists, false otherwise.
   */
  hasEdge(source: string, target: string): boolean {
    const G = this.__G__;
    const sourceNode = G.get(source);
    if (!sourceNode) return false;
    return sourceNode.outputs.has(target);
  }

  /**
   * Updates the attributes of an existing node in the graph.
   *
   * @param {NodeType} node - The node object containing the
   * name and new attributes to be updated.
   * @param {string} node.name - The name (ID) of the node to be updated.
   * @param {Object} node.attributes - The new attributes to update the node with.
   * @param {GraphValuesDomain} node.attributes.value - The value of the node,
   * which can be a number, array, numeric array, matrix, or numeric matrix.
   * @returns {Graph} - Returns the graph instance to allow for method chaining.
   * @throws {IncorrectNodeName} - Throws an error if the node with the specified
   * name does not exist in the graph.
   *
   * @example
   * const graph = new Graph();
   * graph.addNode("A", { value: 1 });
   * graph.updateNode({ name: "A", attributes: { value: 2 } });
   */
  @ifNodeNotExistsThrow(IncorrectNodeName)
  updateNode(node: UpdatableNodeType): Graph {
    const { name, attributes } = node;
    const G: GraphType = this.__G__;
    const vertex = G.get(name) as GraphNodeType;
    Object.assign(vertex.attributes as object, attributes);

    return this;
  }

  /**
   * Updates the attributes of an existing edge in the graph.
   *
   * @param {UpdatableEdgeType} edge - The edge object containing
   * the source, target, and new attributes to be updated.
   * @returns {Graph} - Returns the graph instance to allow for method chaining.
   * @throws {Error} - Throws an error if the source or target node does not
   * exist in the graph.
   *
   * @example
   * const graph = new Graph();
   * graph.addNode("A", { value: 1 });
   * graph.addNode("B", { value: 2 });
   * graph.addEdge({ source: "A", target: "B", attributes: { weight: 1 } });
   * graph.updateEdge({ source: "A", target: "B", attributes: { weight: 2 } });
   */
  @ifSourceNodeDoesNotExistThrow(IncorrectEdgeDeclaration("updateEdge"))
  @ifTargetNodeDoesNotExistThrow(IncorrectEdgeDeclaration("updateEdge"))
  updateEdge(edge: UpdatableEdgeType): Graph {
    models.UpdateEdge(this.__G__, edge);
    return this;
  }

  /**
   * Retrieves the incoming neighbourhood of a
   * specified target node in the graph.
   * The incoming neighbourhood includes all nodes
   * and edges that have edges directed towards the target node.
   *
   * @param {string} target - The ID of the target node
   * whose incoming neighbourhood is to be retrieved.
   * @returns {{ nodes: NodeType[], edges: EdgeType[] } | null} - An object
   * containing the nodes and edges in the incoming neighbourhood,
   * or null if the target node does not exist.
   *
   * @example
   * const graph = new Graph();
   * graph.addNode("A", { value: 1 });
   * graph.addNode("B", { value: 2 });
   * graph.addEdge({ source: "A", target: "B", attributes: { weight: 1 } });
   * const incomingNeighbourhood = graph.getIncomingNeighbourhood("B");
   * if (incomingNeighbourhood) {
   *   console.log(incomingNeighbourhood.nodes); // [{ name: "A", attributes: { value: 1 } }]
   *   console.log(incomingNeighbourhood.edges);
   *   // [{ source: "A", target: "B", attributes: { weight: 1 } }]
   * }
   */
  getIncomingNeighbourhood(
    target: string,
  ): { nodes: NodeType[]; edges: EdgeType[] } | null {
    const node = this.__G__.get(target);
    const neighbourhood = node?.inputs;
    if (neighbourhood) {
      const nodes = [];
      const edges = [];
      for (const [source, u] of neighbourhood) {
        const { attributes } = u;
        nodes.push(this.getNodeById(source) as NodeType);
        edges.push({ source, target, attributes });
      }

      return { nodes, edges };
    }

    return null;
  }

  /**
   * Retrieves the outgoing neighbourhood of a
   * specified source node in the graph.
   * The outgoing neighbourhood includes all nodes
   * and edges that have edges originating from the source node.
   *
   * @param {string} source - The ID of the source node whose
   * outgoing neighbourhood is to be retrieved.
   * @returns {{ nodes: NodeType[], edges: EdgeType[] } | null} - An
   * object containing the nodes and edges in the outgoing neighbourhood,
   * or null if the source node does not exist.
   *
   * @example
   * const graph = new Graph();
   * graph.addNode("A", { value: 1 });
   * graph.addNode("B", { value: 2 });
   * graph.addEdge({ source: "A", target: "B", attributes: { weight: 1 } });
   * const outgoingNeighbourhood = graph.getOutgoingNeighbourhood("A");
   * if (outgoingNeighbourhood) {
   *   console.log(outgoingNeighbourhood.nodes);
   *   // [{ name: "B", attributes: { value: 2 } }]
   *   console.log(outgoingNeighbourhood.edges);
   *   // [{ source: "A", target: "B", attributes: { weight: 1 } }]
   * }
   */
  getOutgoingNeighbourhood(
    source: string,
  ): { nodes: NodeType[]; edges: EdgeType[] } | null {
    const node = this.__G__.get(source);
    const neighbourhood = node?.outputs;
    if (neighbourhood) {
      const nodes = [];
      const edges = [];
      for (const [target, v] of neighbourhood) {
        const { attributes } = v;
        nodes.push(this.getNodeById(target) as NodeType);
        edges.push({ source, target, attributes });
      }

      return { nodes, edges };
    }

    return null;
  }

  /**
   * Creates a subgraph based on a callback function.
   *
   * This method generates a new subgraph by including
   * nodes for which the callback function returns true.
   *
   * @param {(node: GraphNodeType, g: Graph) => boolean} callback - A
   * function that takes a node and the graph as arguments and returns
   * a boolean. If the function returns true for a node, that node is
   * included in the subgraph.
   * @returns {Graph} A new graph instance representing the subgraph.
   */
  subgraph(callback: (node: GraphNodeType, g: Graph) => boolean): Graph {
    const g = new Graph();
    for (const [name, node] of this.__G__) {
      if (callback(node, this)) g.addNode({name, attributes: node.attributes});
    }

    return g;
  }

  /**
   * Clears the graph by removing all nodes and edges.
   *
   * This method empties the graph, removing all nodes
   * and their associated edges.
   *
   * @returns {Graph} The updated graph instance, now empty.
   */
  clear(): Graph {
    const G = this.__G__;
    if (G.size) G.clear();

    return this;
  }

  /**
   * Deletes a node from the graph by its name (id).
   *
   * @param {string} [name] - The name (id) of the node to delete.
   * If not provided, no action is taken.
   * @returns {Graph} The current graph instance,
   * allowing for method chaining.
   *
   * @example
   * const graph = new Graph();
   * graph.addNode("A", { value: 1 });
   * graph.addNode("B", { value: 2 });
   * graph.addEdge({ source: "A", target: "B", attributes: { weight: 3 } });
   *
   * // Deletes node "A" and its associated edges
   * graph.deleteNodeById("A");
   */
  deleteNodeById(name?: string): Graph {
    if (name) {
      models.DeleteNodeById(this.__G__, name);
    }

    return this;
  }

  ForwardBFS(
    name: string,
    callback: (node: GraphNodeType, G: Graph) => void,
  ): Graph {
    const Q = new Queue();
    Q.enqueue(name);
    models.ForwardBFS(this.__G__, callback, Q, this);

    return this;
  }

  /**
   * Removes all edges from the graph while retaining all nodes.
   *
   * This method iterates through all nodes in the graph and clears their input and output edges.
   *
   * @returns {Graph} The updated graph instance with all edges removed.
   */
  removeAllEdges(): Graph {
    const G = this.__G__;
    for (const [_, node] of G) {
      let { inputs, outputs } = node;
      if (inputs) inputs = new Map();
      if (outputs) outputs = new Map();
    }

    return this;
  }
}
