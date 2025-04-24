"use strict";

import * as errors from "./Errors";
import {
  DirectedGraphDataNode,
  GraphDataEdge,
  UndirectedGraphDataNode,
} from "../DataNode/Models";
import {
  ifNodeExistsThrow,
  ifSourceOrTargetNodeNotExistThrow,
} from "./Decorators";
import type { GraphEdgeType, GraphNodeType } from "./Types";
import { Queue } from "../Queue";
import { DynamicStack } from "../Stack";

export class Graph<
  NodeType extends
    | DirectedGraphDataNode<NData, EData>
    | UndirectedGraphDataNode<NData, EData>,
  EdgeType extends GraphDataEdge<NData, EData>,
  NData = unknown,
  EData = unknown,
  SData = unknown,
> {
  protected __symmetric__: boolean = false;
  protected __graph__: Map<string, NodeType> = new Map();
  protected __state__?: SData;
  protected NODE_CONSTRUCTOR:
    | typeof DirectedGraphDataNode<NData, EData>
    | typeof UndirectedGraphDataNode<NData, EData> = this.symmetric
    ? UndirectedGraphDataNode<NData, EData>
    : DirectedGraphDataNode<NData, EData>;

  constructor(options?: {
    nodes?: { name: string; data: NData; value?: number }[];
    edges?: { source: string; target: string; data: EData; weight?: number }[];
    state: SData;
    symmetric: boolean;
  }) {
    if (options) {
      const { nodes, edges, state, symmetric } = options;
      // set the orientation of the graph:
      this.symmetric = symmetric;
      // add the nodes
      if (nodes) for (const node of nodes) this.addNode(node);
      if (edges) for (const edge of edges) this.addEdge(edge);
      if (state) this.state = state;
    } else this.symmetric = false;
  }

  get symmetric(): boolean {
    return this.__symmetric__;
  }

  set symmetric(symmetric: boolean) {
    this.__symmetric__ = symmetric;
    // set the type of the graph.
    if (!this.__symmetric__)
      this.NODE_CONSTRUCTOR = DirectedGraphDataNode<NData, EData>;
    else this.NODE_CONSTRUCTOR = UndirectedGraphDataNode<NData, EData>;
  }

  get state(): SData | undefined {
    return this.__state__;
  }

  set state(s: SData) {
    this.__state__ = s;
  }

  get nodes(): GraphNodeType<NData>[] {
    const nodes: GraphNodeType<NData>[] = [];
    for (const [_, node] of this.__graph__) {
      const name = node.name;
      const data = node.data;
      const value = node.value;
      nodes.push({ name, data, value });
    }

    return nodes;
  }

  get edges(): GraphEdgeType<EData>[] {
    const edges: GraphEdgeType<EData>[] = [];
    for (const [_, node] of this.__graph__) {
      if (!this.symmetric)
        edges.push(
          ...(node as DirectedGraphDataNode<NData, EData>).getIncommingEdges(),
        );
      else
        edges.push(
          ...(node as UndirectedGraphDataNode<NData, EData>).getEdges(),
        );
    }

    return edges;
  }

  public hasNode(name: string): boolean {
    return this.__graph__.has(name);
  }

  public getNode(name: string): NodeType | undefined {
    return this.__graph__.get(name);
  }

  @ifNodeExistsThrow(errors.NodeAlreadyExists)
  public addNode({
    name,
    data,
    value = 1,
  }: {
    name: string;
    data: NData;
    value?: number;
  }): this {
    const node: NodeType = new this.NODE_CONSTRUCTOR({
      name,
      data,
      value,
    }) as NodeType;
    this.__graph__.set(name, node);

    return this;
  }

  public updateNode({
    name,
    data,
    value,
  }: {
    name: string;
    data?: NData;
    value?: number;
  }): this {
    const node: NodeType | undefined = this.getNode(name);
    if (node) {
      if (data) node.data = data;
      if (value) node.value = value;
    }
    return this;
  }

  public removeNode(name: string): NodeType | undefined {
    const node: NodeType | undefined = this.getNode(name);
    if (!node) return node;
    this.__graph__.delete(name);

    for (const [_, gNode] of this.__graph__) {
      if (gNode instanceof DirectedGraphDataNode) {
        gNode.removeOutgoingEdge(node as DirectedGraphDataNode<NData, EData>);
      } else if (gNode instanceof UndirectedGraphDataNode) {
        gNode.removeEdge(node as UndirectedGraphDataNode<NData, EData>);
      }
    }

    return node;
  }

  @ifSourceOrTargetNodeNotExistThrow(errors.NodeNotExists)
  public addEdge({
    source,
    target,
    data,
    weight = 1,
  }: {
    source: string;
    target: string;
    data: EData;
    weight?: number;
  }): this {
    const sourceNode = this.getNode(source);
    const targetNode = this.getNode(target);
    if (this.NODE_CONSTRUCTOR === DirectedGraphDataNode) {
      (sourceNode as DirectedGraphDataNode<NData, EData>).addOutgoingEdge({
        target: targetNode as DirectedGraphDataNode<NData, EData>,
        data,
        weight,
      });
    } else if (this.NODE_CONSTRUCTOR === UndirectedGraphDataNode) {
      (sourceNode as UndirectedGraphDataNode<NData, EData>).addEdge({
        target: targetNode as UndirectedGraphDataNode<NData, EData>,
        data,
        weight,
      });
    }

    return this;
  }

  public getEdge({
    source,
    target,
  }: {
    source: string;
    target: string;
  }): EdgeType | undefined {
    const node: NodeType | undefined = this.getNode(source);
    let edge: EdgeType | undefined;
    if (!node) return undefined;
    if (node instanceof DirectedGraphDataNode) {
      edge = node.getOutgoingEdgeByName(target) as EdgeType | undefined;
    } else if (node instanceof UndirectedGraphDataNode) {
      edge = node.getEdge(target) as EdgeType | undefined;
    }

    return edge;
  }

  public hasEdge({
    source,
    target,
  }: {
    source: string;
    target: string;
  }): boolean {
    return !!this.getEdge({ source, target });
  }

  public BFS(
    node: string | NodeType, // the starting node.
    callback: (node: NodeType, g?: this) => void = (_: NodeType): void => {},
    inversed: boolean = false,
  ): this {
    let gNode: NodeType | undefined;
    if (typeof node === "string") gNode = this.getNode(node);
    else gNode = node;
    if (!gNode) return this;
    const queue = new Queue<NodeType>();
    const visitedNodes = new Set();
    queue.enqueue(gNode);
    while (!queue.isEmpty) {
      const currentNode = queue.dequeue();
      if (!currentNode) break; // if is null by mistake
      if (visitedNodes.has(currentNode.name)) continue;
      visitedNodes.add(currentNode.name);
      let edges: Map<string, GraphDataEdge<NData, EData>>;
      callback(currentNode, this);
      if (currentNode instanceof DirectedGraphDataNode) {
        edges = !inversed ? currentNode.outEdges : currentNode.inEdges;
      } else edges = currentNode.edges;
      for (const [_, edge] of edges) {
        queue.enqueue(edge.link as NodeType);
      }
    }

    return this;
  }

  public DFS(
    node: string | NodeType,
    callback: (node: NodeType, g?: this) => void = (_: NodeType): void => {},
    inversed: boolean = false,
  ): this {
    let gNode: NodeType | undefined;
    if (typeof node === "string") gNode = this.getNode(node);
    else gNode = node;
    // if node with this name does not exists
    // stop the graph traversing.
    if (!gNode) return this;
    const stack = new DynamicStack<NodeType>();
    let visitedNodes = new Set<string>();
    stack.push(gNode as NodeType);
    while (!stack.isEmpty) {
      const currentNode = stack.pop();
      if (!currentNode) break;
      if (visitedNodes.has(currentNode.name)) continue;
      visitedNodes.add(currentNode.name);
      callback(currentNode, this);
      let edges: Map<string, EdgeType>;
      if (currentNode instanceof DirectedGraphDataNode) {
        edges = !inversed
          ? (currentNode.outEdges as Map<string, EdgeType>)
          : (currentNode.inEdges as Map<string, EdgeType>);
      } else edges = currentNode.edges as Map<string, EdgeType>;
      for (const [_, edge] of edges) {
        stack.push(edge.link as NodeType);
      }
    }

    return this;
  }

  public async BFSAsync(
    node: string | NodeType,
    callback: (node: NodeType, g?: this) => Promise<void> = async (
      _: NodeType,
    ): Promise<void> => {},
    inversed: boolean = false,
  ): Promise<this> {
    let gNode: NodeType | undefined;
    if (typeof node === "string") gNode = this.getNode(node);
    else gNode = node;
    if (!gNode) return this;
    const queue = new Queue<NodeType>();
    const visitedNodes = new Set<string>();
    queue.enqueue(gNode);
    while (!queue.isEmpty) {
      const currentNode = queue.dequeue();
      if (!currentNode) break;
      if (visitedNodes.has(currentNode.name)) continue;
      visitedNodes.add(currentNode.name);
      await callback(currentNode, this);
      let edges: Map<string, EdgeType>;
      if (currentNode instanceof DirectedGraphDataNode) {
        edges = !inversed
          ? (currentNode.outEdges as Map<string, EdgeType>)
          : (currentNode.inEdges as Map<string, EdgeType>);
      } else edges = currentNode.edges as Map<string, EdgeType>;

      for (const [_, edge] of edges) {
        queue.enqueue(edge.link as NodeType);
      }
    }
    return this;
  }

  public async DFSAsync(
    node: string | NodeType,
    callback: (node: NodeType, g?: this) => Promise<void> = async (
      _: NodeType,
    ): Promise<void> => {},
    inversed: boolean = false,
  ): Promise<this> {
    let gNode: NodeType | undefined;
    if (typeof node === "string") gNode = this.getNode(node);
    else gNode = node;
    if (!gNode) return this;
    const stack = new DynamicStack<NodeType>();
    const visitedNodes = new Set<string>();
    stack.push(gNode);
    while (!stack.isEmpty) {
      const currentNode = stack.pop();
      if (!currentNode) break;
      if (visitedNodes.has(currentNode.name)) continue;
      visitedNodes.add(currentNode.name);
      await callback(currentNode, this);
      let edges: Map<string, EdgeType>;
      if (currentNode instanceof DirectedGraphDataNode) {
        edges = !inversed
          ? (currentNode.outEdges as Map<string, EdgeType>)
          : (currentNode.inEdges as Map<string, EdgeType>);
      } else edges = currentNode.edges as Map<string, EdgeType>;

      for (const [_, edge] of edges) {
        stack.push(edge.link as NodeType);
      }
    }

    return this;
  }

  traverse(
    node: string | NodeType,
    filterCallback: (
      edge: EdgeType,
      source?: NodeType,
      target?: NodeType,
      g?: this,
    ) => boolean,
    callback: (node: NodeType, g?: this) => void,
    allowVisited: boolean = true,
    inversed: boolean = false,
  ): this {
    let gNode: NodeType | undefined;
    if (typeof node === "string") gNode = this.getNode(node);
    else gNode = node;
    if (!gNode) return this;
    const queue = new Queue<NodeType>();
    const visitedNodes = new Set<string>();
    queue.enqueue(gNode);
    while (!queue.isEmpty) {
      const currentNode = queue.dequeue();
      if (!currentNode) break;
      if (allowVisited) {
        if (visitedNodes.has(currentNode.name)) continue;
        visitedNodes.add(currentNode.name);
      }
      callback(currentNode, this);
      let edges: Map<string, EdgeType>;
      if (currentNode instanceof DirectedGraphDataNode) {
        edges = !inversed
          ? (currentNode.outEdges as Map<string, EdgeType>)
          : (currentNode.inEdges as Map<string, EdgeType>);
      } else edges = currentNode.edges as Map<string, EdgeType>;

      for (const [_, edge] of edges) {
        const target: NodeType = edge.link as NodeType;
        if (filterCallback(edge, currentNode, target, this))
          queue.enqueue(target);
      }
    }

    return this;
  }

  async traverseAsync(
    node: string | NodeType,
    filterCallback: (
      edge: GraphDataEdge<NData, EData>,
      source?: NodeType,
      target?: NodeType,
      g?: this,
    ) => Promise<boolean> | boolean,
    callback: (node: NodeType, g?: this) => Promise<void> | void,
    allowVisited: boolean = true,
    inversed: boolean = false,
  ): Promise<this> {
    let gNode: NodeType | undefined;
    if (typeof node === "string") gNode = this.getNode(node);
    else gNode = node;
    if (!gNode) return this;
    const queue = new Queue<NodeType>();
    const visitedNodes = new Set<string>();
    queue.enqueue(gNode);
    while (!queue.isEmpty) {
      const currentNode = queue.dequeue();
      if (!currentNode) break;
      if (allowVisited) {
        if (visitedNodes.has(currentNode.name)) continue;
        visitedNodes.add(currentNode.name);
      }
      await callback(currentNode, this);
      let edges: Map<string, EdgeType>;
      if (currentNode instanceof DirectedGraphDataNode) {
        edges = !inversed
          ? (currentNode.outEdges as Map<string, EdgeType>)
          : (currentNode.inEdges as Map<string, EdgeType>);
      } else edges = currentNode.edges as Map<string, EdgeType>;

      for (const [_, edge] of edges) {
        const target: NodeType = edge.link as NodeType;
        if (await filterCallback(edge, currentNode, target, this))
          queue.enqueue(target);
      }
    }

    return this;
  }
}
