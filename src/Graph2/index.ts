"use strict";

import { IsFunction, IsInteger, IsStringArray } from "./Conditions";
import * as errors from "../Errors";

import type {
  AbstractAttributesType,
  EdgeType,
  GraphOptionsType,
  GraphValuesDomain,
  GraphValuesDomainType,
  Integer,
  MatrixType,
  NodeType,
  NumericMatrix,
  NumericType,
  TraverseCallback,
  TypedArray,
  TypedArrayConstructor,
  UpdatableNodeType,
} from "../../Types";
import { GraphDataEdge, GraphDataNode } from "../DataNode";
import {
  ifEdgeExistsThrow,
  ifIsNotArrayOfStringsOrNodeTypesThrow,
  ifIsNotIntegerOrArrayOfNodeTypesThrow,
  ifNodeExistsThrow,
  ifNodeNotExistsThrow,
  ifGraphValuesTypeIsNotNumberThrow,
  ifWeightsTypeIsNotNumberThrow,
  ifValuesTypeIsNotNumericVectorThrow,
  ifValuesTypeIsNotNumericMatrixThrow,
  ifWeightsTypeIsNotNumericVectorThrow,
  ifWeightsTypeIsNotNumericMatrixThrow,
  ifSourceOrTargetNodeNotExistThrow,
  ifEdgeNotExistsThrow,
} from "../Decorators";
import * as models from "./Models";
import { Matrix } from "../../Matrix";
import { CreateTypedArrayConstructor } from "../../Matrix/Models";
import { IsTypedArrayOrArray } from "../../Matrix/Conditions";
import { DynamicStack } from "../Stack";
import { Queue } from "../Queue";

/**
 * Class representing a graph.
 *
 * A graph is a mathematical structure
 * that is defined as a pair of two sets: V and E.
 * - V is an arbitrary set of elements called
 *   "nodes" or "vertices". Each element
 *   in V can be described by attributes.
 * - E is a set of elements called "edges"
 *   which is a subset of the Cartesian
 *   product of V, denoted as V × V. Each
 *   element in E represents a connection
 *   between two vertices and can also have
 *   associated attributes such as weights.
 *
 * This class provides methods for manipulating
 * and querying the nodes and edges of the graph,
 * allowing for the creation of various types
 * of graphs such as weighted, unweighted,
 * simple, and symmetric graphs.
 */
export class Graph<V extends GraphDataNode, E extends GraphDataEdge> {
  /**
   * Placeholder (field) which shows whether the
   * graph instance is symmetric or not.
   *
   * @protected
   * @type{boolean}
   */
  protected __symmetric__: boolean = false;

  /**
   * Placeholder (field) which shows whether the
   * graph is weighted (true) or not (false).
   *
   * @protected
   * @type{boolean}
   */
  protected __weighted__: boolean = false;

  /**
   * Placeholder (field) which shows whether the
   * graph is simple (true) or not (false).
   */
  protected __simple__: boolean = false;

  /**
   * Placeholder (field) which keeps a constant which
   * will be used as seed for random values of the graph.
   *
   * @protected
   * @type {Integer}
   */
  protected __seed__: Integer = 123456; // used in the proces of random weights and values

  /**
   * Placeholder which keeps the Graph instance in a Map.
   * @protected
   * @type {Map<string, V>}
   */
  protected __G__: Map<string, V> = new Map();

  /**
   * Placeholder which keeps the Graph type of the values.
   * The graph values may be "numeric", "NumericMAatrix",
   * "MatrixType", "Vector", "String", "String vector",
   * "String matrix".
   * @protected
   * @type {GraphValuesDomainType}
   */

  protected __valuesType__: GraphValuesDomainType = "Numeric";

  /**
   * Placeholder for the types of the Graph weights.
   * @protected
   * @type {GraphValuesDomainType}
   */
  protected __weightsType__: GraphValuesDomainType = "Numeric";

  /**
   * Generates a new graph instance with nodes.
   *
   * @template V - The type of the nodes in the Graph.
   * @template E - The type of the edges in the Graph.
   * @param {Integer} [count] - The number of
   * nodes to generate.
   * @param {(string | NodeType)[]} [nodes] - The
   * nodes to initialize the graph with.
   * @returns {Graph<V, E>}  The generated graph instance.
   * @throws {Error} If the nodes declaration is incorrect.
   */
  @ifIsNotArrayOfStringsOrNodeTypesThrow(errors.IncorrectNodesDeclaration)
  public static generateGraphWithNodes<
    V extends GraphDataNode,
    E extends GraphDataEdge,
  >(count?: Integer, nodes?: (string | NodeType)[] | undefined): Graph<V, E> {
    const g = new Graph<V, E>();
    if (count || nodes) models.SetNodesAutomatically(g.__G__, nodes, count);

    return g;
  }

  /**
   * Creates an instance of Graph.
   *
   * @param {GraphOptionsType} [options] - Options to configure the graph.
   */
  constructor(options?: GraphOptionsType) {
    if (options) {
      this.weighted = options.weighted;
      this.nodes = options.nodes;
      this.edges = options.edges;
      this.simple = options.simple;
      this.symmetric = options.symmetric;
    }
  }

  /**
   * Definees the type of the values which to
   * has the values of the Graph.
   * @returns {GraphValuesDomainType} - a string
   * which defines the type of the value of the
   * graph values. The possible types are:
   * "Numeric", "NumericMatrix", "MatrixType",
   * "String", "StringVector", "StringMatrix".
   */
  get valuesType(): GraphValuesDomainType {
    return this.__valuesType__;
  }

  /**
   * Defines the type of the values of the graph.
   * @param {GraphValuesDomainType} type - The
   * type of the values of the graph.
   */
  set valuesType(type: GraphValuesDomainType) {
    this.__valuesType__ = type;
  }

  /**
   * Defines the type of the weights of the graph.
   * @returns {GraphValuesDomainType} The type of the
   * weights of the Graph.
   */
  get weightsType(): GraphValuesDomainType {
    return this.__weightsType__;
  }

  /**
   * Defines the type of the weights of the Graph.
   * @param {GraphValuesDomainType} type - The type of the weights
   * of the Graph.
   */
  set weightsType(type: GraphValuesDomainType) {
    this.__weightsType__ = type;
  }

  /**
   * Gets whether the graph is symmetric.
   *
   * @returns {boolean} - True if the graph is symmetric, false otherwise.
   */
  get symmetric(): boolean {
    return !!this.__symmetric__;
  }

  /**
   * Sets whether the graph is symmetric.
   *
   * @param {boolean} isSymmetric - True to make the graph symmetric, false otherwise.
   */
  set symmetric(isSymmetric: boolean | undefined) {
    const wasSymmetric = this.__symmetric__;
    if (typeof isSymmetric !== "undefined") {
      this.__symmetric__ = isSymmetric;
      if (!wasSymmetric && isSymmetric) {
        //models.Symmetrize(this.__G__, "average");
      }
    }
  }

  /**
   * Gets whether the graph is simple.
   *
   * @returns {boolean} - True if the graph is simple, false otherwise.
   */
  get simple(): boolean {
    return !!this.__simple__;
  }

  /**
   * Sets whether the graph is simple.
   *
   * @param {boolean} isSimple - True to make the graph simple, false otherwise.
   */
  set simple(isSimple: boolean | undefined) {
    if (typeof isSimple !== "undefined") {
      this.__simple__ = isSimple;
      const G = this.__G__;
      for (const [name, node] of G) {
        if (this.hasEdge({ source: name, target: name })) {
          node.removeIncomingEdge(name);
          node.removeOutgoingEdge(name);
        }
      }
      // search for cycles and if there was found
      // any cycle then throw an error message that
      // says "simple setter method falls".
    }
  }

  /**
   * Gets whether the graph is weighted.
   *
   * @returns {boolean} - True if the graph is weighted, false otherwise.
   */
  get weighted(): boolean {
    return this.__weighted__;
  }

  /**
   * Sets whether the graph is weighted.
   *
   * @param {boolean} isWeighted - True to make the graph weighted, false otherwise.
   */
  set weighted(isWeighted: boolean | undefined) {
    if (typeof isWeighted !== "undefined") this.__weighted__ = isWeighted;
  }

  /**
   * Gets whether the graph is empty.
   *
   * @returns {boolean} - True if the graph is empty, false otherwise.
   */
  get isEmpty(): boolean {
    return this.__G__.size === 0;
  }

  /**
   * Gets the nodes of the graph.
   *
   * @returns {NodeType[]} - The nodes of the graph.
   */
  get nodes(): NodeType[] {
    return models.GetGraphNodes(this.__G__);
  }

  /**
   * Sets the nodes of the graph.
   *
   * @param {(string | NodeType)[]} nodes - The nodes to set.
   */
  set nodes(nodes: (string | NodeType)[] | undefined) {
    if (nodes) {
      this.clean();
      models.SetNodesAutomatically(this.__G__, nodes, Infinity);
    }
  }

  /**
   * Gets the edges of the graph.
   *
   * @returns {EdgeType[]} - The edges of the graph.
   */
  get edges(): EdgeType[] {
    return models.GetGraphEdges(this.__G__);
  }

  /**
   * Sets the edges of the graph.
   *
   * @param {EdgeType[]} edges - The edges to set.
   */
  set edges(edges: EdgeType[] | undefined) {
    if (edges) {
      this.removeAllEdges();
      models.SetGraphEdges(edges, this.__G__);
    }
  }

  /**
   * Retrieves a list of all node names (IDs) in the graph.
   *
   * @returns {string[] | null} An array of node names (IDs) present in the graph.
   * If the graph contains no nodes, `null` is returned instead of an empty array.
   */
  get nodeNames(): string[] | null {
    const list: string[] = [];
    const G = this.__G__;
    for (const [name, _] of G) list.push(name);

    return list.length ? list : null;
  }

  /**
   * Gets the order of the graph (number of nodes).
   *
   * @returns {Integer} - The number of nodes in the graph.
   */
  get order(): Integer {
    return this.__G__.size;
  }

  /**
   * Gets the size of the graph (number of edges).
   *
   * @returns {Integer} - The number of edges in the graph.
   */
  get size(): Integer {
    return models.ComputeGraphSize(this.__G__);
  }

  /**
   * Checks if a node exists in the graph.
   *
   * @param {string} name - The name of the node.
   * @returns {boolean} - True if the node exists, false otherwise.
   */
  hasNode(name: string): boolean {
    return this.__G__.has(name);
  }

  /**
   * Retrieves a node by its name ID.
   *
   * This method searches for a node
   * in the graph by its name (ID)
   * and returns the node along with
   * its attributes if found.
   * If the node does not exist,
   * the method returns null.
   *
   * @param {string} name - The name
   * (ID) of the node to retrieve.
   * @returns {NodeType | null} - The
   * node with its attributes if found, otherwise null.
   */
  getNodeByName(name: string): NodeType | null {
    const node = this.__G__.get(name);

    if (!node) return null;
    return { name: node.id, attributes: node.data };
  }

  /**
   * Retrieves a node from the graph by its ID.
   *
   * This method returns the node with the specified ID if it exists in the graph.
   * If the node is not found, it returns null.
   * This method allows to be used all the methods of the GraphDataNode instance.
   *
   * @param {string} id - The ID of the node to retrieve.
   * @returns {GraphDataNode | null} - The node with the specified ID, or null if not found.
   */
  getNodeById(id: string): V | null {
    return this.__G__.get(id) || null;
  }

  /**
   * Adds a node to the graph.
   *
   * @param {Object | string} options - The node options or name.
   * @param {string} options.name - The name of the node.
   * @param {AbstractAttributesType & { value: GraphValuesDomain }} options.attributes - The
   * attributes of the node.
   * @returns {Graph<V, E>} - The current graph instance.
   * @throws {Error} - If the node already exists.
   */
  @ifNodeExistsThrow(errors.NodeAlreadyExists)
  addNode(
    options:
      | {
          name: string;
          attributes: AbstractAttributesType & { value: GraphValuesDomain };
        }
      | string,
  ): Graph<V, E> {
    const G = this.__G__;
    const { name, attributes } = options as {
      name: string;
      attributes: AbstractAttributesType & { value: GraphValuesDomain };
    };
    G.set(name, new GraphDataNode({ id: name, attributes }) as V);

    return this;
  }

  /**
   * Defines and adds a new node to the graph.
   *
   * This method creates a new node with the
   * given name and attributes and adds it to the graph.
   * If a node with the same name already exists, an
   * error is thrown.
   * This method differs from the `addNode` method in that
   * it returns a `GraphDataNode` instance, allowing the
   * user to apply the special methods of the `GraphDataNode` class.
   *
   * @param {Object} options - The options for defining the node.
   * @param {string} options.name - The name of the node.
   * @param {AbstractAttributesType & { value: GraphValuesDomain }} options.attributes - The
   * attributes of the node, including its value.
   * @returns {V} - The newly created node.
   *
   * @throws {Error} If a node with the given name already exists in the graph.
   */
  @ifNodeExistsThrow(errors.NodeAlreadyExists)
  defineNode(
    options:
      | {
          name: string;
          attributes: AbstractAttributesType & { value: GraphValuesDomain };
        }
      | string,
  ): V {
    const G = this.__G__;
    const { name, attributes } = options as {
      name: string;
      attributes: AbstractAttributesType & { value: GraphValuesDomain };
    };

    const node = new GraphDataNode({ id: name, attributes }) as V;
    G.set(name, node);

    return node;
  }

  /**
   * Updates the attributes of an existing node in the graph.
   *
   * This method updates the data attributes of a specified node in the graph.
   * If the node does not exist, it throws an `IncorrectNodesDeclaration` error.
   *
   * @param {NodeType} node - The node to update.
   *   - `name` (string): The name of the node to be updated.
   *   - `attributes` (AbstractAttributesType): The new attributes to merge with
   *   the existing node's attributes.
   * @throws {Error} If the node does not exist in the graph.
   * @returns {Graph<V, E>} The updated instance of the graph.
   */
  @ifNodeNotExistsThrow(errors.IncorrectNodesDeclaration)
  updateNode(node: UpdatableNodeType): Graph<V, E> {
    const { name, attributes } = node;
    const v = this.__G__.get(name) as GraphDataNode;
    v.updateData(attributes);

    return this;
  }

  /**
   * Appends nodes to the graph, either by specifying a number of nodes to generate
   * or by providing an array of node objects.
   *
   * This method allows you to either add a specified number of nodes with default attributes
   * or append a set of predefined nodes to the graph. If a node already exists, it will be updated
   * with the provided attributes; otherwise, it will be created.
   *
   * @param {NodeType[] | Integer} nodes - Either an array of node objects to append to the graph,
   * or an integer specifying the number of nodes to generate. If an integer is provided,
   * nodes will be created with names in the format "v{index}" and default attributes.
   * @returns {Graph<V, E>} The current graph instance, allowing for method chaining.
   *
   * @throws {Error} Throws an error if the argument is neither an integer nor
   * an array of valid node objects.
   */
  @ifIsNotIntegerOrArrayOfNodeTypesThrow(errors.IncorrectNodesDeclaration)
  appendNodes(nodes: NodeType[] | Integer): Graph<V, E> {
    if (IsInteger(nodes)) {
      for (let i = nodes as Integer; i--; ) {
        const name = `v${i}`;
        const attributes = { value: 1 };
        if (!this.hasNode(name)) this.addNode(name);
        else this.updateNode({ name, attributes });
      }
    } else {
      for (const node of nodes as NodeType[]) {
        const { name } = node;
        if (!this.hasNode(name)) this.addNode(node);
        else this.updateNode(node);
      }
    }

    return this;
  }

  /**
   * Updates the attributes of an existing edge in the graph.
   *
   * This method retrieves the edge instance corresponding to the provided edge
   * and updates its attributes by merging them with the existing attributes.
   *
   * @param {EdgeType} edge - An object representing the edge to be updated,
   * including its `source`, `target`, and new `attributes`.
   * @returns {Graph<V, E>} The current instance of the graph for method chaining.
   */
  @ifSourceOrTargetNodeNotExistThrow(
    errors.IncorrectNodeDeclarationInMethod("updateEdge"),
  )
  @ifEdgeNotExistsThrow(errors.IncorrectEdgeDeclaration("updateEdge"))
  updateEdge(edge: EdgeType): Graph<V, E> {
    // if no edge attributes are defined, then
    // do not execute nothing!
    const { source, target, attributes } = edge;
    const G = this.__G__;
    const edgeInstance = G.get(source)?.findOutgoingEdgeById(target);
    if (!edgeInstance) errors.IncorrectEdgeDeclaration("updateEdge")();
    (edgeInstance as E).updateData(attributes);

    return this;
  }

  /**
   * Updates multiple edges in the graph.
   *
   * This method allows updating of multiple edges in the graph by either applying a callback function
   * to each edge or directly providing an array of updated edge objects.
   *
   * If a callback function is provided, it will be called for each edge with the current edge,
   * its index, and the graph as arguments. The callback should return the updated `EdgeType` object.
   *
   * Alternatively, if an array of `EdgeType` objects is provided, each edge in the array will be
   * updated in the graph.
   *
   * @param {((edge: EdgeType, index?: Integer, g?: Graph<V, E>) => EdgeType) | EdgeType[]} updatedEdges
   * - A function that takes an edge and returns an updated edge, or an array of updated edge objects.
   * @returns {Graph<V, E>} The current instance of the graph for method chaining.
   *
   * @example
   * // Update edges using a callback function
   * graph.updateEdges((edge, index, graph) => {
   *   return {
   *     ...edge,
   *     attributes: { ...edge.attributes, weight: edge.attributes.weight * 2 }
   *   };
   * });
   *
   * @example
   * // Update edges using an array of edge objects
   * graph.updateEdges([
   *   { source: 'A', target: 'B', attributes: { weight: 10 } },
   *   { source: 'C', target: 'D', attributes: { weight: 15 } }
   * ]);
   */
  updateEdges(
    updatedEdges:
      | ((edge: EdgeType, index?: Integer, g?: Graph<V, E>) => EdgeType)
      | EdgeType[],
  ): Graph<V, E> {
    const edges = this.edges;
    if (edges) {
      if (IsFunction(updatedEdges)) {
        let i: Integer = 0;
        for (const edge of edges) {
          this.updateEdge((updatedEdges as Function)(edge, i++, this));
        }
      } else {
        for (const edge of updatedEdges as EdgeType[]) {
          this.updateEdge(edge);
        }
      }
    }

    return this;
  }

  /**
   * Removes a node from the graph.
   *
   * This method deletes the specified node
   * from the graph. It also removes any edges
   * that are connected to the node, including
   * both outgoing and incoming edges.
   *
   * @param {string} name - The ID of the node
   * to be removed.
   * @returns {Graph<V, E>} - The current graph instance
   * with the specified node and its edges removed.
   */
  removeNode(name: string): Graph<V, E> {
    const G = this.__G__;
    if (G.delete(name)) {
      for (const [_, node] of G) {
        node.removeOutgoingEdge(name);
        node.removeIncomingEdge(name);
      }
    }

    return this;
  }

  /**
   * Removes nodes from the graph based on the provided criteria.
   *
   * This method can remove nodes either by specifying an array of node names
   * or by providing a callback function that returns `true` for nodes to be removed.
   *
   * @param {string[] | ((node: GraphDataNode, g: Graph) => boolean)} d - The criteria for
   * removing nodes. It can be:
   *   - An array of strings, where each string is a node name to be removed.
   *   - A callback function that takes a `GraphDataNode` and the graph instance,
   *   and returns `true` if the node should be removed.
   * @returns {Graph<V, E>} The graph instance with the specified nodes removed.
   */
  removeNodes(
    d: string[] | ((node: GraphDataNode, g: Graph<V, E>) => boolean),
  ): Graph<V, E> {
    const G = this.__G__;
    if (IsStringArray(d)) {
      for (const name of d as string[]) {
        this.removeNode(name);
      }
    } else if (IsFunction(d)) {
      for (const [name, node] of G) {
        if ((d as Function)(node, this)) this.removeNode(name);
      }
    }

    return this;
  }

  /**
   * Finds nodes in the graph based on a callback function.
   *
   * This method iterates over all nodes in the graph and
   * applies the provided callback function to each node.
   * If the callback function returns true for a node,
   * that node is included in the result set.
   *
   * @param {(node: V, g?: Graph<V, E>) => boolean} callback - The
   * callback function to test each node.
   * It takes a node and the graph as arguments and returns a boolean
   * indicating whether the node should be included in the result set.
   * @returns {NodeType[] | null} - An array of nodes that match the
   * criteria specified by the callback function, or null if no nodes match.
   */
  findNodes(
    callback: (node: V, g?: Graph<V, E>) => boolean,
  ): NodeType[] | null {
    const nodes: NodeType[] = [];
    for (const [name, node] of this.__G__) {
      if (callback(node, this)) {
        nodes.push({
          name,
          attributes: { ...node.data },
        });
      }
    }

    return nodes.length ? nodes : null;
  }

  /**
   * Checks if an edge exists in the graph.
   *
   * @param {Object} options - The edge options.
   * @param {string} options.source - The source node of the edge.
   * @param {string} options.target - The target node of the edge.
   * @returns {boolean} - True if the edge exists, false otherwise.
   */
  hasEdge(options: { source: string; target: string }): boolean {
    const { source, target } = options;
    const G = this.__G__;
    if (this.hasNode(source) && this.hasNode(target)) {
      if (
        G.get(source)?.outputs.has(target) &&
        G.get(target)?.inputs.has(source)
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   * Gets an edge from the graph.
   *
   * @param {Object} options - The edge options.
   * @param {string} options.source - The source node of the edge.
   * @param {string} options.target - The target node of the edge.
   * @returns {EdgeType | null} - The edge if found, null otherwise.
   */
  getEdge(options: { source: string; target: string }): EdgeType | null {
    const { source, target } = options;
    if (!this.hasEdge({ source, target })) {
      return null;
    }

    const GraphDataEdgesMap = (this.__G__.get(source) as V).outputs;
    const attributes = (GraphDataEdgesMap.get(target) as E).data;

    return { source, target, attributes };
  }

  /**
   * Adds an edge to the graph.
   *
   * @param {Object} options - The edge options.
   * @param {string} options.source - The source node of the edge.
   * @param {string} options.target - The target node of the edge.
   * @param {AbstractAttributesType & { weight: GraphValuesDomain }} [options.attributes] - The
   * attributes of the edge.
   * @returns {Graph<V, E>} - The current graph instance.
   * @throws {Error} If the edge already exists.
   */
  @ifEdgeExistsThrow(errors.IncorrectEdgeDeclaration("addEdge"))
  addEdge(options: {
    source: string;
    target: string;
    attributes?: AbstractAttributesType & { weight: GraphValuesDomain };
  }): Graph<V, E> {
    const G = this.__G__,
      { source, target, attributes } = options;
    const u = G.get(source) as V;
    const v = G.get(target) as V;
    models.AddEdge(u, v, attributes);

    return this;
  }

  /**
   * Defines and adds a new edge to the graph.
   *
   * This method creates an edge between the
   * specified source and target nodes with optional attributes.
   * The edge is represented as an object containing the source node,
   * target node, and any additional attributes such as weight.
   * This method differs from the addEdge method in that it returns
   * and `EdgeType` object instead of all the Graph instance.
   *
   * @param {Object} options - The edge options.
   * @param {string} options.source - The ID of the source node.
   * @param {string} options.target - The ID of the target node.
   * @param {AbstractAttributesType & { weight: GraphValuesDomain }} [options.attributes] -
   *   Optional attributes for the edge, including weight.
   * @returns {EdgeType}  The defined edge object, which includes the source, target,
   *   and attributes of the edge.
   */
  @ifEdgeExistsThrow(errors.IncorrectEdgeDeclaration("defineEdge"))
  defineEdge(options: {
    source: string;
    target: string;
    attributes?: AbstractAttributesType & { weight: GraphValuesDomain };
  }): EdgeType {
    const { source, target, attributes } = options;
    const G = this.__G__;
    const u = G.get(source) as V;
    const v = G.get(target) as V;
    models.AddEdge(u, v, attributes);

    return this.getEdge({ source, target }) as EdgeType;
  }

  /**
   * Converts the current graph to a complete graph.
   *
   * This method adds edges between all pairs of nodes that do not already have
   * an edge, making the graph a complete graph. In a complete graph, every pair
   * of distinct nodes is connected by a unique edge.
   *
   * @returns {Graph<V, E>} - The current graph instance, updated to be a complete graph.
   */
  toCompleteGraph(): Graph<V, E> {
    const G = this.__G__;
    for (const [_, u] of G) {
      for (const [t, v] of G) {
        if (!u.outputs.has(t)) {
          models.AddEdge(u, v);
        }
      }
    }

    return this;
  }

  /**
   * Retrieves the incoming neighborhood of a specified node.
   *
   * This method returns all nodes and edges that have incoming edges to the specified node.
   * If a callback is provided, it filters the edges based on the callback criteria.
   *
   * @param {string} nodeName - The name of the node whose incoming neighborhood is to be retrieved.
   * @param {(node: NodeType, edge: EdgeType, params?: any) => boolean} [callback] - Optional callback
   * function to filter edges.
   * @returns {{ nodes: NodeType[]; edges: EdgeType[] } | null} - An object containing the nodes and
   * edges of the incoming neighborhood, or null if the node is not found.
   */
  getIncomingNeighbourhood(
    nodeName: string,
    callback?: (node: NodeType, edge: EdgeType, params?: any) => boolean,
  ): { node: NodeType; edge: EdgeType }[] | null {
    let result: { node: NodeType; edge: EdgeType }[] | null = null;
    const node = this.getNodeById(nodeName);
    if (node) {
      if (node.inputs) {
        result = [];
        let inputs;
        if (callback) inputs = node.findIncomingEdgesWichSatisfy(callback);
        else inputs = node.inputs;
        for (const [source, edge] of inputs) {
          result.push({
            node: this.getNodeByName(source) as NodeType,
            edge: { source, target: nodeName, attributes: edge.data },
          });
        }
      }
    }

    return result;
  }

  /**
   * Retrieves the outgoing neighborhood of a specified node.
   *
   * This method returns all nodes and edges that have outgoing edges from the specified node.
   * If a callback is provided, it filters the edges based on the callback criteria.
   *
   * @param {string} nodeName - The name of the node whose outgoing neighborhood is to be retrieved.
   * @param {(node: NodeType, edge: EdgeType, params?: any) => boolean} [callback] - Optional callback
   * function to filter edges.
   * @returns {{ node: NodeType; edge: EdgeType }[] | null} - An object containing the nodes and edges
   * of the outgoing neighborhood, or null if the node is not found.
   */
  getOutgoingNeighbourhood(
    nodeName: string,
    callback?: (node: NodeType, edge: EdgeType, params?: any) => boolean,
  ): { node: NodeType; edge: EdgeType }[] | null {
    const node = this.getNodeById(nodeName);
    let output: { node: NodeType; edge: EdgeType }[] | null = null;
    if (node) {
      if (node.outputs) {
        let outputs;
        if (callback) outputs = node.findOutgoingEdgesWhichSatisfy(callback);
        else outputs = node.outputs;
        output = [];
        for (const [target, edge] of outputs) {
          output.push({
            node: this.getNodeByName(target) as NodeType,
            edge: {
              source: nodeName,
              target,
              attributes: edge.data,
            },
          });
        }
      }
    }

    return output;
  }

  /**
   * Retrieves the names of the incoming neighboring nodes for a given node in the graph.
   *
   * This method searches for all nodes that have edges directed towards the specified node
   * and returns their names. If a callback function is provided, only the nodes and edges
   * that satisfy the callback criteria will be included.
   *
   * @param {string} nodeName - The name of the node for which to retrieve incoming neighbors.
   * @param {(node: NodeType, edge: EdgeType) => boolean} callback - An
   * optional callback function that takes a node and an edge as arguments
   * and returns a boolean. The node name will be included in the result
   * only if the callback returns `true`.
   *
   * @returns {string[] | null} - An array of incoming neighboring node names
   * that satisfy the callback criteria, or `null` if the node does not exist
   * or no incoming neighbors meet the criteria.
   *
   * @example
   * const graph = new Graph();
   * const incomingNodeNames = graph.getIncomingNeighbourhoodNodeNames(
   *   'node1',
   *   (node, edge) => edge.attributes.weight > 0.5);
   * console.log(incomingNodeNames); // ['node2', 'node3']
   */
  getIncomingNeighbourhoodNodeNames(
    nodeName: string,
    callback: (node: NodeType, edge: EdgeType) => boolean,
  ): string[] | null {
    const names: string[] = [];
    const node = this.getNodeById(nodeName);
    if (!node) return null;
    if (!callback) {
      for (const [name, _] of node.inputs) {
        names.push(name);
      }
    } else {
      for (const [source, edge] of node.inputs) {
        if (
          callback(
            {
              name: node.id,
              attributes: node.data,
            },
            {
              source,
              target: node.id,
              attributes: edge.data,
            },
          )
        )
          names.push(source);
      }
    }

    if (names.length) return names;
    return null;
  }

  /**
   * Retrieves the names of the outgoing neighboring nodes for a given node in the graph.
   *
   * This method searches for all nodes that have edges originating from the specified node
   * and returns their names. If a callback function is provided, only the nodes and edges
   * that satisfy the callback criteria will be included.
   *
   * @param {string} name - The name of the node for which to retrieve
   * outgoing neighbors.
   * @param {(node: NodeType, edge: EdgeType) => boolean} [callback] - An
   * optional callback function that takes a node and an edge as arguments
   * and returns a boolean. The node name will be included in the result only
   * if the callback returns `true`.
   *
   * @returns {string[] | null} - An array of outgoing neighboring node names
   * that satisfy the callback criteria, or `null` if the node does not exist
   * or no outgoing neighbors meet the criteria.
   *
   * @example
   * const graph = new Graph();
   * const outgoingNodeNames = graph.getOutgoingNeighbourhoodNodeNames(
   *   'node1',
   *   (node, edge) => edge.attributes.weight > 0.5
   * );
   * console.log(outgoingNodeNames); // ['node2', 'node4']
   */
  getOutgoingNeighbourhoodNodeNames(
    name: string,
    callback?: (node: NodeType, edge: EdgeType) => boolean,
  ): string[] | null {
    let names = [];
    const node = this.getNodeById(name);
    if (!node) return null;
    if (!callback) {
      for (const [target, _] of node.outputs) names.push(target);
    } else {
      for (const [target, edge] of node.outputs) {
        if (
          callback(
            {
              name: node.id,
              attributes: node.data,
            },
            {
              source: node.id,
              target,
              attributes: edge.data,
            },
          )
        )
          names.push(target);
      }
    }

    if (names.length) return names;
    return null;
  }

  /**
   * Assigns a random number to the value of each node in the graph.
   *
   * This method iterates through all nodes in the graph and assigns a random
   * number to each node's value. The random number is generated within the
   * specified range [from, to] and is seeded with the given seed value.
   * The seed value is incremented for each node to ensure different random
   * values for each node.
   *
   * @param {number} [from=0] - The minimum value of the random range.
   * @param {number} [to=1] - The maximum value of the random range.
   * @param {Integer} [seed=123456] - The seed for the random number generator.
   * @returns {Graph<V, E>} - The current graph instance with updated node values.
   * @throws {Error} If the valuesType is set to something different of "Numeric".
   */
  @ifGraphValuesTypeIsNotNumberThrow(errors.InappropriateValuesTypeDefinition)
  assignNodeValuesToRandomNumber(
    from: number = 0,
    to: number = 1,
    seed: Integer = 123456,
  ): Graph<V, E> {
    for (const [_, node] of this.__G__) {
      node.assignRandomNumberToValue(from, to, seed);
    }

    return this;
  }

  /**
   * Assigns a unique random number to the value of each node in the graph.
   *
   * This method iterates through all nodes in the graph and assigns a unique
   * random number to each node's value. The random number is generated within
   * the specified range [from, to]. Each node receives a different random value.
   *
   * @param {number} [from=0] - The minimum value of the random range.
   * @param {number} [to=1] - The maximum value of the random range.
   * @returns {Graph<V, E>} - The current graph instance with updated node values.
   * @throws {Error} If the valuesType is not set to "Numeric".
   */
  @ifGraphValuesTypeIsNotNumberThrow(errors.InappropriateValuesTypeDefinition)
  assignNodeValuesToUniqueRandomNumber(
    from: number = 0,
    to: number = 1,
  ): Graph<V, E> {
    for (const [_, node] of this.__G__) {
      node.assignUniqueRandomNumberToValue(from, to);
    }

    return this;
  }

  /**
   * Assigns random weights to all edges in the graph.
   *
   * This method iterates through all nodes in the graph and assigns random weights
   * to both the incoming and outgoing edges of each node. The random weights are
   * generated within the specified range [from, to]. A seed value is used for
   * reproducibility of the random number generation, which is consistently passed
   * to each node's edge weight assignment.
   *
   * @param {Integer} [from=0] - The lower bound of the random number range (inclusive).
   * @param {Integer} [to=1] - The upper bound of the random number range (exclusive).
   * @param {Integer} [seed=123456] - An optional seed for the random number generator
   * to ensure reproducibility across the graph's edges.
   * @returns {Graph<V, E>} The current graph instance, allowing for method chaining.
   * @throws {Error} If the weightsType is not "Numeric".
   */
  @ifWeightsTypeIsNotNumberThrow(
    errors.InappropriateWeightsType("assignEdgeWeightsToRandomNumber"),
  )
  assignEdgeWeightsToRandomNumber(
    from: Integer = 0,
    to: Integer = 1,
    seed: Integer = 123456,
  ): Graph<V, E> {
    const G = this.__G__;
    for (const [_, node] of G) {
      node.assignRandomNumberToNeighbourhoodWeights(from, to, seed);
    }
    return this;
  }

  /**
   * Assigns unique random numbers to the weights of all edges in the graph.
   *
   * This method iterates through each node in the graph and updates the weights of
   * both incoming and outgoing edges for each node. Each edge's weight is set to a
   * unique random number within the specified range `[from, to)`. The range is defined
   * by the `from` and `to` parameters, with `from` being inclusive and `to` being exclusive.
   *
   * @param {number} [from=0] - The minimum value in the range for the random numbers (inclusive).
   * @param {number} [to=1] - The maximum value in the range for the random numbers (exclusive).
   * @returns {Graph<V, E>} The current instance of the graph with updated edge weights,
   * allowing for method chaining.
   * @throws {Error} If the weightsType is not "Numeric".
   */
  @ifWeightsTypeIsNotNumberThrow(
    errors.InappropriateWeightsType("assignEdgeWeightsToRandomNumber"),
  )
  assignEdgeWeightsToUniqueRandomNumber(
    from: number = 0,
    to: number = 1,
  ): Graph<V, E> {
    const G = this.__G__;
    for (const [_, node] of G) {
      node.assignUniqueRandomNumberToNeighbourhoodWeights(from, to);
    }
    return this;
  }

  /**
   * Assigns random vectors to the weights of all edges in the graph.
   *
   * This method iterates through each node in the graph and updates the weights of
   * both incoming and outgoing edges for each node. Each edge's weight is set to a
   * random vector of the specified size. The values within the vector are generated
   * within the range `[from, to)` and the randomness can be controlled using a seed value.
   *
   * @param {Integer} [size=1] - The size (number of elements) of the random vector
   * to assign as edge weights.
   * @param {Integer} [from=0] - The minimum value in the range for the random numbers
   * `in the vector (inclusive).
   * @param {Integer} [to=1] - The maximum value in the range for the random numbers
   * in the vector (exclusive).
   * @param {Integer} [seed=123456] - An optional seed for the random number generator
   * to ensure reproducibility.
   * @returns {Graph<V, E>} The current instance of the graph with updated edge weights,
   * allowing for method chaining.
   * @throws {Error} If the weightsType is not "NumericVector".
   */
  @ifWeightsTypeIsNotNumericVectorThrow(
    errors.InappropriateWeightsType("assignEdgeWeightsToRandomVectors"),
  )
  assignEdgeWeightsToRandomVectors(
    size: Integer = 1,
    from: Integer = 0,
    to: Integer = 1,
    seed: Integer = 123456,
  ): Graph<V, E> {
    const G = this.__G__;
    for (const [_, node] of G) {
      node.assignRandomVectorToNeighbourhoodWeights(size, from, to, seed);
    }

    return this;
  }

  /**
   * Assigns unique random vector weights to all edges in the graph.
   *
   * This method iterates over all nodes in the graph and assigns unique random vector weights
   * to both incoming and outgoing edges for each node. Each edge's weight is updated with a
   * unique random vector of the specified size, where each element falls within the range
   * [from, to]. The numeric type of the vector elements can also be specified.
   *
   * @param {Integer} [size=1] - The size (number of elements) of the random vector to be
   * assigned to each edge weight.
   * @param {Integer} [from=0] - The lower bound of the random number range for each vector
   * element (inclusive).
   * @param {Integer} [to=1] - The upper bound of the random number range for each vector
   * element (exclusive).
   * @param {NumericType} [type="float64"] - The numeric type of the random vector
   * elements, defaulting to "float64".
   * @returns {Graph<V, E>} The current instance of the graph, allowing for method chaining.
   * @throws {Error} If the weightsType is not "NumericVector".
   */
  @ifWeightsTypeIsNotNumericVectorThrow(
    errors.InappropriateWeightsType("assignEdgeWeightsToUniqueRandomVectors"),
  )
  assignEdgeWeightsToUniqueRandomVector(
    size: Integer = 1,
    from: Integer = 0,
    to: Integer = 1,
    type: NumericType = "float64",
  ): Graph<V, E> {
    const G = this.__G__;
    for (const [_, node] of G) {
      node.assignUniqueRandomVectorToNeighbourhoodWeights(size, from, to, type);
    }

    return this;
  }

  /**
   * Assigns random matrix weights to all edges in the graph.
   *
   * This method iterates through all nodes in the graph and assigns random matrix weights to all
   * incoming and outgoing edges connected to each node. The matrix is generated with specified
   * dimensions (rows and columns), and each element in the matrix is a random number within the
   * specified range [from, to]. The randomness can be controlled using an optional seed value to
   * ensure reproducibility. The seed is incremented after each assignment to ensure unique random
   * matrices for each edge.
   *
   * @param {Integer} [rows=1] - The number of rows in the random matrix to be assigned
   * as the weight.
   * @param {Integer} [columns=1] - The number of columns in the random matrix to be
   * assigned as the weight.
   * @param {number} [from=0] - The lower bound of the random number range for each
   * matrix element (inclusive).
   * @param {number} [to=0] - The upper bound of the random number range for each
   * matrix element (exclusive).
   * @param {Integer} [seed=123456] - An optional seed for the random number generator
   * to ensure reproducibility of the random matrices.
   * @returns {Graph<V, E>} The current instance of the graph, allowing for method chaining.
   * @throws {Error} If the weightsType is not "NumericMatrix"
   */
  @ifWeightsTypeIsNotNumericMatrixThrow(
    errors.InappropriateWeightsType("assignEdgeWeightsToRandomMatrix"),
  )
  assignEdgeWeightsToRandomMatrix(
    rows: Integer = 1,
    columns: Integer = 1,
    from: number = 0,
    to: number = 0,
    seed: Integer = 123456,
    type: NumericType = "float64",
  ): Graph<V, E> {
    const G = this.__G__;
    for (const [_, node] of G) {
      node.assignRandomMatrixToNeighbourhoodWeights(
        rows,
        columns,
        from,
        to,
        seed++,
        type,
      );
    }
    return this;
  }

  /**
   * Assigns a unique random matrix as the weight to all edges in the graph.
   *
   * This method iterates over all nodes in the graph and assigns a unique random matrix
   * as the weight to the edges associated with each node. The matrix has the specified
   * number of rows and columns, with elements generated randomly within the
   * specified range [from, to].
   * The numeric type of the matrix elements can be specified (e.g., "float64").
   *
   * @param {Integer} [rows=1] - The number of rows in the random matrix to be assigned
   * as the weight.
   * @param {Integer} [columns=1] - The number of columns in the random matrix to be
   * assigned as the weight.
   * @param {number} [from=0] - The lower bound of the random number range for each
   * matrix element (inclusive).
   * @param {number} [to=1] - The upper bound of the random number range for each
   * matrix element (exclusive).
   * @param {NumericType} [type="float64"] - The numeric type for the matrix elements
   * (e.g., "float64", "int32").
   * @returns {Graph<V, E>} The current graph instance with updated edge weights,
   * allowing for method chaining.
   * @throws {Errors} If the weightsType is not "NumericMatrix".
   */
  @ifWeightsTypeIsNotNumericMatrixThrow(
    errors.InappropriateWeightsType("assignEdgeWeightsToUniqueRandomMatrix"),
  )
  assignEdgeWeightsToUniqueRandomMatrix(
    rows: Integer = 1,
    columns: Integer = 1,
    from: number = 0,
    to: number = 1,
    type: NumericType = "float64",
  ): Graph<V, E> {
    const G = this.__G__;
    for (const [_, node] of G) {
      node.assignUniqueRandomMatrixToNeighbourhoodWeights(
        rows,
        columns,
        from,
        to,
        type,
      );
    }

    return this;
  }

  /**
   * Assigns a random vector to the value of each node in the graph.
   *
   * This method iterates through all nodes in the graph and assigns a random
   * vector to each node's value. The vector has a specified size and each
   * element in the vector is a random number within the range [from, to]. The
   * random number generation is seeded with the provided seed, which is incremented
   * for each node to ensure unique vectors.
   *
   * @param {Integer} [size=1] - The size of the vector (i.e., the number of
   * elements in the vector).
   * @param {number} [from=0] - The minimum value of the random range for
   * the vector elements.
   * @param {number} [to=1] - The maximum value of the random range for the
   * vector elements.
   * @param {Integer} [seed=123456] - The seed for the random number generator,
   * which is incremented for each node.
   * @param {NumericType} [type="float64"] - The type of the vectors.
   * @returns {Graph<V, E>} - The current graph instance with updated node values.
   * @throws {Error} If the valuesType is not set to 'NumericVector'
   */
  @ifValuesTypeIsNotNumericVectorThrow(
    errors.InappropriateNodeValuesType("assignNodeValuesToRandomVector"),
  )
  assignNodeValuesToRandomVector(
    size: Integer = 1,
    from: number = 0,
    to: number = 1,
    seed: Integer = 123456,
    type: NumericType = "float64",
  ): Graph<V, E> {
    for (const [_, node] of this.__G__) {
      node.assignRandomVectorToValue(size, from, to, seed++, type);
    }

    return this;
  }

  /**
   * Assigns a unique random vector to the value of each node in the graph.
   *
   * This method iterates through all nodes in the graph and assigns a unique random
   * vector to each node's value. The vector has a specified size and each element
   * in the vector is a unique random number within the range [from, to]. The random
   * values are guaranteed to be unique within the vector but may be repeated across nodes.
   *
   * @param {Integer} [size=1] - The size of the vector (i.e., the number of elements in the vector).
   * @param {Integer} [from=0] - The minimum value of the random range for the vector elements.
   * @param {Integer} [to=1] - The maximum value of the random range for the vector elements.
   * @param {NumericType}[type="float64"] - The type of the Vector.
   * @returns {Graph<V, E>} - The current graph instance with updated node values.
   * @throws {Error} If the valuesType is not set to "NumericType".
   */
  @ifValuesTypeIsNotNumericVectorThrow(
    errors.InappropriateNodeValuesType("assignNodeValuesToUniqueRandomVector"),
  )
  assignNodeValuesToUniqueRandomVector(
    size: Integer = 1,
    from: Integer = 0,
    to: Integer = 1,
    type: NumericType = "float64",
  ): Graph<V, E> {
    for (const [_, node] of this.__G__) {
      node.assignUniqueRandomVectorToValue(size, from, to, type);
    }

    return this;
  }

  /**
   * Assigns a random matrix to the value of each node in the graph.
   *
   * This method iterates through all nodes in the graph and assigns a random matrix
   * to each node's value. The matrix has the specified number of rows and columns,
   * and each element in the matrix is a random number within the specified range
   * [from, to]. The random number generation is seeded, and the seed is incremented
   * for each node to ensure different random matrices for different nodes.
   *
   * @param {Integer} [rows=1] - The number of rows in the matrix.
   * @param {Integer} [columns=1] - The number of columns in the matrix.
   * @param {number} [from=0] - The minimum value in the range for the matrix elements.
   * @param {number} [to=1] - The maximum value in the range for the matrix elements.
   * @param {number} [seed=123456] - The initial seed for the random number generator.
   * The seed is incremented for each node to ensure unique random matrices.
   * @parao {NumericType}[type="float64"] - The type of the matrix.
   * @returns {Graph<V, E>} - The current graph instance with updated node values.
   * @throws{Error} If the valuesType is nto equals to "NumericMatrix".
   */
  @ifValuesTypeIsNotNumericMatrixThrow(
    errors.InappropriateNodeValuesType("assignNodeValuesToRandomMatrix"),
  )
  assignNodeValuesToRandomMatrix(
    rows: Integer = 1,
    columns: Integer = 1,
    from: number = 0,
    to: number = 1,
    seed: number = 123456,
    type: NumericType = "float64",
  ): Graph<V, E> {
    for (const [_, node] of this.__G__) {
      node.assignRandomMatrixToValue(rows, columns, from, to, seed++, type);
    }

    return this;
  }

  /**
   * Assigns a unique random matrix to the value of each node in the graph.
   *
   * This method iterates through all nodes in the graph and assigns a unique random matrix
   * to each node's value. The matrix has the specified number of rows and columns,
   * with each element being a unique random number within the specified range [from, to].
   * Each node will receive a different matrix, ensuring that the values across nodes are unique.
   *
   * @param {Integer} [rows=1] - The number of rows in the matrix.
   * @param {Integer} [columns=1] - The number of columns in the matrix.
   * @param {Integer} [from=0] - The minimum value in the range for the matrix elements.
   * @param {Integer} [to=1] - The maximum value in the range for the matrix elements.
   * @param {NumericType} [type="float64"] - The type of the matrix.
   * @returns {Graph<V, E>} - The current graph instance with updated node values.
   * @throws {Error} If the valuesType is not equals to "NumericMatrix".
   */
  @ifValuesTypeIsNotNumericMatrixThrow(
    errors.InappropriateNodeValuesType("assignNodeValuesToUniqueRandomMatrix"),
  )
  assignNodeValuesToUniqueRandomMatrix(
    rows: Integer = 1,
    columns: Integer = 1,
    from: Integer = 0,
    to: Integer = 1,
    type: NumericType = "float64",
  ): Graph<V, E> {
    for (const [_, node] of this.__G__) {
      node.assignUniqueRandomMatrixToValue(rows, columns, from, to, type);
    }

    return this;
  }

  getEdgeInstance(edge: EdgeType): E | null {
    const G = this.__G__;
    const sourceNode = G.get(edge.source) as V;
    return (sourceNode.outputs.get(edge.target) as E) || null;
  }

  /**
   * Assigns a random weight to a specified edge in the graph.
   *
   * This method sets the weight of the given edge to a random
   * number within the specified range.The randomness can be
   * controlled using an optional seed value.
   *
   * @param {EdgeType} edge - The edge to which the random weight
   * will be assigned, identified by source and target node names.
   * @param {number} [from=0] - The lower bound of the random
   * number range (inclusive).
   * @param {number} [to=1] - The upper bound of the random number
   * range (exclusive).
   * @param {Integer} [seed=123456] - An optional seed for the random
   * number generator to ensure reproducibility.
   * @returns {Graph<V, E>} The current graph instance, allowing for method chaining.
   * @throws {Error} If the weightsType is not set to "Numeric".
   */
  @ifWeightsTypeIsNotNumberThrow(
    errors.InappropriateNodeValuesType("assignWeightToRandomNumber"),
  )
  assignWeightToRandomNumber(
    edge: EdgeType,
    from: number = 0,
    to: number = 1,
    seed: Integer = 123456,
  ): Graph<V, E> {
    this.getEdgeInstance(edge)?.assignRandomNumberToWeight(from, to, seed);

    return this;
  }

  /**
   * Assigns a unique random number as the weight to a specified edge in the graph.
   *
   * This method sets the weight of the given edge to a unique random number within the
   * specified range [from, to]. Each edge will receive a different random number, ensuring
   * that the weights across edges are unique.
   *
   * @param {EdgeType} edge - The edge to which the unique random number weight will be assigned,
   * identified by source and target node names.
   * @param {number} [from=0] - The lower bound of the random number range for the weight (inclusive).
   * @param {number} [to=1] - The upper bound of the random number range for the weight (exclusive).
   * @returns {Graph<V, E>} The current graph instance, allowing for method chaining.
   * @throws {Error} If the weightsType is not set to "Numeric".
   */
  @ifWeightsTypeIsNotNumberThrow(
    errors.InappropriateWeightsType("assignWeightToUniqueRandomNumber"),
  )
  assignWeightToUniqueRandomNumber(
    edge: EdgeType,
    from: number = 0,
    to: number = 1,
  ): Graph<V, E> {
    this.getEdgeInstance(edge)?.assignUniqueRandomNumberToWeight(from, to);

    return this;
  }

  /**
   * Assigns a random vector as the weight to a specified edge in the graph.
   *
   * This method sets the weight of the given edge to a random vector of
   * specified size, with each element being a random number within the
   * specified range. The randomness can be controlled using an optional seed value.
   *
   * @param {EdgeType} edge - The edge to which the random vector weight will be assigned,
   * identified by source and target node names.
   * @param {Integer} [size=1] - The size (number of elements) of the random vector.
   * @param {number} [from=0] - The lower bound of the random number range for each vector element (inclusive).
   * @param {number} [to=1] - The upper bound of the random number range for each vector element (exclusive).
   * @param {Integer} [seed=123456] - An optional seed for the random number generator to ensure reproducibility.
   * @returns {Graph<V, E>} The current graph instance, allowing for method chaining.
   * @throws {Error} If the weightsType is not set to "NumericVector".
   */
  @ifWeightsTypeIsNotNumericVectorThrow(
    errors.InappropriateWeightsType("assignWeightToRandomVector"),
  )
  assignWeightToRandomVector(
    edge: EdgeType,
    size: Integer = 1,
    from: number = 0,
    to: number = 1,
    seed: Integer = 123456,
    type: NumericType = "float64",
  ): Graph<V, E> {
    const vector = Matrix.random(1, size, from, to, type, seed)[0];
    (this.getEdgeInstance(edge) as E).weight = vector;

    return this;
  }

  /**
   * Assigns a unique random vector as the weight to a specified edge in the graph.
   *
   * This method sets the weight of the given edge to a unique random vector of the specified size,
   * with each element being a random number within the range [from, to]. Each edge will receive a
   * different vector, ensuring that the weights across edges are unique.
   *
   * @param {EdgeType} edge - The edge to which the unique random vector weight will be assigned,
   * identified by source and target node names.
   * @param {Integer} [size=1] - The number of elements in the random vector.
   * @param {number} [from=0] - The lower bound of the random number range for
   * each vector element (inclusive).
   * @param {number} [to=1] - The upper bound of the random number range for each
   * vector element (exclusive).
   * @param {NumericType} [type="float64"] - The numeric type of the vector elements
   * (e.g., "float64", "int32").
   * @returns {Graph<V, E>} The current graph instance, allowing for method chaining.
   * @throws {Error} If the weightsType is not set to "NumericVector".
   */
  @ifWeightsTypeIsNotNumericVectorThrow(
    errors.InappropriateWeightsType("assignWeightToUniqueRandomVector"),
  )
  assignWeightToUniqueRandomVector(
    edge: EdgeType,
    size: Integer = 1,
    from: number = 0,
    to: number = 1,
    type: NumericType = "float64",
  ): Graph<V, E> {
    const vec = Matrix.uniqueRandom(1, size, from, to, type)[0];
    (this.getEdgeInstance(edge) as E).weight = vec;

    return this;
  }

  /**
   * Assigns a random matrix as the weight to a specified edge in the graph.
   *
   * This method sets the weight of the given edge to a random matrix with
   * specified dimensions,where each element is a random number within the
   * specified range. The randomness can be controlled using an optional seed value.
   *
   * @param {EdgeType} edge - The edge to which the random matrix weight will be assigned,
   * identified by source and target node names.
   * @param {Integer} [rows=1] - The number of rows in the random matrix.
   * @param {Integer} [columns=1] - The number of columns in the random matrix.
   * @param {number} [from=0] - The lower bound of the random number range for each matrix
   * element (inclusive).
   * @param {number} [to=1] - The upper bound of the random number range for each matrix
   * element (exclusive).
   * @param {Integer} [seed=123456] - An optional seed for the random number generator
   * to ensure reproducibility.
   * @returns {Graph<V, E>} The current graph instance, allowing for method chaining.
   * @throws {Error} If the weightsType is not set to "NumericMatrix".
   */
  @ifWeightsTypeIsNotNumericMatrixThrow(
    errors.InappropriateWeightsType("assignWeightToRandomMatrix"),
  )
  assignWeightToRandomMatrix(
    edge: EdgeType,
    rows: Integer = 1,
    columns: Integer = 1,
    from: number = 0,
    to: number = 1,
    seed: Integer = 123456,
    type: NumericType = "float64",
  ): Graph<V, E> {
    const matrix = Matrix.random(rows, columns, from, to, type, seed);
    (this.getEdgeInstance(edge) as E).weight = matrix;

    return this;
  }

  /**
   * Assigns a unique random matrix as the weight to a specified edge in the graph.
   *
   * This method sets the weight of the given edge to a unique random matrix with the specified
   * dimensions, where each element is a random number within the range [from, to]. Each edge will
   * receive a different matrix, ensuring that the weights across edges are unique.
   *
   * @param {EdgeType} edge - The edge to which the unique random matrix weight will be assigned,
   * identified by source and target node names.
   * @param {Integer} rows - The number of rows in the random matrix.
   * @param {Integer} columns - The number of columns in the random matrix.
   * @param {number} from - The lower bound of the random number range for each matrix
   * element (inclusive).
   * @param {number} to - The upper bound of the random number range for each matrix element
   * (exclusive).
   * @param {NumericType} [type="float64"] - The numeric type of the matrix elements
   * (e.g., "float64", "int32").
   * @returns {Graph<V, E>} The current graph instance, allowing for method chaining.
   * @throws {Error} If the weightsType is not set to "NumericMatrix".
   */
  @ifWeightsTypeIsNotNumericMatrixThrow(
    errors.InappropriateWeightsType("assignWeightToUniqueRandomMatrix"),
  )
  assignWeightToUniqueRandomMatrix(
    edge: EdgeType,
    rows: Integer,
    columns: Integer,
    from: number,
    to: number,
    type: NumericType = "float64",
  ): Graph<V, E> {
    const matrix = Matrix.uniqueRandom(rows, columns, from, to, type);
    (this.getEdgeInstance(edge) as E).weight = matrix;

    return this;
  }

  /**
   * Sets the weight of an edge between the specified source and target nodes.
   *
   * @param {Object} options - The options for setting the weight.
   * @param {string} options.source - The ID of the source node.
   * @param {string} options.target - The ID of the target node.
   * @param {GraphValuesDomain} options.weight - The weight to be assigned to the edge.
   * The type of `weight` must correspond to the `weightsType` of the graph:
   * - If `weightsType` is `"Numeric"`, `weight` must be a number.
   * - If `weightsType` is `"NumericMatrix"`, `weight` must be a matrix (e.g., `Matrix` instance).
   * - If `weightsType` is `"NumericVector"`, `weight` must be a typed array or array.
   * @param {boolean} [options.validateType=true] - Optional flag to enable or disable type
   * validation.
   * Set this to `false` to skip type validation, which may improve performance if you're
   * certain that the types match.
   *
   * @throws {Error} Throws an error if the edge does not exist.
   * @throws {Error} Throws an error if the type of `weight` does not match the `weightsType`
   * of the graph and `validateType` is `true`.
   *
   * @returns {Graph<V, E>} The current graph instance, allowing for method chaining.
   */
  setWeight(options: {
    source: string;
    target: string;
    weight: GraphValuesDomain;
    validateType?: boolean;
  }): Graph<V, E> {
    if (typeof options.validateType === "undefined")
      options.validateType = true;
    const { source, target, weight } = options;
    const edgeInstance = this.getEdgeInstance({
      source,
      target,
      attributes: {},
    });
    if (!edgeInstance) errors.IncorrectEdgeDeclaration("setWeight")();
    if (
      (typeof weight === "number" && this.weightsType !== "Numeric") ||
      (Matrix.isMatrix(weight) && this.weightsType !== "NumericMatrix") ||
      (IsTypedArrayOrArray(weight) && this.weightsType !== "NumericVector")
    ) {
      errors.InappropriateWeightsType("setWeight")();
    }
    (edgeInstance as E).weight = weight;

    return this;
  }

  /**
   * Creates a subgraph by selecting nodes based on a callback function.
   *
   * This method generates a new graph instance (`g`) containing only the nodes
   * and their associated edges that satisfy the condition defined by the
   * provided callback function. The edges included in the subgraph are those
   * where both the source and target nodes exist in the subgraph.
   *
   * @param {function(V, Graph<V, E>): boolean} callback - A function that determines
   * whether a node should be included in the subgraph. The function receives
   * each node and the current graph as arguments, and should return `true`
   * if the node should be included in the subgraph, or `false` otherwise.
   * @returns {Graph<V, E>} A new graph instance representing the subgraph with the
   * selected nodes and their associated edges.
   */
  subgraph(callback: (node: V, g?: Graph<V, E>) => boolean): Graph<V, E> {
    const subGraph = new Graph<V, E>(); // Create a new graph instance for the subgraph

    // Add nodes to the subgraph if they satisfy the callback criteria
    for (const [_, node] of this.__G__) {
      if (callback(node, this)) {
        subGraph.addNode({ name: node.id, attributes: node.data });
      }
    }

    // Add edges to the subgraph if both nodes (source and target) are in the subgraph
    for (const [name, node] of this.__G__) {
      if (callback(node, this)) {
        for (const [target, edge] of node.outputs) {
          if (subGraph.hasNode(target)) {
            if (!subGraph.hasEdge({ source: name, target })) {
              subGraph.addEdge({
                source: node.id,
                target,
                attributes: edge.data,
              });
            }
          }
        }
        for (const [source, edge] of node.inputs) {
          if (subGraph.hasNode(source)) {
            if (!subGraph.hasEdge({ source, target: name })) {
              subGraph.addEdge({
                source,
                target: name,
                attributes: edge.data,
              });
            }
          }
        }
      }
    }

    return subGraph;
  }

  /**
   * Creates a subgraph consisting of nodes and edges
   * that satisfy a given condition based on edge properties.
   *
   * This method iterates over all nodes and their incoming edges
   * in the current graph, and applies the provided callback function
   * to determine if an edge should be included in the subgraph. If the
   * callback function returns `true` for a given edge, both the edge
   * and its associated source and target nodes are added to the subgraph.
   *
   * @param {function} callback - A function that takes an `EdgeType` object
   * and the current graph (`Graph`), and returns a boolean indicating whether
   * the edge should be included in the subgraph.
   * @returns {Graph<V, E>} A new `Graph` instance representing the subgraph containing
   * nodes and edges that satisfy the provided condition.
   *
   * @example
   * const subGraph = graph.subgraphByEdges(edge => edge.attributes.weight < 0.05);
   */
  subgraphByEdges(
    callback: (edge: EdgeType, graph?: Graph<V, E>) => boolean,
  ): Graph<V, E> {
    const g = new Graph<V, E>();
    const G = this.__G__;
    for (const [name, node] of G) {
      for (const [_, edge] of node.inputs) {
        const source = edge.source;
        const target = name;
        const attributes = edge.data;
        if (callback({ source, target, attributes }, this)) {
          if (!g.hasNode(source))
            g.addNode(this.getNodeByName(source) as NodeType);
          if (!g.hasNode(target))
            g.addNode(this.getNodeByName(target) as NodeType);
          if (!g.hasEdge({ source, target }))
            g.addEdge({ source, target, attributes });
        }
      }
    }

    return g;
  }

  /**
   * Generates the adjacency matrix for the current graph.
   *
   * An adjacency matrix is a square matrix used to represent a finite graph.
   * The element at row `i` and column `j` represents the presence and weight
   * of an edge from node `i` to node `j`. If the graph is unweighted, the value
   * will be `1` if an edge exists, or `0` if no edge exists. For weighted graphs,
   * the value will be the weight of the edge.
   *
   * @param {NumericType} type - The numeric type to use for the adjacency matrix
   * (e.g., "float32", "float64", "int32").
   * Determines the precision and range of the matrix's numeric values.
   * @returns {MatrixType | NumericMatrix} The adjacency matrix of the graph.
   * The matrix is of the specified numeric type.
   * The size of the matrix is `N x N`, where `N` is the number of nodes in the graph.
   * Each entry represents the presence and/or weight of an edge between two nodes.
   *
   * @example
   * const graph = new Graph();
   * graph.addNode({name: 'A'});
   * graph.addNode({name: 'B'});
   * graph.addEdge({source: 'A', target: 'B', attributes: {weight: 3}});
   * const adjMatrix = graph.adjacencyMatrix('float64');
   * console.log(adjMatrix);
   * // Output might look like:
   * // [
   * //   [0, 3],
   * //   [0, 0]
   * // ]
   */
  @ifWeightsTypeIsNotNumberThrow(
    errors.InappropriateWeightsType("adjacencyMatrix"),
  )
  adjacencyMatrix(type: NumericType = "float64"): MatrixType | NumericMatrix {
    // Determine the typed array constructor for the desired numeric type
    const typedArray: TypedArrayConstructor | ArrayConstructor =
      CreateTypedArrayConstructor(type);

    // Initialize the adjacency matrix with the specified type
    const adj: MatrixType | NumericMatrix = [];

    const G = this.__G__;
    const nodeIds = Array.from(G.keys()); // Get all node ids to map them to matrix indices
    const nodeIndexMap: Map<string, number> = new Map();

    // Create a map from node ids to their indices for easier matrix construction
    nodeIds.forEach((nodeId, index) => {
      nodeIndexMap.set(nodeId, index);
    });

    // Initialize the adjacency matrix with zeros
    for (let i = 0; i < this.order; i++) {
      // Initialize a row filled with zeros
      const row = new typedArray(this.order).fill(0) as number[] | TypedArray;
      adj[i] = row;
    }

    // Fill the adjacency matrix based on edges
    for (const [nodeId, node] of G) {
      const rowIndex = nodeIndexMap.get(nodeId) as number;
      // Iterate over the output edges to fill the matrix
      for (const [targetId, edge] of node.outputs) {
        const colIndex = nodeIndexMap.get(targetId) as number;

        // For weighted graphs, set the weight; otherwise, set 1 for unweighted graphs
        adj[rowIndex][colIndex] = edge.weight as number;
      }
    }

    return adj;
  }

  /**
   * Performs a graph search to find nodes that satisfy the given callback condition.
   * The search is conducted using a breadth-first approach, where nodes are visited
   * based on their outgoing neighbors.
   *
   * @param {function(V): boolean} callback - A function that takes a `GraphDataNode`
   * as an argument and returns a boolean. The search includes nodes for which the callback
   * returns `true`.
   *
   * @returns {string[] | null} An array of node names (IDs) that satisfy the callback condition.
   * If no nodes satisfy the condition, or if the graph is empty, the method returns `null`.
   */
  graphSearch(callback: (node: V) => boolean): string[] | null {
    const visited: string[] = [];
    const nodeNames = this.nodeNames;
    if (!nodeNames) return null;
    let Q = new Queue().enqueueMany(nodeNames);
    while (!Q.isEmpty) {
      const id = Q.dequeue();
      const outgoingNeighbours = this.getOutgoingNeighbourhoodNodeNames(id);
      if (outgoingNeighbours) {
        for (const nodeId of outgoingNeighbours) {
          if (callback(this.getNodeById(nodeId) as V)) {
            if (!Q.contains(nodeId)) Q.enqueue(nodeId);
            visited.push(nodeId);
          }
        }
      }
    }

    return visited.length ? visited : null;
  }

  /**
   * Performs a Breadth-First Search (BFS) traversal on the graph starting from the specified node.
   *
   * @param {string} id - The ID of the starting node for the BFS traversal.
   * @param {TraverseCallback} callback - A function that is called on
   * each connected node visited during the BFS traversal. The function receives the connected
   * node, the edge connecting the current node to the connected node, the current node, and
   * the graph as arguments.
   * @param {"outputs" | "inputs"} [direction="outputs"] - The direction of traversal.
   * It can be either "outputs" to traverse through outgoing edges or "inputs" to
   * traverse through incoming edges. Defaults to "outputs".
   *
   * @returns {Graph<V, E>} - The current graph instance (`this`), allowing for method chaining.
   *
   * @example
   * // Example usage of BFS:
   * const graph = new Graph();
   * // Add nodes and edges to the graph
   * graph.BFS("startNodeId", (connectedNode, edge, currentNode, g) => {
   *   console.log(`Visited node: ${connectedNode.id} via edge from ${currentNode?.id}`);
   * }, "outputs");
   */
  BFS(
    id: string,
    callback: TraverseCallback<V, E>,
    direction: "outputs" | "inputs" = "outputs",
  ): Graph<V, E> {
    const Q = new Queue();
    if (this.__G__.has(id)) {
      Q.enqueue(id);
      models.BFS(this, callback, Q, direction);
    }

    return this;
  }

  /**
   * Performs a Depth-First Search (DFS) traversal on the graph starting
   * from the specified node.
   *
   * @param {string} id - The ID of the starting node for the DFS traversal.
   * @param {TraverseCallback} callback - A function that is called on each node
   * visited during the DFS traversal.
   * The function receives the connected node, the edge connecting the nodes, the
   * graph, and the current node as arguments.
   *
   * @param {"outputs" | "inputs"} [direction="outputs"] - The direction of traversal.
   * It can be either "outputs" to traverse through outgoing edges or "inputs" to
   * traverse through incoming edges. Defaults to "outputs".
   *
   * @returns {Graph<V, E>} - The current graph instance (`this`), allowing for method chaining.
   *
   * @example
   * // Example usage of DFS:
   * const graph = new Graph();
   * // Add nodes and edges to the graph
   * graph.DFS("startNodeId", (connectedNode, edge, g, currentNode) => {
   *   console.log(`Visited node: ${connectedNode.id} via edge ${edge.id}`);
   * }, "outputs");
   */
  DFS(
    id: string,
    callback: TraverseCallback<V, E>,
    direction: "outputs" | "inputs",
  ): Graph<V, E> {
    const S = new DynamicStack<string>();
    if (this.__G__.has(id)) {
      S.push(id);
      models.DFS(this, callback, S, direction);
    }

    return this;
  }

  /**
   * Clears all nodes and edges from the graph.
   *
   * This method removes all nodes and edges from the graph, effectively resetting the graph
   * to an empty state. The internal data structure holding the nodes and edges is replaced
   * with a new, empty `Map`. After calling this method, the graph will have no nodes or edges,
   * and its size will be zero.
   *
   * @returns {Graph<V, E>} - The current graph instance, now empty.
   */
  clean(): Graph<V, E> {
    this.__G__ = new Map();

    return this;
  }

  /**
   * Initializes the graph to a default setup state.
   *
   * This method performs the following actions:
   * 1. Clears all nodes and edges from the graph using the `clean` method.
   * 2. Sets the graph to be weighted by setting the `weighted` property to `true`.
   * 3. Sets the graph to be non-symmetric by setting the `symmetric` property to `false`.
   * 4. Sets the graph to be non-simple by setting the `simple` property to `false`.
   *
   * The result is a freshly initialized graph with default configuration. This setup is useful
   * for resetting the graph to a known state before adding nodes or edges.
   *
   * @returns {Graph<V, E>} - The current graph instance with the default setup applied.
   */
  initSetup(): Graph<V, E> {
    this.clean();
    this.weighted = true;
    this.symmetric = false;
    this.simple = false;

    return this;
  }

  /**
   * Removes all edges from the graph.
   *
   * This method clears all the edges between nodes in the graph
   * while preserving the nodes themselves.
   *
   * @returns {Graph<V, E>} - The current graph instance with all edges removed.
   */
  removeAllEdges(): Graph<V, E> {
    models.RemoveAllEdges(this.__G__);

    return this;
  }
}
