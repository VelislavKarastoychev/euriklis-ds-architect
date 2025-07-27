"use strict";

import type { Integer } from "../../../Types";
import { Vertex, Edge, Node } from "../../DataNode/Models";
import { Queue } from "../../Queue";
import { DynamicStack } from "../../Stack";
import { BaseGraph } from "./BaseGraph";
import { BaseNetwork } from "./BaseNetwork";

/**
 * Feature-rich graph implementation providing common graph algorithms
 * like BFS/DFS along with utility methods for unions, differences and
 * other advanced operations.
 */
export class Graph<D = unknown, T = unknown, S = unknown> extends BaseGraph<
  Vertex<D>,
  Edge<T>,
  D,
  T,
  S
> {
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
      for (const edge of node.incoming.values()) {
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
   * Find all bridges in the graph treating edges as undirected.
   */
  bridges(): { source: string; target: string; data: T | null }[] {
    const neighbors = new Map<string, Set<string>>();
    for (const node of this) neighbors.set(node.name, new Set());
    for (const node of this) {
      for (const e of node.outgoing.values()) {
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
    const result: { source: string; target: string; data: T | null }[] = [];
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
            const edge =
              this.getEdge({ source: u, target: v }) ||
              this.getEdge({ source: v, target: u });
            result.push(edge || { source: u, target: v, data: null });
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
   * Find all bridges considering edge directions. An edge (u,v)
   * is a directed bridge if there is no alternative directed
   * path from u to v when the edge is ignored.
   */
  directedBridges(): { source: string; target: string; data: T | null }[] {
    const result: { source: string; target: string; data: T | null }[] = [];
    for (const node of this) {
      for (const edge of node.outgoing.values()) {
        const u = node.name;
        const v = edge.target.name;
        const stack = [u];
        const visited = new Set<string>([u]);
        let reached = false;

        while (stack.length && !reached) {
          const current = stack.pop() as string;
          const curNode = this.__G__.get(current)! as Vertex<D>;
          for (const e of curNode.outgoing.values()) {
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

        if (!reached) result.push({ source: u, target: v, data: edge.data });
      }
    }

    return result;
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
   * Return a topological ordering of the nodes if the graph is acyclic.
   * Returns null if a cycle is detected.
   */
  topologicalOrder(): string[] | null {
    const inDeg = new Map<string, number>();
    const q: Vertex<D>[] = [];
    const order: string[] = [];
    for (const node of this) {
      const deg = node.incoming.size;
      inDeg.set(node.name, deg);
      if (deg === 0) q.push(node);
    }
    while (q.length) {
      const n = q.shift() as Vertex<D>;
      order.push(n.name);
      for (const e of n.outgoing.values()) {
        const t = e.target as Vertex<D>;
        const d = (inDeg.get(t.name) || 0) - 1;
        inDeg.set(t.name, d);
        if (d === 0) q.push(t);
      }
    }

    return order.length === this.order ? order : null;
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
        for (const e of u.incoming.values())
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
   * Serialize graph structure to a plain object.
   * @returns {{nodes: {name: string; data: D | null}[]; edges: { source: string; target: string; data: T | null }[]; state: S | null;}}
   **/
  toJSON(): {
    nodes: { name: string; data: D | null }[];
    edges: { source: string; target: string; data: T | null }[];
    state: S | null;
  } {
    return {
      nodes: this.nodes,
      edges: this.edges,
      state: this.state,
    };
  }

  [Symbol.iterator](): Iterator<Vertex<D>> {
    return this.__G__.values();
  }
}
