"use strict";

import type { Integer } from "../../Types";
import { GraphDataNode, GraphDataEdge } from "../DataNode";
import { Arc, Edge, Node, Vertex } from "../DataNode/Models";
import { Queue } from "../Queue";
import { DynamicStack } from "../Stack";

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

/*
 * This class implements a variant of computation graph
 * which may be used for general purposes like transitions graphs,
 * computational graphs, LLM agent graph structures etc.
 * The main difference with the Graph instance is that this
 * structure provides only the basic methods for creating, updating,
 * reading and deletion of nodes/edges of the Graph, while in the Graph
 * structuture we provide a set of algorithms which are related with the
 * Graph structutures like BFS, DFS, PERT, CPM, Kruscal etc.
 **/
export class StateGraph<
  D = unknown, // The data type of the nodes.
  T = unknown, // The data type of the edges.
  S = unknown, // The data type of the state of the graph.
> extends BaseGraph<Vertex<D>, Edge<T>, D, T, S> {
  protected override createNode({
    name,
    data,
  }: {
    name: string;
    data: D;
  }): Vertex<D> {
    return new Vertex<D>({ name, data });
  }

  clone(): StateGraph<D, T, S> {
    const g = new StateGraph<D, T, S>();
    for (const node of this) {
      g.addNode({ name: node.name, data: node.data as D });
    }

    for (const edge of this.edges) {
      g.addEdge({
        source: edge.source,
        target: edge.target,
        data: edge.data as T,
        params: {},
      });
    }
    return g;
  }

  upgradeToGraph(): Graph<D, T, S> {
    const g = new Graph<D, T, S>();
    for (const node of this.nodes) {
      g.addNode({
        name: node.name,
        data: node.data as D,
      });
    }

    for (const edge of this.edges) {
      g.addEdge({
        source: edge.source,
        target: edge.target,
        data: edge.data as T,
        params: {},
      });
    }

    return g;
  }

  upgradeToBaseNetwork(): BaseNetwork<D, T, S> {
    const g = new BaseNetwork<D, T, S>();
    for (const node of this) {
      g.addNode({
        name: node.name,
        data: node.data as D,
        options: { value: 1 },
      });
    }

    for (const edge of this.edges) {
      g.addEdge({
        source: edge.source,
        target: edge.target,
        data: edge.data as T,
        params: { weight: 1 },
      });
    }

    return g;
  }

  [Symbol.iterator](): Iterator<Vertex<D>> {
    return this.__G__.values();
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
    options,
  }: {
    name: string;
    data: D;
    options: { [prop: string]: unknown };
  }): Vertex<D> {
    return new Vertex<D>({ name, data, ...options });
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

  get order(): Integer {
    return this.__G__.size;
  }

  get size(): Integer {
    let size = 0;
    for (const node of this) {
      size += node.outgoing.size;
    }

    return size;
  }

  get density(): number {
    const n = this.order;
    const s = this.size;

    return s / (n * n);
  }

  BFSNode({
    startingNode,
    callback = (): void => {},
    errorCallback = (_: Vertex<D> | null, error: Error): void =>
      console.log(error.message),
  }: {
    startingNode: Vertex<D> | string;
    callback?: (node: Vertex<D> | null, g?: Graph<D>) => unknown;
    errorCallback?: (
      node: Vertex<D> | null,
      error: Error,
      g?: Graph<D>,
    ) => unknown;
  }): this {
    const queue = new Queue<Vertex<D>>();
    const visited = new Set();
    let s: Vertex<D> | undefined;
    if (startingNode) {
      if (typeof startingNode === "string") {
        if (this.__G__.has(startingNode))
          s = this.__G__.get(startingNode) as Vertex<D>;
      } else if (this.__G__.has(startingNode.name)) {
        s = this.__G__.get(startingNode.name) as Vertex<D>;
      }
    }

    if (!s) return this;
    queue.enqueue(s);
    visited.add(s.name);
    while (!queue.isEmpty) {
      // execute the callback:
      const node = queue.dequeue() as Vertex<D>;
      try {
        callback(node, this);
      } catch (error) {
        errorCallback(node, error as Error, this);
      }
      for (const edge of node.outgoing.values()) {
        const target = edge.target as Vertex<D>;
        if (!visited.has(target.name)) {
          visited.add(target.name);
          queue.enqueue(target);
        }
      }
    }

    return this;
  }

  async BFSNodeAsync({
    startingNode,
    callback = async (): Promise<void> => {},
    errorCallback = async (_: Vertex<D> | null, error: Error): Promise<void> =>
      console.log(error.message),
  }: {
    startingNode: Vertex<D> | string;
    callback?: (node: Vertex<D> | null, g?: Graph<D>) => Promise<unknown>;
    errorCallback?: (
      node: Vertex<D> | null,
      error: Error,
      g?: Graph<D>,
    ) => Promise<unknown>;
  }): Promise<this> {
    const queue = new Queue<Vertex<D>>();
    const visited = new Set();
    let s: Vertex<D> | undefined;
    if (startingNode) {
      if (typeof startingNode === "string") {
        if (this.__G__.has(startingNode))
          s = this.__G__.get(startingNode) as Vertex<D>;
      } else if (this.__G__.has(startingNode.name)) {
        s = this.__G__.get(startingNode.name) as Vertex<D>;
      }
    }

    if (!s) return this;
    queue.enqueue(s);
    visited.add(s?.name);
    while (!queue.isEmpty) {
      // execute the callback:
      const node = queue.dequeue() as Vertex<D>;
      try {
        await callback(node as Vertex<D>, this);
      } catch (error) {
        await errorCallback(node, error as Error, this);
      }
      for (const edge of node.outgoing.values()) {
        const target = edge.target as Vertex<D>;
        if (!visited.has(target.name)) {
          visited.add(target.name);
          queue.enqueue(target);
        }
      }
    }

    return this;
  }

  BFS({
    callback = (): void => {},
    errorCallback = (_: Vertex<D> | null, error: Error): void =>
      console.log(error.message),
  }: {
    callback?: (node: Vertex<D> | null, g?: Graph<D>) => unknown;
    errorCallback?: (
      node: Vertex<D> | null,
      error: Error,
      g?: Graph<D>,
    ) => unknown;
  } = {}): this {
    const queue = new Queue<Vertex<D>>();
    const visited = new Set<string>();
    for (const node of this) {
      if (visited.has(node.name)) continue;
      queue.enqueue(node);
      visited.add(node.name);
      while (!queue.isEmpty) {
        const n: Vertex<D> = queue.dequeue() as Vertex<D>;
        try {
          callback(n, this);
        } catch (error) {
          errorCallback(n, error as Error, this);
        }
        for (const edge of n.outgoing.values()) {
          const target = edge.target as Vertex<D>;
          if (!visited.has(target.name)) {
            queue.enqueue(target);
            visited.add(target.name);
          }
        }
      }
    }
    return this;
  }

  async BFSAsync({
    callback = async (): Promise<void> => {},
    errorCallback = async (_: Vertex<D>, error: Error): Promise<unknown> =>
      console.log(error.message),
  }: {
    callback?: (node: Vertex<D>, g?: Graph<D>) => Promise<unknown>;
    errorCallback?: (
      node: Vertex<D>,
      error: Error,
      g?: Graph<D>,
    ) => Promise<unknown>;
  } = {}): Promise<this> {
    const queue = new Queue<Vertex<D>>();
    const visited = new Set<string>();
    for (const node of this) {
      if (visited.has(node.name)) continue;
      queue.enqueue(node);
      visited.add(node.name);
      while (!queue.isEmpty) {
        const n: Vertex<D> = queue.dequeue() as Vertex<D>;
        try {
          await callback(n, this);
        } catch (error) {
          await errorCallback(n, error as Error, this);
        }
        for (const edge of n.outgoing.values()) {
          const target: Vertex<D> = edge.target as Vertex<D>;
          if (!visited.has(target.name)) {
            queue.enqueue(target);
            visited.add(target.name);
          }
        }
      }
    }

    return this;
  }

  DFS({
    callback = (): void => {},
    errorCallback = (_: Vertex<D>, error: Error): void =>
      console.log(error.message),
  }: {
    callback?: (node: Vertex<D>, g?: Graph<D>) => unknown;
    errorCallback?: (node: Vertex<D>, error: Error, g?: Graph<D>) => unknown;
  }): this {
    const stack = new DynamicStack<Vertex<D>>();
    const visited = new Set<string>();
    for (const node of this) {
      if (visited.has(node.name)) continue;
      stack.push(node);
      visited.add(node.name);
      while (!stack.isEmpty) {
        const n: Vertex<D> = stack.pop() as Vertex<D>;
        try {
          callback(n, this);
        } catch (error) {
          errorCallback(n, error as Error, this);
        }
        for (const edge of n.outgoing.values()) {
          const target: Vertex<D> = edge.target as Vertex<D>;
          if (!visited.has(target.name)) {
            stack.push(target);
            visited.add(target.name);
          }
        }
      }
    }
    return this;
  }

  async DFSAsync({
    callback = async (): Promise<void> => {},
    errorCallback = async (_: Vertex<D>, error: Error): Promise<void> =>
      console.log(error.message),
  }: {
    callback?: (node: Vertex<D>, g?: Graph<D>) => Promise<unknown>;
    errorCallback?: (
      node: Vertex<D>,
      error: Error,
      g?: Graph<D>,
    ) => Promise<unknown>;
  } = {}): Promise<this> {
    const stack = new DynamicStack<Vertex<D>>();
    const visited = new Set<string>();
    for (const node of this) {
      if (visited.has(node.name)) continue;
      stack.push(node);
      visited.add(node.name);
      while (!stack.isEmpty) {
        const n: Vertex<D> = stack.pop() as Vertex<D>;
        try {
          await callback(n, this);
        } catch (error) {
          await errorCallback(n, error as Error, this);
        }
        for (const edge of n.outgoing.values()) {
          const target = edge.target as Vertex<D>;
          if (!visited.has(target.name)) {
            stack.push(target);
            visited.add(target.name);
          }
        }
      }
    }

    return this;
  }

  DFSNode({
    startingNode,
    callback = (): void => {},
    errorCallback = (_: Vertex<D>, error: Error): void =>
      console.log(error.message),
  }: {
    startingNode: Vertex<D> | string;
    callback?: (node: Vertex<D>, g?: Graph<D>) => unknown;
    errorCallback?: (node: Vertex<D>, error: Error, g?: Graph<D>) => unknown;
  }): this {
    const stack = new DynamicStack<Vertex<D>>();
    const visited = new Set<string>();
    let s: Vertex<D> | undefined;
    if (startingNode) {
      if (typeof startingNode === "string") {
        if (this.__G__.has(startingNode))
          s = this.__G__.get(startingNode) as Vertex<D>;
      } else if (this.__G__.has(startingNode.name)) {
        s = this.__G__.get(startingNode.name) as Vertex<D>;
      }
    }

    if (!s) return this;
    stack.push(s);
    visited.add(s.name);
    while (!stack.isEmpty) {
      const node = stack.pop() as Vertex<D>;
      try {
        callback(node, this);
      } catch (error) {
        errorCallback(node, error as Error, this);
      }
      for (const edge of node.outgoing.values()) {
        const target = edge.target as Vertex<D>;
        if (!visited.has(target.name)) {
          visited.add(target.name);
          stack.push(target);
        }
      }
    }

    return this;
  }

  async DFSNodeAsync({
    startingNode,
    callback = async (): Promise<void> => {},
    errorCallback = async (_: Vertex<D>, error: Error): Promise<void> =>
      console.log(error.message),
  }: {
    startingNode: Vertex<D> | string;
    callback?: (node: Vertex<D>, g?: Graph<D>) => Promise<unknown>;
    errorCallback?: (
      node: Vertex<D>,
      error: Error,
      g?: Graph<D>,
    ) => Promise<unknown>;
  }): Promise<this> {
    const stack = new DynamicStack<Vertex<D>>();
    const visited = new Set<string>();
    let s: Vertex<D> | undefined;
    if (startingNode) {
      if (typeof startingNode === "string") {
        if (this.__G__.has(startingNode))
          s = this.__G__.get(startingNode) as Vertex<D>;
      } else if (this.__G__.has(startingNode.name)) {
        s = this.__G__.get(startingNode.name) as Vertex<D>;
      }
    }

    if (!s) return this;
    stack.push(s);
    visited.add(s.name);
    while (!stack.isEmpty) {
      const node = stack.pop() as Vertex<D>;
      try {
        await callback(node, this);
      } catch (error) {
        await errorCallback(node, error as Error, this);
      }
      for (const edge of node.outgoing.values()) {
        const target = edge.target as Vertex<D>;
        if (!visited.has(target.name)) {
          visited.add(target.name);
          stack.push(target);
        }
      }
    }

    return this;
  }

  clone(): Graph<D, T, S> {
    const g = new Graph<D, T, S>();
    for (const node of this.nodes) {
      g.addNode({ name: node.name, data: node.data as D });
    }

    for (const e of this.edges) {
      g.addEdge({
        source: e.source,
        target: e.target,
        data: e.data as T,
        params: {},
      });
    }

    return g;
  }

  upgradeToBaseNetwork(): BaseNetwork<D, T, S> {
    const g = new BaseNetwork<D, T, S>();
    for (const node of this.nodes) {
      g.addNode({ name: node.name, data: node.data as D });
    }

    for (const e of this.edges) {
      g.addEdge({
        source: e.source,
        target: e.target,
        data: e.data as T,
        params: { weight: 1 },
      });
    }

    return g;
  }

  subgraph({
    callback,
  }: {
    callback: (node: Vertex<D>, g: Graph<D, T, S>) => boolean;
  }): Graph<D, T, S> {
    const sg = new Graph<D, T, S>();
    const keep = new Set<string>();
    for (const node of this) {
      if (callback(node, this)) {
        sg.addNode({ name: node.name, data: node.data as D });
        keep.add(node.name);
      }
    }

    for (const edge of this.edges) {
      if (keep.has(edge.source) && keep.has(edge.target)) {
        sg.addEdge({
          source: edge.source,
          target: edge.target,
          data: edge.data as T,
          params: {},
        });
      }
    }

    return sg;
  }

  union(g2: Graph<D, T, S>): Graph<D, T, S> {
    const u = this.clone();
    for (const node of g2.nodes) {
      if (!u.getNodeInstance(node.name))
        u.addNode({ name: node.name, data: node.data as D });
    }

    for (const edge of g2.edges) {
      if (!u.getEdgeInstance({ source: edge.source, target: edge.target })) {
        u.addEdge({
          source: edge.source,
          target: edge.target,
          data: edge.data as T,
          params: {},
        });
      }
    }

    return u;
  }

  difference(g2: Graph<D, T, S>): Graph<D, T, S> {
    const d = this.clone();
    for (const node of g2.nodes) {
      if (d.getNodeInstance(node.name)) d.removeNode(node.name);
    }

    for (const edge of g2.edges) {
      d.removeEdge({ source: edge.source, target: edge.target });
    }

    return d;
  }

  kronecker<D2, T2>(g2: Graph<D2, T2>): Graph<[D, D2], [T, T2], S> {
    const k = new Graph<[D, D2], [T, T2], S>();

    for (const n1 of this) {
      for (const n2 of g2) {
        k.addNode({
          name: `${n1.name}|${n2.name}`,
          data: [n1.data as D, n2.data as D2],
        });
      }
    }

    for (const e1 of this.edges) {
      for (const e2 of g2.edges) {
        k.addEdge({
          source: `${e1.source}|${e2.source}`,
          target: `${e1.target}|${e2.target}`,
          data: [e1.data as T, e2.data as T2],
          params: {},
        });
      }
    }

    return k;
  }

  /**
   * Check if the graph is connected using an undirected traversal.
   */
  isConnected(): boolean {
    if (this.order === 0) return true;
    const start = this.__G__.values().next().value as Vertex<D>;
    const visited = new Set<string>();
    const stack = [start];
    visited.add(start.name);
    while (stack.length) {
      const node = stack.pop() as Vertex<D>;
      for (const edge of node.outgoing.values()) {
        const target = edge.target as Vertex<D>;
        if (!visited.has(target.name)) {
          visited.add(target.name);
          stack.push(target);
        }
      }
      for (const edge of node.incomming.values()) {
        const source = edge.source as Vertex<D>;
        if (!visited.has(source.name)) {
          visited.add(source.name);
          stack.push(source);
        }
      }
    }

    return visited.size === this.order;
  }

  /**
   * Return all simple cycles in the graph as arrays of node names.
   */
  cycles(): string[][] {
    const cycles: string[][] = [];
    const path: string[] = [];
    const onStack = new Set<string>();
    const visited = new Set<string>();
    const found = new Set<string>();

    const dfs = (node: Vertex<D>) => {
      visited.add(node.name);
      onStack.add(node.name);
      path.push(node.name);

      for (const edge of node.outgoing.values()) {
        const target = edge.target as Vertex<D>;
        if (!onStack.has(target.name)) {
          if (!visited.has(target.name)) dfs(target);
        } else {
          const idx = path.indexOf(target.name);
          if (idx !== -1) {
            const cycle = [...path.slice(idx), target.name];
            const key = cycle.join("->");
            if (!found.has(key)) {
              cycles.push(cycle);
              found.add(key);
            }
          }
        }
      }

      path.pop();
      onStack.delete(node.name);
    };

    for (const node of this) {
      if (!visited.has(node.name)) dfs(node);
    }

    return cycles;
  }

  /**
   * Try to find a Hamiltonian cycle. Returns the cycle or null.
   */
  Hamiltonian(): string[] | null {
    const n = this.order;
    if (n === 0) return [];
    const nodes = [...this.__G__.keys()];
    const start = nodes[0];
    const path: string[] = [];
    const visited = new Set<string>();

    const dfs = (current: string): boolean => {
      visited.add(current);
      path.push(current);
      if (path.length === n) {
        const last = this.__G__.get(current)!;
        if (last.outgoing.has(start)) {
          path.push(start);
          return true;
        }
      }
      for (const [next] of this.__G__.get(current)!.outgoing) {
        if (!visited.has(next) && dfs(next)) return true;
      }
      visited.delete(current);
      path.pop();
      return false;
    };

    if (dfs(start)) return path;
    return null;
  }

  /**
   * Determine if the graph is bipartite using BFS coloring.
   */
  biGraph(): boolean {
    if (this.order === 0) return true;
    const color = new Map<string, number>();
    for (const node of this) {
      if (color.has(node.name)) continue;
      color.set(node.name, 0);
      const queue: Vertex<D>[] = [node];
      while (queue.length) {
        const u = queue.shift() as Vertex<D>;
        const uColor = color.get(u.name) as number;
        const neighbors: Vertex<D>[] = [];
        for (const e of u.outgoing.values())
          neighbors.push(e.target as Vertex<D>);
        for (const e of u.incomming.values())
          neighbors.push(e.source as Vertex<D>);
        for (const v of neighbors) {
          if (!color.has(v.name)) {
            color.set(v.name, 1 - uColor);
            queue.push(v);
          } else if (color.get(v.name) === uColor) {
            return false;
          }
        }
      }
    }
    return true;
  }

  /**
   * Generate an n-dimensional cube graph.
   */
  static nCube(n: number): Graph<number[], null> {
    const g = new Graph<number[], null>();
    const total = 1 << n;
    for (let i = 0; i < total; i++) {
      const bits = i.toString(2).padStart(n, "0").split("").map(Number);
      g.addNode({ name: i.toString(), data: bits });
    }
    for (let i = 0; i < total; i++) {
      for (let j = 0; j < n; j++) {
        const neighbor = i ^ (1 << j);
        g.addEdge({
          source: i.toString(),
          target: neighbor.toString(),
          data: null,
          params: {},
        });
      }
    }
    return g;
  }

  [Symbol.iterator](): Iterator<Vertex<D>> {
    return this.__G__.values();
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
  } = {}) {
    super({ nodes, edges });
  }
  protected override createNode({
    name,
    data,
    options,
  }: {
    name: string;
    data: V;
    options: { value: number; [prop: string]: unknown };
  }): Node<V> {
    return new Node<V>({
      name,
      data,
      ...options,
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

  get order(): Integer {
    return this.__G__.size;
  }

  get weightedOrder(): number {
    let order = 0;
    for (const node of this) {
      order += node.value;
    }

    return order;
  }

  get size(): Integer {
    let size = 0;
    for (const node of this) {
      size += node.outgoing.size;
    }

    return size;
  }

  get weightedSize(): number {
    let weightedSize = 0;
    for (const node of this) {
      for (const [_, e] of node.outgoing) {
        weightedSize += e.weight;
      }
    }

    return weightedSize;
  }

  get density(): number {
    const n = this.order;
    const s = this.size;

    return s / (n * n);
  }

  get weightedDensity(): number {
    const n = this.order;
    const s = this.weightedSize;

    return s / (n * n);
  }

  get nodes(): { name: string; data: V | null; value: number }[] {
    const nodes: { name: string; data: V | null; value: number }[] = [];
    for (const node of this) {
      nodes.push({
        name: node.name,
        data: node.data,
        value: node.value,
      });
    }

    return nodes;
  }

  get edges(): { source: string; target: string; data: T; weight: number }[] {
    const E: { source: string; target: string; data: T; weight: number }[] = [];
    for (const node of this) {
      for (const [_, e] of node.outgoing)
        E.push({
          source: e.source.name,
          target: e.target.name,
          data: e.data,
          weight: e.weight,
        });
    }

    return E;
  }

  clone() {
    const g = new BaseNetwork<V, T, S>();
    for (const node of this.nodes) {
      g.addNode({
        name: node.name,
        data: node.data as V,
        options: { value: node.value },
      });
    }

    for (const edge of this.edges) {
      g.addEdge({
        source: edge.source,
        target: edge.target,
        data: edge.data,
        params: { weight: edge.weight },
      });
    }

    return g;
  }

  BFSNode({
    startingNode,
    callback = (): void => {},
    errorCallback = (_: Node<V> | null, error: Error): void =>
      console.log(error.message),
  }: {
    startingNode: Node<V> | string;
    callback?: (node: Node<V> | null, g?: BaseNetwork<V, T>) => unknown;
    errorCallback?: (
      node: Node<V> | null,
      error: Error,
      g?: BaseNetwork<V, T>,
    ) => unknown;
  }): this {
    const queue = new Queue<Node<V>>();
    const visited = new Set<string>();
    let s: Node<V> | undefined;
    if (startingNode) {
      if (typeof startingNode === "string") {
        if (this.__G__.has(startingNode))
          s = this.__G__.get(startingNode) as Node<V>;
      } else if (this.__G__.has(startingNode.name)) {
        s = this.__G__.get(startingNode.name) as Node<V>;
      }
    }

    if (!s) return this;
    queue.enqueue(s);
    visited.add(s.name);
    while (!queue.isEmpty) {
      const node = queue.dequeue() as Node<V>;
      try {
        callback(node, this);
      } catch (error) {
        errorCallback(node, error as Error, this);
      }
      for (const edge of node.outgoing.values()) {
        const target = edge.target as Node<V>;
        if (!visited.has(target.name)) {
          visited.add(target.name);
          queue.enqueue(target);
        }
      }
    }

    return this;
  }

  async BFSNodeAsync({
    startingNode,
    callback = async (): Promise<void> => {},
    errorCallback = async (_: Node<V> | null, error: Error): Promise<void> =>
      console.log(error.message),
  }: {
    startingNode: Node<V> | string;
    callback?: (
      node: Node<V> | null,
      g?: BaseNetwork<V, T>,
    ) => Promise<unknown>;
    errorCallback?: (
      node: Node<V> | null,
      error: Error,
      g?: BaseNetwork<V, T>,
    ) => Promise<unknown>;
  }): Promise<this> {
    const queue = new Queue<Node<V>>();
    const visited = new Set<string>();
    let s: Node<V> | undefined;
    if (startingNode) {
      if (typeof startingNode === "string") {
        if (this.__G__.has(startingNode))
          s = this.__G__.get(startingNode) as Node<V>;
      } else if (this.__G__.has(startingNode.name)) {
        s = this.__G__.get(startingNode.name) as Node<V>;
      }
    }

    if (!s) return this;
    queue.enqueue(s);
    visited.add(s.name);
    while (!queue.isEmpty) {
      const node = queue.dequeue() as Node<V>;
      try {
        await callback(node, this);
      } catch (error) {
        await errorCallback(node, error as Error, this);
      }
      for (const edge of node.outgoing.values()) {
        const target = edge.target as Node<V>;
        if (!visited.has(target.name)) {
          visited.add(target.name);
          queue.enqueue(target);
        }
      }
    }

    return this;
  }

  BFS({
    callback = (): void => {},
    errorCallback = (_: Node<V> | null, error: Error): void =>
      console.log(error.message),
  }: {
    callback?: (node: Node<V> | null, g?: BaseNetwork<V, T>) => unknown;
    errorCallback?: (
      node: Node<V> | null,
      error: Error,
      g?: BaseNetwork<V, T>,
    ) => unknown;
  } = {}): this {
    const queue = new Queue<Node<V>>();
    const visited = new Set<string>();
    for (const node of this) {
      if (visited.has(node.name)) continue;
      queue.enqueue(node);
      visited.add(node.name);
      while (!queue.isEmpty) {
        const n: Node<V> = queue.dequeue() as Node<V>;
        try {
          callback(n, this);
        } catch (error) {
          errorCallback(n, error as Error, this);
        }
        for (const edge of n.outgoing.values()) {
          const target = edge.target as Node<V>;
          if (!visited.has(target.name)) {
            queue.enqueue(target);
            visited.add(target.name);
          }
        }
      }
    }
    return this;
  }

  async BFSAsync({
    callback = async (): Promise<void> => {},
    errorCallback = async (_: Node<V>, error: Error): Promise<unknown> =>
      console.log(error.message),
  }: {
    callback?: (node: Node<V>, g?: BaseNetwork<V, T>) => Promise<unknown>;
    errorCallback?: (
      node: Node<V>,
      error: Error,
      g?: BaseNetwork<V, T>,
    ) => Promise<unknown>;
  } = {}): Promise<this> {
    const queue = new Queue<Node<V>>();
    const visited = new Set<string>();
    for (const node of this) {
      if (visited.has(node.name)) continue;
      queue.enqueue(node);
      visited.add(node.name);
      while (!queue.isEmpty) {
        const n: Node<V> = queue.dequeue() as Node<V>;
        try {
          await callback(n, this);
        } catch (error) {
          await errorCallback(n, error as Error, this);
        }
        for (const edge of n.outgoing.values()) {
          const target: Node<V> = edge.target as Node<V>;
          if (!visited.has(target.name)) {
            queue.enqueue(target);
            visited.add(target.name);
          }
        }
      }
    }

    return this;
  }

  DFS({
    callback = (): void => {},
    errorCallback = (_: Node<V>, error: Error): void =>
      console.log(error.message),
  }: {
    callback?: (node: Node<V>, g?: BaseNetwork<V, T>) => unknown;
    errorCallback?: (
      node: Node<V>,
      error: Error,
      g?: BaseNetwork<V, T>,
    ) => unknown;
  }): this {
    const stack = new DynamicStack<Node<V>>();
    const visited = new Set<string>();
    for (const node of this) {
      if (visited.has(node.name)) continue;
      stack.push(node);
      visited.add(node.name);
      while (!stack.isEmpty) {
        const n: Node<V> = stack.pop() as Node<V>;
        try {
          callback(n, this);
        } catch (error) {
          errorCallback(n, error as Error, this);
        }
        for (const edge of n.outgoing.values()) {
          const target: Node<V> = edge.target as Node<V>;
          if (!visited.has(target.name)) {
            stack.push(target);
            visited.add(target.name);
          }
        }
      }
    }
    return this;
  }

  async DFSAsync({
    callback = async (): Promise<void> => {},
    errorCallback = async (_: Node<V>, error: Error): Promise<void> =>
      console.log(error.message),
  }: {
    callback?: (node: Node<V>, g?: BaseNetwork<V, T>) => Promise<unknown>;
    errorCallback?: (
      node: Node<V>,
      error: Error,
      g?: BaseNetwork<V, T>,
    ) => Promise<unknown>;
  } = {}): Promise<this> {
    const stack = new DynamicStack<Node<V>>();
    const visited = new Set<string>();
    for (const node of this) {
      if (visited.has(node.name)) continue;
      stack.push(node);
      visited.add(node.name);
      while (!stack.isEmpty) {
        const n: Node<V> = stack.pop() as Node<V>;
        try {
          await callback(n, this);
        } catch (error) {
          await errorCallback(n, error as Error, this);
        }
        for (const edge of n.outgoing.values()) {
          const target = edge.target as Node<V>;
          if (!visited.has(target.name)) {
            stack.push(target);
            visited.add(target.name);
          }
        }
      }
    }

    return this;
  }

  DFSNode({
    startingNode,
    callback = (): void => {},
    errorCallback = (_: Node<V>, error: Error): void =>
      console.log(error.message),
  }: {
    startingNode: Node<V> | string;
    callback?: (node: Node<V>, g?: BaseNetwork<V, T>) => unknown;
    errorCallback?: (
      node: Node<V>,
      error: Error,
      g?: BaseNetwork<V, T>,
    ) => unknown;
  }): this {
    const stack = new DynamicStack<Node<V>>();
    const visited = new Set<string>();
    let s: Node<V> | undefined;
    if (startingNode) {
      if (typeof startingNode === "string") {
        if (this.__G__.has(startingNode))
          s = this.__G__.get(startingNode) as Node<V>;
      } else if (this.__G__.has(startingNode.name)) {
        s = this.__G__.get(startingNode.name) as Node<V>;
      }
    }

    if (!s) return this;
    stack.push(s);
    visited.add(s.name);
    while (!stack.isEmpty) {
      const node = stack.pop() as Node<V>;
      try {
        callback(node, this);
      } catch (error) {
        errorCallback(node, error as Error, this);
      }
      for (const edge of node.outgoing.values()) {
        const target = edge.target as Node<V>;
        if (!visited.has(target.name)) {
          visited.add(target.name);
          stack.push(target);
        }
      }
    }

    return this;
  }

  async DFSNodeAsync({
    startingNode,
    callback = async (): Promise<void> => {},
    errorCallback = async (_: Node<V>, error: Error): Promise<void> =>
      console.log(error.message),
  }: {
    startingNode: Node<V> | string;
    callback?: (node: Node<V>, g?: BaseNetwork<V, T>) => Promise<unknown>;
    errorCallback?: (
      node: Node<V>,
      error: Error,
      g?: BaseNetwork<V, T>,
    ) => Promise<unknown>;
  }): Promise<this> {
    const stack = new DynamicStack<Node<V>>();
    const visited = new Set<string>();
    let s: Node<V> | undefined;
    if (startingNode) {
      if (typeof startingNode === "string") {
        if (this.__G__.has(startingNode))
          s = this.__G__.get(startingNode) as Node<V>;
      } else if (this.__G__.has(startingNode.name)) {
        s = this.__G__.get(startingNode.name) as Node<V>;
      }
    }

    if (!s) return this;
    stack.push(s);
    visited.add(s.name);
    while (!stack.isEmpty) {
      const node = stack.pop() as Node<V>;
      try {
        await callback(node, this);
      } catch (error) {
        await errorCallback(node, error as Error, this);
      }
      for (const edge of node.outgoing.values()) {
        const target = edge.target as Node<V>;
        if (!visited.has(target.name)) {
          visited.add(target.name);
          stack.push(target);
        }
      }
    }

    return this;
  }

  subgraph({
    callback,
  }: {
    callback: (node: Node<V>, g: BaseNetwork<V, T, S>) => boolean;
  }): BaseNetwork<V, T, S> {
    const sg = new BaseNetwork<V, T, S>();
    const keep = new Set<string>();
    for (const node of this) {
      if (callback(node, this)) {
        sg.addNode({
          name: node.name,
          data: node.data as V,
          options: { value: node.value },
        });
        keep.add(node.name);
      }
    }

    for (const edge of this.edges) {
      if (keep.has(edge.source) && keep.has(edge.target)) {
        sg.addEdge({
          source: edge.source,
          target: edge.target,
          data: edge.data,
          params: { weight: edge.weight },
        });
      }
    }

    return sg;
  }

  union(n2: BaseNetwork<V, T, S>): BaseNetwork<V, T, S> {
    const u = this.clone();
    for (const node of n2.nodes) {
      if (!u.getNodeInstance(node.name))
        u.addNode({
          name: node.name,
          data: node.data as V,
          options: { value: node.value },
        });
    }

    for (const edge of n2.edges) {
      if (!u.getEdgeInstance({ source: edge.source, target: edge.target })) {
        u.addEdge({
          source: edge.source,
          target: edge.target,
          data: edge.data,
          params: { weight: edge.weight },
        });
      }
    }

    return u;
  }

  difference(n2: BaseNetwork<V, T, S>): BaseNetwork<V, T, S> {
    const d = this.clone();
    for (const node of n2.nodes) {
      if (d.getNodeInstance(node.name)) d.removeNode(node.name);
    }

    for (const edge of n2.edges) {
      d.removeEdge({ source: edge.source, target: edge.target });
    }

    return d;
  }

  kronecker<V2, T2>(n2: BaseNetwork<V2, T2>): BaseNetwork<[V, V2], [T, T2], S> {
    const k = new BaseNetwork<[V, V2], [T, T2], S>();

    for (const n1 of this) {
      for (const nB of n2) {
        k.addNode({
          name: `${n1.name}|${nB.name}`,
          data: [n1.data as V, nB.data as V2],
          options: { value: n1.value * nB.value },
        });
      }
    }

    for (const e1 of this.edges) {
      for (const e2 of n2.edges) {
        k.addEdge({
          source: `${e1.source}|${e2.source}`,
          target: `${e1.target}|${e2.target}`,
          data: [e1.data, e2.data] as [T, T2],
          params: { weight: e1.weight * e2.weight },
        });
      }
    }

    return k;
  }

  /**
   * Check if the network is connected using an undirected traversal.
   */
  isConnected(): boolean {
    if (this.order === 0) return true;
    const start = this.__G__.values().next().value as Node<V>;
    const visited = new Set<string>();
    const stack = [start];
    visited.add(start.name);
    while (stack.length) {
      const node = stack.pop() as Node<V>;
      for (const edge of node.outgoing.values()) {
        const target = edge.target as Node<V>;
        if (!visited.has(target.name)) {
          visited.add(target.name);
          stack.push(target);
        }
      }
      for (const edge of node.incomming.values()) {
        const source = edge.source as Node<V>;
        if (!visited.has(source.name)) {
          visited.add(source.name);
          stack.push(source);
        }
      }
    }

    return visited.size === this.order;
  }

  /**
   * Return all simple cycles in the network.
   */
  cycles(): string[][] {
    const cycles: string[][] = [];
    const path: string[] = [];
    const onStack = new Set<string>();
    const visited = new Set<string>();
    const found = new Set<string>();

    const dfs = (node: Node<V>) => {
      visited.add(node.name);
      onStack.add(node.name);
      path.push(node.name);

      for (const edge of node.outgoing.values()) {
        const target = edge.target as Node<V>;
        if (!onStack.has(target.name)) {
          if (!visited.has(target.name)) dfs(target);
        } else {
          const idx = path.indexOf(target.name);
          if (idx !== -1) {
            const cycle = [...path.slice(idx), target.name];
            const key = cycle.join("->");
            if (!found.has(key)) {
              cycles.push(cycle);
              found.add(key);
            }
          }
        }
      }

      path.pop();
      onStack.delete(node.name);
    };

    for (const node of this) {
      if (!visited.has(node.name)) dfs(node);
    }

    return cycles;
  }

  /**
   * Try to find a Hamiltonian cycle in the network.
   */
  Hamiltonian(): string[] | null {
    const n = this.order;
    if (n === 0) return [];
    const nodes = [...this.__G__.keys()];
    const start = nodes[0];
    const path: DynamicStack<string> = new DynamicStack<string>();
    const visited = new Set<string>();

    const dfs = (current: string): boolean => {
      visited.add(current);
      path.push(current);
      if (path.size === n) {
        const last = this.__G__.get(current)!;
        if (last.outgoing.has(start)) {
          path.push(start);
          return true;
        }
      }
      for (const [next] of this.__G__.get(current)!.outgoing) {
        if (!visited.has(next) && dfs(next)) return true;
      }
      visited.delete(current);
      path.pop();
      return false;
    };

    if (dfs(start)) return [...path] as string[];
    return null;
  }

  /**
   * Determine if the network is bipartite.
   */
  biGraph(): boolean {
    if (this.order === 0) return true;
    const color = new Map<string, number>();
    for (const node of this) {
      if (color.has(node.name)) continue;
      color.set(node.name, 0);
      const queue = new Queue<Node<V>>(node);
      while (queue.length) {
        const u = queue.dequeue() as Node<V>;
        const uColor = color.get(u.name) as number;
        const neighbors: Node<V>[] = [];
        for (const e of u.outgoing.values())
          neighbors.push(e.target as Node<V>);
        for (const e of u.incomming.values())
          neighbors.push(e.source as Node<V>);
        for (const v of neighbors) {
          if (!color.has(v.name)) {
            color.set(v.name, 1 - uColor);
            queue.enqueue(v);
          } else if (color.get(v.name) === uColor) {
            return false;
          }
        }
      }
    }
    return true;
  }

  /**
   * Generate an n-dimensional cube network.
   */
  static nCube(n: number): BaseNetwork<number[], null> {
    const g = new BaseNetwork<number[], null>();
    const total = 1 << n;
    for (let i = 0; i < total; i++) {
      const bits = i.toString(2).padStart(n, "0").split("").map(Number);
      g.addNode({ name: i.toString(), data: bits, options: { value: 1 } });
    }
    for (let i = 0; i < total; i++) {
      for (let j = 0; j < n; j++) {
        const neighbor = i ^ (1 << j);
        g.addEdge({
          source: i.toString(),
          target: neighbor.toString(),
          data: null,
          params: { weight: 1 },
        });
      }
    }
    return g;
  }

  [Symbol.iterator](): Iterator<Node<V>> {
    return this.__G__.values();
  }
}
