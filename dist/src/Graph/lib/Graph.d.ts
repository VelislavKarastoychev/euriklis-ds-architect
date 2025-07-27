import type { Integer } from "../../../Types";
import { Vertex, Edge } from "../../DataNode/Models";
import { BaseGraph } from "./BaseGraph";
import { BaseNetwork } from "./BaseNetwork";
/**
 * Feature-rich graph implementation providing common graph algorithms
 * like BFS/DFS along with utility methods for unions, differences and
 * other advanced operations.
 */
export declare class Graph<D = unknown, T = unknown, S = unknown> extends BaseGraph<Vertex<D>, Edge<T>, D, T, S> {
    /**
     * Generate an n-dimensional cube graph.
     */
    static nCube(n: number): Graph<number[], null>;
    protected createNode({ name, data, options, }: {
        name: string;
        data: D;
        options: {
            [prop: string]: unknown;
        };
    }): Vertex<D>;
    inDegree(name: string): number;
    outDegree(name: string): number;
    get order(): Integer;
    get size(): Integer;
    get density(): number;
    BFSNode({ startingNode, callback, errorCallback, }: {
        startingNode: Vertex<D> | string;
        callback?: (node: Vertex<D> | null, g?: Graph<D>) => unknown;
        errorCallback?: (node: Vertex<D> | null, error: Error, g?: Graph<D>) => unknown;
    }): this;
    BFSNodeAsync({ startingNode, callback, errorCallback, }: {
        startingNode: Vertex<D> | string;
        callback?: (node: Vertex<D> | null, g?: Graph<D>) => Promise<unknown>;
        errorCallback?: (node: Vertex<D> | null, error: Error, g?: Graph<D>) => Promise<unknown>;
    }): Promise<this>;
    BFS({ callback, errorCallback, }?: {
        callback?: (node: Vertex<D> | null, g?: Graph<D>) => unknown;
        errorCallback?: (node: Vertex<D> | null, error: Error, g?: Graph<D>) => unknown;
    }): this;
    BFSAsync({ callback, errorCallback, }?: {
        callback?: (node: Vertex<D>, g?: Graph<D>) => Promise<unknown>;
        errorCallback?: (node: Vertex<D>, error: Error, g?: Graph<D>) => Promise<unknown>;
    }): Promise<this>;
    DFS({ callback, errorCallback, }: {
        callback?: (node: Vertex<D>, g?: Graph<D>) => unknown;
        errorCallback?: (node: Vertex<D>, error: Error, g?: Graph<D>) => unknown;
    }): this;
    DFSAsync({ callback, errorCallback, }?: {
        callback?: (node: Vertex<D>, g?: Graph<D>) => Promise<unknown>;
        errorCallback?: (node: Vertex<D>, error: Error, g?: Graph<D>) => Promise<unknown>;
    }): Promise<this>;
    DFSNode({ startingNode, callback, errorCallback, }: {
        startingNode: Vertex<D> | string;
        callback?: (node: Vertex<D>, g?: Graph<D>) => unknown;
        errorCallback?: (node: Vertex<D>, error: Error, g?: Graph<D>) => unknown;
    }): this;
    DFSNodeAsync({ startingNode, callback, errorCallback, }: {
        startingNode: Vertex<D> | string;
        callback?: (node: Vertex<D>, g?: Graph<D>) => Promise<unknown>;
        errorCallback?: (node: Vertex<D>, error: Error, g?: Graph<D>) => Promise<unknown>;
    }): Promise<this>;
    clone(): Graph<D, T, S>;
    upgradeToBaseNetwork(): BaseNetwork<D, T, S>;
    subgraph({ callback, }: {
        callback: (node: Vertex<D>, g: Graph<D, T, S>) => boolean;
    }): Graph<D, T, S>;
    union(g2: Graph<D, T, S>): Graph<D, T, S>;
    difference(g2: Graph<D, T, S>): Graph<D, T, S>;
    kronecker<D2, T2>(g2: Graph<D2, T2>): Graph<[D, D2], [T, T2], S>;
    /**
     * Check if the graph is connected using an undirected traversal.
     */
    isConnected(): boolean;
    /**
     * Find all bridges in the graph treating edges as undirected.
     */
    bridges(): {
        source: string;
        target: string;
        data: T | null;
    }[];
    /**
     * Find all bridges considering edge directions. An edge (u,v)
     * is a directed bridge if there is no alternative directed
     * path from u to v when the edge is ignored.
     */
    directedBridges(): {
        source: string;
        target: string;
        data: T | null;
    }[];
    /**
     * Return all simple cycles in the graph as arrays of node names.
     */
    cycles(): string[][];
    /**
     * Try to find a Hamiltonian cycle. Returns the cycle or null.
     */
    Hamiltonian(): string[] | null;
    /**
     * Return a topological ordering of the nodes if the graph is acyclic.
     * Returns null if a cycle is detected.
     */
    topologicalOrder(): string[] | null;
    /**
     * Determine if the graph is bipartite using BFS coloring.
     */
    biGraph(): boolean;
    /**
     * Serialize graph structure to a plain object.
     * @returns {{nodes: {name: string; data: D | null}[]; edges: { source: string; target: string; data: T | null }[]; state: S | null;}}
     **/
    toJSON(): {
        nodes: {
            name: string;
            data: D | null;
        }[];
        edges: {
            source: string;
            target: string;
            data: T | null;
        }[];
        state: S | null;
    };
    [Symbol.iterator](): Iterator<Vertex<D>>;
}
