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
      if (this.symmetric)
        edges.push(
          ...(node as DirectedGraphDataNode<NData, EData>).getIncommingEdges(),
        );
    }

    return edges;
  }

  hasNode(name: string): boolean {
    return this.__graph__.has(name);
  }

  getNode(name: string): NodeType | undefined {
    return this.__graph__.get(name);
  }

  @ifNodeExistsThrow(errors.NodeAlreadyExists)
  addNode({
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

  updateNode({
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

  removeNode(name: string): NodeType | undefined {
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
  addEdge({
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
    if (this.NODE_CONSTRUCTOR === DirectedGraphDataNode)
      (sourceNode as DirectedGraphDataNode<NData, EData>).addOutgoingEdge({
        target: targetNode as DirectedGraphDataNode<NData, EData>,
        data,
        weight,
      });
    else if (this.NODE_CONSTRUCTOR === UndirectedGraphDataNode) {
      (sourceNode as UndirectedGraphDataNode<NData, EData>).addEdge({
        target: targetNode as UndirectedGraphDataNode<NData, EData>,
        data,
        weight,
      });
    }

    return this;
  }
}
