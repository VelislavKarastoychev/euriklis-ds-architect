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
   * Generate an Erdos-Renyi random network with
   * `n` nodes and connection probability `p`.
   */
  static erdosRenyi(n: number, p: number): BaseNetwork<number, null> {
    const g = new BaseNetwork<number, null>();
    for (let i = 0; i < n; i++) {
      g.addNode({ name: `v${i}`, data: i, options: { value: 1 } });
    }
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (Math.random() < p) {
          g.addEdge({
            source: `v${i}`,
            target: `v${j}`,
            data: null,
            params: { weight: 1 },
          });
          g.addEdge({
            source: `v${j}`,
            target: `v${i}`,
            data: null,
            params: { weight: 1 },
          });
        }
      }
    }

    return g;
  }

  /**
   * Generate a regular ring lattice where each node connects to `k` neighbours on each side.
   */
  static ringLattice(n: number, k: number): BaseNetwork<number, null> {
    const g = new BaseNetwork<number, null>();
    for (let i = 0; i < n; i++) {
      g.addNode({ name: `v${i}`, data: i, options: { value: 1 } });
    }
    for (let i = 0; i < n; i++) {
      for (let j = 1; j <= k; j++) {
        const t = (i + j) % n;
        g.addEdge({
          source: `v${i}`,
          target: `v${t}`,
          data: null,
          params: { weight: 1 },
        });
        g.addEdge({
          source: `v${t}`,
          target: `v${i}`,
          data: null,
          params: { weight: 1 },
        });
      }
    }

    return g;
  }

  /**
   * Generate a Watts–Strogatz small-world network.
   */
  static wattsStrogatz(
    n: number,
    k: number,
    beta: number,
  ): BaseNetwork<number, null> {
    const g = BaseNetwork.ringLattice(n, k);
    const nodes = [...g.__G__.keys()];
    for (let i = 0; i < n; i++) {
      for (let j = 1; j <= k; j++) {
        const src = `v${i}`;
        const tgt = `v${(i + j) % n}`;
        if (Math.random() < beta) {
          // rewire
          g.removeEdge({ source: src, target: tgt });
          g.removeEdge({ source: tgt, target: src });
          let r = src;
          while (r === src || g.getEdgeInstance({ source: src, target: r })) {
            r = nodes[Math.floor(Math.random() * n)];
          }
          g.addEdge({
            source: src,
            target: r,
            data: null,
            params: { weight: 1 },
          });
          g.addEdge({
            source: r,
            target: src,
            data: null,
            params: { weight: 1 },
          });
        }
      }
    }

    return g;
  }

  /**
   * Generate a Barabasi–Albert preferential attachment network.
   * `n` is the number of nodes and `m` the number of edges added for each new node.
   */
  static barabasiAlbert(n: number, m: number): BaseNetwork<number, null> {
    const g = new BaseNetwork<number, null>();
    const init = Math.max(2, m);
    for (let i = 0; i < init; i++) {
      g.addNode({ name: `v${i}`, data: i, options: { value: 1 } });
    }
    // fully connect initial clique
    for (let i = 0; i < init; i++) {
      for (let j = i + 1; j < init; j++) {
        g.addEdge({
          source: `v${i}`,
          target: `v${j}`,
          data: null,
          params: { weight: 1 },
        });
        g.addEdge({
          source: `v${j}`,
          target: `v${i}`,
          data: null,
          params: { weight: 1 },
        });
      }
    }
    const degrees: number[] = new Array(init).fill(init - 1);
    for (let i = init; i < n; i++) {
      g.addNode({ name: `v${i}`, data: i, options: { value: 1 } });
      const targets: Set<number> = new Set();
      const totalDegree = degrees.reduce((a, b) => a + b, 0);
      while (targets.size < m && targets.size < g.order - 1) {
        const r = Math.random() * totalDegree;
        let acc = 0;
        for (let t = 0; t < i; t++) {
          acc += degrees[t];
          if (r <= acc) {
            targets.add(t);
            break;
          }
        }
      }
      for (const t of targets) {
        g.addEdge({
          source: `v${i}`,
          target: `v${t}`,
          data: null,
          params: { weight: 1 },
        });
        g.addEdge({
          source: `v${t}`,
          target: `v${i}`,
          data: null,
          params: { weight: 1 },
        });
        degrees[t]++;
      }
      degrees[i] = targets.size;
    }
    return g;
  }

  /**
   * Build a deterministic hierarchical scale-free network using the pseudofractal model.
   */
  static hierarchical(iterations: number): BaseNetwork<number, null> {
    const g = new BaseNetwork<number, null>();
    g.addNode({ name: "0", data: 0, options: { value: 1 } });
    g.addNode({ name: "1", data: 1, options: { value: 1 } });
    g.addNode({ name: "2", data: 2, options: { value: 1 } });
    g.addEdge({ source: "0", target: "1", data: null, params: { weight: 1 } });
    g.addEdge({ source: "1", target: "0", data: null, params: { weight: 1 } });
    g.addEdge({ source: "0", target: "2", data: null, params: { weight: 1 } });
    g.addEdge({ source: "2", target: "0", data: null, params: { weight: 1 } });
    g.addEdge({ source: "1", target: "2", data: null, params: { weight: 1 } });
    g.addEdge({ source: "2", target: "1", data: null, params: { weight: 1 } });
    let nodeId = 3;
    for (let it = 0; it < iterations; it++) {
      const edges = [...g.edges];
      for (const e of edges) {
        const name = (nodeId++).toString();
        g.addNode({ name, data: nodeId, options: { value: 1 } });
        g.addEdge({
          source: name,
          target: e.source,
          data: null,
          params: { weight: 1 },
        });
        g.addEdge({
          source: e.source,
          target: name,
          data: null,
          params: { weight: 1 },
        });
        g.addEdge({
          source: name,
          target: e.target,
          data: null,
          params: { weight: 1 },
        });
        g.addEdge({
          source: e.target,
          target: name,
          data: null,
          params: { weight: 1 },
        });
      }
    }
    return g;
  }

  /**
   * Generate a network exhibiting the rich‑club phenomenon.
   */
  static richClub(
    n: number,
    clubSize: number,
    p: number,
  ): BaseNetwork<number, null> {
    const g = BaseNetwork.erdosRenyi(n, p);
    const rich = Array.from(
      { length: clubSize },
      (_: unknown, i: number): number => i,
    );
    for (let i = 0; i < rich.length; i++) {
      for (let j = i + 1; j < rich.length; j++) {
        const u = `v${rich[i]}`;
        const v = `v${rich[j]}`;
        if (!g.getEdgeInstance({ source: u, target: v })) {
          g.addEdge({
            source: u,
            target: v,
            data: null,
            params: { weight: 1 },
          });
          g.addEdge({
            source: v,
            target: u,
            data: null,
            params: { weight: 1 },
          });
        }
      }
    }

    return g;
  }

  /**
   * Build an Apollonian network by recursively subdividing triangles.
   */
  static apollonian(iterations: number): BaseNetwork<number, null> {
    const g = new BaseNetwork<number, null>();
    g.addNode({ name: "0", data: 0, options: { value: 1 } });
    g.addNode({ name: "1", data: 1, options: { value: 1 } });
    g.addNode({ name: "2", data: 2, options: { value: 1 } });
    const addTriangle = (a: string, b: string, c: string) => {
      g.addEdge({ source: a, target: b, data: null, params: { weight: 1 } });
      g.addEdge({ source: b, target: a, data: null, params: { weight: 1 } });
      g.addEdge({ source: a, target: c, data: null, params: { weight: 1 } });
      g.addEdge({ source: c, target: a, data: null, params: { weight: 1 } });
      g.addEdge({ source: b, target: c, data: null, params: { weight: 1 } });
      g.addEdge({ source: c, target: b, data: null, params: { weight: 1 } });
    };
    addTriangle("0", "1", "2");
    let triangles: [string, string, string][] = [["0", "1", "2"]];
    let nodeId = 3;
    for (let it = 0; it < iterations; it++) {
      const newTriangles: [string, string, string][] = [];
      for (const [a, b, c] of triangles) {
        const n = (nodeId++).toString();
        g.addNode({ name: n, data: nodeId, options: { value: 1 } });
        addTriangle(a, b, n);
        addTriangle(a, c, n);
        addTriangle(b, c, n);
        newTriangles.push([a, b, n], [a, c, n], [b, c, n]);
      }
      triangles = newTriangles;
    }
    return g;
  }

  /**
   * Generate a simple stochastic block model with equal intra and inter community probabilities.
   */
  static stochasticBlockModel(
    blockSizes: number[],
    pIn: number,
    pOut: number,
  ): BaseNetwork<number, null> {
    const g = new BaseNetwork<number, null>();
    const blocks: number[][] = [];
    let nodeId = 0;
    for (const size of blockSizes) {
      const block: number[] = [];
      for (let i = 0; i < size; i++) {
        g.addNode({
          name: nodeId.toString(),
          data: nodeId,
          options: { value: 1 },
        });
        block.push(nodeId);
        nodeId++;
      }
      blocks.push(block);
    }
    const all = blocks.flat();
    for (let i = 0; i < all.length; i++) {
      for (let j = i + 1; j < all.length; j++) {
        const sameBlock = blocks.some(
          (b) => b.includes(all[i]) && b.includes(all[j]),
        );
        const p = sameBlock ? pIn : pOut;
        if (Math.random() < p) {
          const u = all[i].toString();
          const v = all[j].toString();
          g.addEdge({
            source: u,
            target: v,
            data: null,
            params: { weight: 1 },
          });
          g.addEdge({
            source: v,
            target: u,
            data: null,
            params: { weight: 1 },
          });
        }
      }
    }

    return g;
  }

  /**
   * Generate a latent space/random dot-product network.
   */
  static latentSpace(
    n: number,
    d: number,
    threshold: number,
  ): BaseNetwork<number[], null> {
    const g = new BaseNetwork<number[], null>();
    const vectors: number[][] = [];
    for (let i = 0; i < n; i++) {
      const vec = Array.from({ length: d }, () => Math.random());
      vectors.push(vec);
      g.addNode({ name: i.toString(), data: vec, options: { value: 1 } });
    }
    const dot = (a: number[], b: number[]) =>
      a.reduce((s, v, idx) => s + v * b[idx], 0);
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (dot(vectors[i], vectors[j]) > threshold) {
          g.addEdge({
            source: i.toString(),
            target: j.toString(),
            data: null,
            params: { weight: 1 },
          });
          g.addEdge({
            source: j.toString(),
            target: i.toString(),
            data: null,
            params: { weight: 1 },
          });
        }
      }
    }

    return g;
  }

  /**
   * Heuristic check if the network resembles an Erdos-Renyi random network.
   */
  isErdosRenyi(tolerance = 0.05): boolean {
    const n = this.order;
    if (n < 2) return true;
    const pObserved = this.size / (n * (n - 1));
    const meanDegree = (2 * this.size) / n;
    let variance = 0;
    for (const node of this) {
      const deg = node.outDegree + node.inDegree;
      variance += Math.pow(deg - meanDegree, 2);
    }
    variance /= n;
    const pExpected = meanDegree / (n - 1);
    return Math.abs(pObserved - pExpected) < tolerance && variance < meanDegree;
  }

  /** Check if each node has degree approximately `2*k` as in a ring lattice. */
  isRingLattice(k: number): boolean {
    for (const node of this) {
      if (node.inDegree + node.outDegree !== 4 * k) return false;
    }

    return true;
  }

  /** Rough test for a Barabasi–Albert style degree distribution. */
  isBarabasiAlbert(): boolean {
    let max = 0;
    let sum = 0;
    for (const node of this) {
      const deg = node.inDegree + node.outDegree;
      if (deg > max) max = deg;
      sum += deg;
    }
    const avg = sum / this.order;
    return max > avg * 3;
  }

  /** Check for rich‑club organisation using a simple coefficient. */
  hasRichClub(threshold = 0.1): boolean {
    if (this.order < 5) return false;
    const degrees = [...this].map((n) => ({
      name: n.name,
      deg: n.outDegree + n.inDegree,
    }));
    degrees.sort((a, b) => b.deg - a.deg);
    const topCount = Math.max(2, Math.floor(this.order * 0.1));
    const club = degrees.slice(0, topCount).map((d) => d.name);
    let edges = 0;
    for (const u of club) {
      for (const v of club) {
        if (u === v) continue;
        if (this.getEdgeInstance({ source: u, target: v })) edges++;
      }
    }
    const possible = topCount * (topCount - 1);
    return edges / possible > this.density + threshold;
  }

  /** Estimate if the network originated from a Watts–Strogatz process. */
  isWattsStrogatz(k: number, betaTolerance = 0.1): boolean {
    const avgDegree =
      [...this].reduce((s, n) => s + n.inDegree + n.outDegree, 0) / this.order;
    if (Math.abs(avgDegree - 2 * k) > 1) return false;
    if (this.isRingLattice(k)) return false;
    const clustering = this.averageClusteringCoefficient();
    return clustering > this.density + betaTolerance;
  }

  /** Basic check for a deterministic hierarchical structure. */
  isHierarchical(): boolean {
    const degClust: [number, number][] = [];
    for (const n of this) {
      const deg = n.inDegree + n.outDegree;
      const c = this.nodeClusteringCoefficient(n.name);
      degClust.push([deg, c]);
    }
    degClust.sort((a, b) => a[0] - b[0]);
    let prev = Infinity;
    for (const [deg, c] of degClust) {
      if (deg > prev && c > degClust.find((d) => d[0] === prev)![1])
        return false;
      prev = deg;
    }
    return true;
  }

  /** Quick planar check for an Apollonian network. */
  isApollonian(): boolean {
    const n = this.order;
    const m = this.size / 2; // undirected edge count
    return m === 3 * n - 6;
  }

  /** Rough heuristic detecting block community structure. */
  isStochasticBlockModel(): boolean {
    const clustering = this.averageClusteringCoefficient();
    return clustering > this.density * 1.5;
  }

  /** Determine if node vectors likely generated edges via dot-product similarity. */
  isLatentSpace(): boolean {
    const sample = [...this].slice(0, 5);
    if (!sample.every((n) => Array.isArray(n.data))) return false;
    let correlate = 0;
    let total = 0;
    for (const e of this.edges) {
      const u = this.getNodeInstance(e.source)!;
      const v = this.getNodeInstance(e.target)!;
      if (Array.isArray(u.data) && Array.isArray(v.data)) {
        const dot = (u.data as number[]).reduce(
          (s, val, i) => s + val * (v.data as number[])[i],
          0,
        );
        correlate += dot;
        total++;
      }
    }
    return total > 0 && correlate / total > 0;
  }

  private nodeClusteringCoefficient(name: string): number {
    const n = this.getNodeInstance(name);
    if (!n) return 0;
    const neighbors = new Set<string>();
    for (const e of n.outgoing.values()) neighbors.add(e.target.name);
    for (const e of n.incoming.values()) neighbors.add(e.source.name);
    const arr = [...neighbors];
    const deg = arr.length;
    if (deg < 2) return 0;
    let links = 0;
    for (let i = 0; i < deg; i++) {
      for (let j = i + 1; j < deg; j++) {
        if (
          this.getEdgeInstance({ source: arr[i], target: arr[j] }) ||
          this.getEdgeInstance({ source: arr[j], target: arr[i] })
        ) {
          links++;
        }
      }
    }
    return (2 * links) / (deg * (deg - 1));
  }

  private averageClusteringCoefficient(): number {
    let sum = 0;
    for (const node of this) sum += this.nodeClusteringCoefficient(node.name);
    return sum / this.order;
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
