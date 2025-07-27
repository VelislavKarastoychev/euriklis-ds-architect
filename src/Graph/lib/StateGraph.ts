"use strict";

import { Vertex, Edge } from "../../DataNode/Models";
import { BaseGraph } from "./BaseGraph";
import { Graph } from "./Graph";
import { BaseNetwork } from "./BaseNetwork";

/**
 * Lightweight graph structure exposing only CRUD operations for nodes and
 * edges. Useful for state machines or situations where advanced algorithms
 * from the `Graph` class are unnecessary.
 */
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

  /** Serialize graph to an object with nodes, edges and state. */
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
