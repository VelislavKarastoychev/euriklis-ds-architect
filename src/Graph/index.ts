"use strict";

import { GraphDataNode, GraphDataEdge } from "../DataNode";
import { Arc, Edge, Node, Vertex } from "../DataNode/Models";

export abstract class BaseGraph<
  N extends GraphDataNode<V, any>,
  E extends GraphDataEdge<any, any, T>,
  V = unknown,
  T = unknown,
  S = unknown,
> {
  protected __G__: Map<string, N> = new Map();
  protected __S__: S | null = null;

  constructor({
    nodes,
    edges,
    state,
  }: {
    nodes?: { name: string; data: V }[];
    edges?: { source: string; target: string; data: T }[];
    state?: S;
  } = {}) {
    if (nodes) this.nodes = nodes;
    if (edges) this.edges = edges;
    if (state) this.state = state;
  }

  protected abstract createNode({
    name,
    data,
    options,
  }: {
    name: string;
    data: unknown;
    options?: { [param: string]: unknown };
  }): N;

  get state(): S | null {
    return this.__S__;
  }

  set state(s: S) {
    this.__S__ = s;
  }

  get nodes(): { name: string; data: V | null }[] {
    const g = this.__G__;
    const nodes: { name: string; data: V | null }[] = [];
    g.forEach((node: N): number =>
      nodes.push({ name: node.name, data: node.data }),
    );

    return nodes;
  }

  set nodes(nodes: { name: string; data: V }[]) {
    for (const node of nodes) this.addNode(node);
  }

  get edges(): { source: string; target: string; data: T | null }[] {
    const g = this.__G__;
    const edges: { source: string; target: string; data: T | null }[] = [];
    g.forEach((node: N): void => {
      node.outgoing.forEach((edge: E): number =>
        edges.push({
          source: edge.source.name,
          target: edge.target.name,
          data: edge.data,
        }),
      );
    });

    return edges;
  }

  set edges(edges: { source: string; target: string; data: T }[]) {
    for (const edge of edges) this.addEdge({ ...edge, params: {} });
  }

  getNodeInstance(name: string): N | null {
    return this.__G__.get(name) || null;
  }

  getNode(name: string): { name: string; data: V | null } | null {
    const node = this.__G__.get(name);
    if (!node) return null;
    return { name: node.name, data: node.data };
  }

  addNode({ name, data }: { name: string; data: V }): this {
    const nodeAlreadyExists = (n: string): string =>
      `Node with name ${n} already exists.`;
    const g = this.__G__;
    if (g.has(name)) throw new Error(nodeAlreadyExists(name));
    const n = this.createNode({ name, data, options: {} });
    g.set(name, n);

    return this;
  }

  getEdgeInstance({
    source,
    target,
  }: {
    source: string;
    target: string;
  }): E | null {
    const g = this.__G__;
    const sourceNode = g.get(source);
    const targetNode = g.get(target);
    if (!sourceNode) return null;
    if (!targetNode) return null;
    const edge = (sourceNode.getConnection(target) as E) || null;

    return edge;
  }

  getEdge({
    source,
    target,
  }: {
    source: string;
    target: string;
  }): { source: string; target: string; data: T | null } | null {
    const g = this.__G__;
    const sourceNode = g.get(source);
    const targetNode = g.get(target);
    if (!sourceNode) return null;
    if (!targetNode) return null;
    const edgeInstance = (sourceNode.getConnection(target) as E) || null;
    if (!edgeInstance) return null;
    return {
      source: edgeInstance.source.name,
      target: edgeInstance.target.name,
      data: edgeInstance.data,
    };
  }

  addEdge({
    source,
    target,
    data,
    params,
  }: {
    source: string;
    target: string;
    data: T;
    params: { [param: string]: unknown };
  }): this {
    const g = this.__G__;
    const edgeAlreadyExists: string = `Edge with source ${source} and target ${target} already exists.`;
    const nodeNotExists = (n: string): string =>
      `Node with name ${n} not exists.`;
    const sourceNode = g.get(source);
    const targetNode = g.get(target);
    if (!sourceNode) throw new Error(nodeNotExists(source));
    if (!targetNode) throw new Error(nodeNotExists(target));
    if (sourceNode.outgoing.has(target)) throw new Error(edgeAlreadyExists);
    sourceNode.connect<T>({ node: targetNode, data, params });

    return this;
  }

  /**
   * Removes a node of the graph given the name of the node.
   * Complexity: O(In + Oout) where In and Out are the
   * indegree and the outgegree of the node.
   * @param {string} name - the name of the node to
   * be deleted.
   * @returns {N | null} The deleted node or null if the
   * node does not exists.
   */
  removeNode(name: string): N | null {
    const g = this.__G__;
    const node = g.get(name);
    if (!node) return null;
    // get the incomming and the outgoing connections.
    const incomming = node.incomming;
    const outgoing = node.outgoing;
    // delete the node from the outgoing
    // connection of the incomming connections
    // of the node.
    for (const [_, n] of incomming) {
      n.source.outgoing.delete(name);
    }

    // delete the node from the incomming
    // connections of the outgoing connectins
    // of the node.
    for (const [_, n] of outgoing) {
      n.target.incomming.delete(name);
    }

    g.delete(name);

    return node;
  }

  removeEdge({ source, target }: { source: string; target: string }): E | null {
    const g = this.__G__;
    const sourceNode: N | undefined = g.get(source);
    const targetNode: N | undefined = g.get(target);
    if (!sourceNode) return null;
    if (!targetNode) return null;
    return sourceNode.removeConnection({ node: targetNode }) || null;
  }
}

export class Graph<D = unknown, T = unknown, S = unknown> extends BaseGraph<
  Vertex<D>,
  Edge<T>,
  D,
  T,
  S
> {
  protected override createNode({
    name,
    data,
  }: {
    name: string;
    data: D;
  }): Vertex<D> {
    return new Vertex<D>({ name, data });
  }

  inDegree(name: string): number {
    const nodeNotExists = `Node with name ${name} does not exists in the graph.`;
    const g = this.__G__;
    const node = g.get(name);
    if (!node) throw new Error(nodeNotExists);

    return node.inDegree;
  }

  outDegree(name: string): number {
    const nodeNotExists = `Node with name ${name} does not exists in the graph.`;
    const g = this.__G__;
    const node = g.get(name);
    if (!node) throw new Error(nodeNotExists);

    return node.outDegree;
  }
}

export class BaseNetwork<V, T, S = unknown> extends BaseGraph<
  Node<V>,
  Arc<T>,
  V,
  T,
  S
> {
  constructor({
    nodes,
    edges,
  }: {
    nodes?: { name: string; data: V; value: number }[];
    edges?: { source: string; target: string; data: T; weight: number }[];
  }) {
    super({ nodes, edges });
  }
  protected override createNode({
    name,
    data,
    options,
  }: {
    name: string;
    data: V;
    options: { value: number };
  }): Node<V> {
    const { value } = options;
    return new Node<V>({
      name,
      data,
      value,
    });
  }

  public override getNode(
    name: string,
  ): { name: string; data: V | null; value: number } | null {
    const g = this.__G__;
    const node = g.get(name);
    if (!node) return null;
    return { name: node.name, data: node.data, value: node.value };
  }

  public inDegree(name: string): number {
    const nodeNotExists = `Node with name ${name} does not exists in the graph.`;
    const g = this.__G__;
    const node = g.get(name);
    if (!node) throw new Error(nodeNotExists);

    return node.inDegree;
  }

  public outDegree(name: string): number {
    const nodeNotExists = `Node with name ${name} does not exists in the graph.`;
    const g = this.__G__;
    const node = g.get(name);
    if (!node) throw new Error(nodeNotExists);

    return node.outDegree;
  }
}
