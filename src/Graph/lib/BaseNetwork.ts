"use strict";

import type { Integer } from "../../../Types";
import { Node, Arc } from "../../DataNode/Models";
import { Queue } from "../../Queue";
import { DynamicStack } from "../../Stack";
import { BaseGraph } from "./BaseGraph";

/**
 * Extension of `Graph` where nodes carry numeric values and edges have
 * weights, enabling common network metrics and algorithms.
 * The BaseNetwork is a generic Graph structure which requires three
 * types - the type of the data of the nodes, the type of the edge data and
 * the type of the state of the network.
 */
export class BaseNetwork<V, T, S = unknown> extends BaseGraph<
  Node<V>,
  Arc<T>,
  V,
  T,
  S
> {
  /**
   * Function used to derive a numeric weight from an edge's stored weight and
   * data. Users can override this to globally change how algorithms interpret
   * edge weights.
   */
  weightFn: (weight: number, data: T, g?: BaseNetwork<V, T, S>) => number = (
    w,
  ) => w;
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
  constructor({
    nodes,
    edges,
    weightFn,
  }: {
    nodes?: { name: string; data: V; value: number }[];
    edges?: { source: string; target: string; data: T; weight: number }[];
    weightFn?: (weight: number, data: T, g?: BaseNetwork<V, T, S>) => number;
  } = {}) {
    super({ nodes, edges });
    if (weightFn) this.weightFn = weightFn;
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

  /**
   * Generate the adjacency matrix using edge weights. If no edge exists between
   * two nodes the value is `0`.
   */
  adjacencyMatrix(
    weightFn: (
      weight: number,
      data: T,
      g?: BaseNetwork<V, T, S>,
    ) => number = this.weightFn,
  ): number[][] {
    const names = [...this.__G__.keys()];
    const index = new Map<string, number>();
    names.forEach((n, i) => index.set(n, i));
    const matrix = names.map(() => Array(names.length).fill(0));
    for (const node of this) {
      const i = index.get(node.name)!;
      for (const edge of node.outgoing.values()) {
        const j = index.get(edge.target.name)!;
        matrix[i][j] = weightFn(edge.weight, edge.data as T, this);
      }
    }
    return matrix;
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
    callback?: (node: Node<V> | null, g?: BaseNetwork<V, T, S>) => unknown;
    errorCallback?: (
      node: Node<V> | null,
      error: Error,
      g?: BaseNetwork<V, T, S>,
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
      g?: BaseNetwork<V, T, S>,
    ) => Promise<unknown>;
    errorCallback?: (
      node: Node<V> | null,
      error: Error,
      g?: BaseNetwork<V, T, S>,
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
    callback?: (node: Node<V> | null, g?: BaseNetwork<V, T, S>) => unknown;
    errorCallback?: (
      node: Node<V> | null,
      error: Error,
      g?: BaseNetwork<V, T, S>,
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
    callback?: (node: Node<V>, g?: BaseNetwork<V, T, S>) => Promise<unknown>;
    errorCallback?: (
      node: Node<V>,
      error: Error,
      g?: BaseNetwork<V, T, S>,
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
    callback?: (node: Node<V>, g?: BaseNetwork<V, T, S>) => unknown;
    errorCallback?: (
      node: Node<V>,
      error: Error,
      g?: BaseNetwork<V, T, S>,
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
    callback?: (node: Node<V>, g?: BaseNetwork<V, T, S>) => Promise<unknown>;
    errorCallback?: (
      node: Node<V>,
      error: Error,
      g?: BaseNetwork<V, T, S>,
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
    callback?: (node: Node<V>, g?: BaseNetwork<V, T, S>) => unknown;
    errorCallback?: (
      node: Node<V>,
      error: Error,
      g?: BaseNetwork<V, T, S>,
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
    callback?: (node: Node<V>, g?: BaseNetwork<V, T, S>) => Promise<unknown>;
    errorCallback?: (
      node: Node<V>,
      error: Error,
      g?: BaseNetwork<V, T, S>,
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
      for (const edge of node.incoming.values()) {
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
   * Find all bridges in the network treating edges as undirected.
   */
  bridges(
    weightFn: (
      weight: number,
      data: T,
      g?: BaseNetwork<V, T, S>,
    ) => number = this.weightFn,
  ): { source: string; target: string; data: T; weight: number }[] {
    const neighbors = new Map<string, Set<string>>();
    for (const node of this) neighbors.set(node.name, new Set());
    for (const node of this) {
      for (const e of node.outgoing.values()) {
        const w = weightFn(e.weight, e.data as T, this);
        if (w <= 0) continue;
        neighbors.get(node.name)!.add(e.target.name);
        if (!neighbors.has(e.target.name))
          neighbors.set(e.target.name, new Set());
        neighbors.get(e.target.name)!.add(node.name);
      }
    }

    const visited = new Set<string>();
    const disc = new Map<string, number>();
    const low = new Map<string, number>();
    const parent = new Map<string, string | null>();
    const result: {
      source: string;
      target: string;
      data: T;
      weight: number;
    }[] = [];
    let time = 0;

    const dfs = (u: string) => {
      visited.add(u);
      disc.set(u, ++time);
      low.set(u, disc.get(u)!);
      for (const v of neighbors.get(u) || []) {
        if (!visited.has(v)) {
          parent.set(v, u);
          dfs(v);
          low.set(u, Math.min(low.get(u)!, low.get(v)!));
          if (low.get(v)! > disc.get(u)!) {
            const edgeInst =
              (this.getEdgeInstance({
                source: u,
                target: v,
              }) as Arc<T> | null) ||
              (this.getEdgeInstance({ source: v, target: u }) as Arc<T> | null);
            if (edgeInst) {
              const w = weightFn(edgeInst.weight, edgeInst.data as T, this);
              if (w > 0)
                result.push({
                  source: edgeInst.source.name,
                  target: edgeInst.target.name,
                  data: edgeInst.data as T,
                  weight: w,
                });
            }
          }
        } else if (v !== parent.get(u)) {
          low.set(u, Math.min(low.get(u)!, disc.get(v)!));
        }
      }
    };

    for (const node of this) {
      if (!visited.has(node.name)) {
        parent.set(node.name, null);
        dfs(node.name);
      }
    }

    return result;
  }

  /**
   * Find all directed bridges in the network. An edge (u,v) is a
   * directed bridge if there is no alternative directed path from
   * u to v when this edge is ignored.
   */
  directedBridges(
    weightFn: (
      weight: number,
      data: T,
      g?: BaseNetwork<V, T, S>,
    ) => number = this.weightFn,
  ): {
    source: string;
    target: string;
    data: T;
    weight: number;
  }[] {
    const result: {
      source: string;
      target: string;
      data: T;
      weight: number;
    }[] = [];

    for (const node of this) {
      for (const edge of node.outgoing.values()) {
        const w = weightFn(edge.weight, edge.data as T, this);
        if (w <= 0) continue;
        const u = node.name;
        const v = edge.target.name;
        const stack = [u];
        const visited = new Set<string>([u]);
        let reached = false;

        while (stack.length && !reached) {
          const current = stack.pop() as string;
          const curNode = this.getNodeInstance(current) as Node<V>;
          for (const e of curNode.outgoing.values()) {
            const w2 = weightFn(e.weight, e.data as T, this);
            if (w2 <= 0) continue;
            if (current === u && e.target.name === v) continue;
            const t = e.target.name;
            if (t === v) {
              reached = true;
              break;
            }
            if (!visited.has(t)) {
              visited.add(t);
              stack.push(t);
            }
          }
        }

        if (!reached)
          result.push({
            source: u,
            target: v,
            data: edge.data as T,
            weight: w,
          });
      }
    }

    return result;
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
   * Return a topological ordering of the network nodes if acyclic.
   * Returns null if a cycle is detected.
   */
  topologicalOrder(): string[] | null {
    const inDeg = new Map<string, number>();
    const q: Node<V>[] = [];
    const order: string[] = [];
    for (const node of this) {
      const deg = node.incoming.size;
      inDeg.set(node.name, deg);
      if (deg === 0) q.push(node);
    }
    while (q.length) {
      const n = q.shift() as Node<V>;
      order.push(n.name);
      for (const e of n.outgoing.values()) {
        const t = e.target as Node<V>;
        const d = (inDeg.get(t.name) || 0) - 1;
        inDeg.set(t.name, d);
        if (d === 0) q.push(t);
      }
    }

    return order.length === this.order ? order : null;
  }

  /**
   * Find the shortest path between two nodes using
   * Dijkstra's algorithm.
   */
  shortestPath({ start, end }: { start: string; end: string }): {
    distance: number;
    path: string[];
    pathStack: DynamicStack<string>;
  } | null {
    const startNode = this.getNodeInstance(start);
    const endNode = this.getNodeInstance(end);
    if (!startNode || !endNode) return null;

    const dist = new Map<string, number>();
    const prev = new Map<string, string | null>();
    const visited = new Set<string>();

    for (const node of this) {
      dist.set(node.name, Infinity);
      prev.set(node.name, null);
    }
    dist.set(start, 0);

    while (visited.size < this.order) {
      let u: string | null = null;
      let min = Infinity;
      for (const [name, d] of dist) {
        if (!visited.has(name) && d < min) {
          min = d;
          u = name;
        }
      }
      if (u === null) break;
      if (u === end) break;
      visited.add(u);
      const node = this.getNodeInstance(u)!;
      for (const edge of node.outgoing.values()) {
        const v = edge.target.name;
        const alt = (dist.get(u) as number) + edge.weight;
        if (alt < (dist.get(v) as number)) {
          dist.set(v, alt);
          prev.set(v, u);
        }
      }
    }

    if ((dist.get(end) as number) === Infinity) return null;
    const path: DynamicStack<string> = new DynamicStack();
    for (let cur: string | null = end; cur; cur = prev.get(cur) || null) {
      path.push(cur);
    }

    return {
      distance: dist.get(end) as number,
      path: [...path] as string[],
      pathStack: path,
    };
  }

  /**
   * Construct a minimum spanning tree using Kruskal's algorithm.
   */
  minimumSpanningTree(): BaseNetwork<V, T, S> {
    const tree = new BaseNetwork<V, T, S>();
    for (const node of this) {
      tree.addNode({
        name: node.name,
        data: node.data as V,
        options: { value: node.value },
      });
    }

    const edges: {
      source: string;
      target: string;
      weight: number;
      data: T;
    }[] = [];
    const seen = new Set<string>();
    for (const n of this) {
      for (const e of n.outgoing.values()) {
        const u = n.name;
        const v = e.target.name;
        const key = u < v ? `${u}|${v}` : `${v}|${u}`;
        if (!seen.has(key)) {
          seen.add(key);
          edges.push({ source: u, target: v, weight: e.weight, data: e.data });
        }
      }
    }

    edges.sort((a, b) => a.weight - b.weight);

    const parent = new Map<string, string>();
    const find = (x: string): string => {
      let p = parent.get(x) as string;
      while (p !== parent.get(p)) {
        parent.set(p, parent.get(parent.get(p) as string) as string);
        p = parent.get(p) as string;
      }
      return p;
    };
    const union = (a: string, b: string) => {
      parent.set(find(a), find(b));
    };

    for (const n of this) parent.set(n.name, n.name);

    for (const e of edges) {
      if (find(e.source) !== find(e.target)) {
        tree.addEdge({
          source: e.source,
          target: e.target,
          data: e.data,
          params: { weight: e.weight },
        });
        union(e.source, e.target);
      }
    }

    return tree;
  }

  /**
   * Construct a minimum spanning tree using Prim's algorithm.
   */
  PRIM({
    start,
    weightFn = this.weightFn,
  }: {
    start?: string;
    weightFn?: (weight: number, data: T, g?: BaseNetwork<V, T, S>) => number;
  } = {}): BaseNetwork<V, T, S> {
    const tree = new BaseNetwork<V, T, S>();
    for (const node of this) {
      tree.addNode({
        name: node.name,
        data: node.data as V,
        options: { value: node.value },
      });
    }

    if (this.order === 0) return tree;
    const startNode = start
      ? this.getNodeInstance(start)
      : this.__G__.values().next().value;
    if (!startNode) return tree;

    const visited = new Set<string>();
    const edges: { source: string; target: string; weight: number; data: T }[] =
      [];
    const addEdges = (n: Node<V>) => {
      for (const e of n.outgoing.values()) {
        if (!visited.has(e.target.name)) {
          const w = weightFn(e.weight, e.data as T, this);
          edges.push({
            source: n.name,
            target: e.target.name,
            weight: w,
            data: e.data,
          });
        }
      }
    };

    visited.add(startNode.name);
    addEdges(startNode);

    while (visited.size < this.order && edges.length) {
      edges.sort((a, b) => a.weight - b.weight);
      let edge = edges.shift()!;
      while (edge && visited.has(edge.target)) {
        edge = edges.shift()!;
      }
      if (!edge) break;
      tree.addEdge({
        source: edge.source,
        target: edge.target,
        data: edge.data,
        params: { weight: edge.weight },
      });
      visited.add(edge.target);
      const targetNode = this.getNodeInstance(edge.target)!;
      addEdges(targetNode);
    }

    return tree;
  }

  /**
   * Compute earliest finish times for nodes using a forward pass (PERT).
   */
  PERT(
    weightFn: (
      weight: number,
      data: T,
      g?: BaseNetwork<V, T, S>,
    ) => number = this.weightFn,
  ): Map<string, number> {
    const order = this.topologicalOrder();
    const earliest = new Map<string, number>();
    if (!order) return earliest;

    for (const name of order) {
      const node = this.getNodeInstance(name)!;
      let max = 0;
      for (const e of node.incoming.values()) {
        const w = weightFn(e.weight, e.data as T, this);
        if (w <= 0) continue;
        const val = (earliest.get(e.source.name) || 0) + w;
        if (val > max) max = val;
      }
      earliest.set(name, max);
    }

    return earliest;
  }

  /**
   * Determine the critical path and its duration using CPM.
   */
  CPM(
    weightFn: (
      weight: number,
      data: T,
      g?: BaseNetwork<V, T, S>,
    ) => number = this.weightFn,
  ): { duration: number; path: string[]; pathStack: DynamicStack<string> } {
    const order = this.topologicalOrder();
    const earliest = new Map<string, number>();
    const prev = new Map<string, string | null>();
    if (!order)
      return { duration: 0, path: [], pathStack: new DynamicStack<string>() };

    for (const name of order) {
      let max = 0;
      let p: string | null = null;
      const node = this.getNodeInstance(name)!;
      for (const e of node.incoming.values()) {
        const w = weightFn(e.weight, e.data as T, this);
        if (w <= 0) continue;
        const val = (earliest.get(e.source.name) || 0) + w;
        if (val > max) {
          max = val;
          p = e.source.name;
        }
      }
      earliest.set(name, max);
      prev.set(name, p);
    }

    let end = order[0];
    let duration = earliest.get(end) || 0;
    for (const name of order) {
      const d = earliest.get(name) as number;
      if (d > duration) {
        duration = d;
        end = name;
      }
    }

    const pathStack = new DynamicStack<string>();
    for (let cur: string | null = end; cur; cur = prev.get(cur) || null) {
      pathStack.push(cur);
    }

    return { duration, path: [...pathStack] as string[], pathStack };
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
        for (const e of u.incoming.values())
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

  /** Serialize network to an object including weights. */
  toJSON(): {
    nodes: { name: string; data: V | null; value: number }[];
    edges: { source: string; target: string; data: T; weight: number }[];
    state: S | null;
  } {
    return {
      nodes: this.nodes,
      edges: this.edges,
      state: this.state,
    };
  }

  [Symbol.iterator](): Iterator<Node<V>> {
    return this.__G__.values();
  }
}
