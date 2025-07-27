"use strict";

import type { Integer } from "../../../Types";
import { GraphDataNode, GraphDataEdge } from "../../DataNode";
import { Arc, Edge, Node, Vertex } from "../../DataNode/Models";
import { Queue } from "../../Queue";
import { DynamicStack } from "../../Stack";

/**
 * Generic graph container used by all higher level graph structures.
 * Manages a map of nodes and their connecting edges.
 */
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

  addNode({
    name,
    data,
    options = {},
  }: {
    name: string;
    data: V;
    options?: { [prop: string]: unknown };
  }): this {
    const nodeAlreadyExists = (n: string): string =>
      `Node with name ${n} already exists.`;
    const g = this.__G__;
    if (g.has(name)) throw new Error(nodeAlreadyExists(name));
    const n = this.createNode({ name, data, options });
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
    // get the incoming and the outgoing connections.
    const incoming = node.incoming;
    const outgoing = node.outgoing;
    // delete the node from the outgoing
    // connection of the incoming connections
    // of the node.
    for (const [_, n] of incoming) {
      n.source.outgoing.delete(name);
    }

    // delete the node from the incoming
    // connections of the outgoing connectins
    // of the node.
    for (const [_, n] of outgoing) {
      n.target.incoming.delete(name);
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
