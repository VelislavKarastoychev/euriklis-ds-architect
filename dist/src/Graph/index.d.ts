import type { Integer } from "../../Types";
import { GraphDataNode, GraphDataEdge } from "../DataNode";
import { Arc, Edge, Node, Vertex } from "../DataNode/Models";
import { DynamicStack } from "../Stack";
/**
 * Generic graph container used by all higher level graph structures.
 * Manages a map of nodes and their connecting edges.
 */
export declare abstract class BaseGraph<N extends GraphDataNode<V, any>, E extends GraphDataEdge<any, any, T>, V = unknown, T = unknown, S = unknown> {
    protected __G__: Map<string, N>;
    protected __S__: S | null;
    constructor({ nodes, edges, state, }?: {
        nodes?: {
            name: string;
            data: V;
        }[];
        edges?: {
            source: string;
            target: string;
            data: T;
        }[];
        state?: S;
    });
    protected abstract createNode({ name, data, options, }: {
        name: string;
        data: unknown;
        options?: {
            [param: string]: unknown;
        };
    }): N;
    get state(): S | null;
    set state(s: S);
    get nodes(): {
        name: string;
        data: V | null;
    }[];
    set nodes(nodes: {
        name: string;
        data: V;
    }[]);
    get edges(): {
        source: string;
        target: string;
        data: T | null;
    }[];
    set edges(edges: {
        source: string;
        target: string;
        data: T;
    }[]);
    getNodeInstance(name: string): N | null;
    getNode(name: string): {
        name: string;
        data: V | null;
    } | null;
    addNode({ name, data, options, }: {
        name: string;
        data: V;
        options?: {
            [prop: string]: unknown;
        };
    }): this;
    getEdgeInstance({ source, target, }: {
        source: string;
        target: string;
    }): E | null;
    getEdge({ source, target, }: {
        source: string;
        target: string;
    }): {
        source: string;
        target: string;
        data: T | null;
    } | null;
    addEdge({ source, target, data, params, }: {
        source: string;
        target: string;
        data: T;
        params: {
            [param: string]: unknown;
        };
    }): this;
    /**
     * Removes a node of the graph given the name of the node.
     * Complexity: O(In + Oout) where In and Out are the
     * indegree and the outgegree of the node.
     * @param {string} name - the name of the node to
     * be deleted.
     * @returns {N | null} The deleted node or null if the
     * node does not exists.
     */
    removeNode(name: string): N | null;
    removeEdge({ source, target }: {
        source: string;
        target: string;
    }): E | null;
}
/**
 * Lightweight graph structure exposing only CRUD operations for nodes and
 * edges. Useful for state machines or situations where advanced algorithms
 * from the `Graph` class are unnecessary.
 */
export declare class StateGraph<D = unknown, // The data type of the nodes.
T = unknown, // The data type of the edges.
S = unknown> extends BaseGraph<Vertex<D>, Edge<T>, D, T, S> {
    protected createNode({ name, data, }: {
        name: string;
        data: D;
    }): Vertex<D>;
    clone(): StateGraph<D, T, S>;
    upgradeToGraph(): Graph<D, T, S>;
    upgradeToBaseNetwork(): BaseNetwork<D, T, S>;
    /** Serialize graph to an object with nodes, edges and state. */
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
/**
 * Extension of `Graph` where nodes carry numeric values and edges have
 * weights, enabling common network metrics and algorithms.
 * The BaseNetwork is a generic Graph structure which requires three
 * types - the type of the data of the nodes, the type of the edge data and
 * the type of the state of the network.
 */
export declare class BaseNetwork<V, T, S = unknown> extends BaseGraph<Node<V>, Arc<T>, V, T, S> {
    /**
     * Generate an n-dimensional cube network.
     */
    static nCube(n: number): BaseNetwork<number[], null>;
    constructor({ nodes, edges, }?: {
        nodes?: {
            name: string;
            data: V;
            value: number;
        }[];
        edges?: {
            source: string;
            target: string;
            data: T;
            weight: number;
        }[];
    });
    protected createNode({ name, data, options, }: {
        name: string;
        data: V;
        options: {
            value: number;
            [prop: string]: unknown;
        };
    }): Node<V>;
    getNode(name: string): {
        name: string;
        data: V | null;
        value: number;
    } | null;
    inDegree(name: string): number;
    outDegree(name: string): number;
    get order(): Integer;
    get weightedOrder(): number;
    get size(): Integer;
    get weightedSize(): number;
    get density(): number;
    get weightedDensity(): number;
    get nodes(): {
        name: string;
        data: V | null;
        value: number;
    }[];
    get edges(): {
        source: string;
        target: string;
        data: T;
        weight: number;
    }[];
    /**
     * Generate the adjacency matrix using edge weights. If no edge exists between
     * two nodes the value is `0`.
     */
    adjacencyMatrix(): number[][];
    clone(): BaseNetwork<V, T, S>;
    BFSNode({ startingNode, callback, errorCallback, }: {
        startingNode: Node<V> | string;
        callback?: (node: Node<V> | null, g?: BaseNetwork<V, T>) => unknown;
        errorCallback?: (node: Node<V> | null, error: Error, g?: BaseNetwork<V, T>) => unknown;
    }): this;
    BFSNodeAsync({ startingNode, callback, errorCallback, }: {
        startingNode: Node<V> | string;
        callback?: (node: Node<V> | null, g?: BaseNetwork<V, T>) => Promise<unknown>;
        errorCallback?: (node: Node<V> | null, error: Error, g?: BaseNetwork<V, T>) => Promise<unknown>;
    }): Promise<this>;
    BFS({ callback, errorCallback, }?: {
        callback?: (node: Node<V> | null, g?: BaseNetwork<V, T>) => unknown;
        errorCallback?: (node: Node<V> | null, error: Error, g?: BaseNetwork<V, T>) => unknown;
    }): this;
    BFSAsync({ callback, errorCallback, }?: {
        callback?: (node: Node<V>, g?: BaseNetwork<V, T>) => Promise<unknown>;
        errorCallback?: (node: Node<V>, error: Error, g?: BaseNetwork<V, T>) => Promise<unknown>;
    }): Promise<this>;
    DFS({ callback, errorCallback, }: {
        callback?: (node: Node<V>, g?: BaseNetwork<V, T>) => unknown;
        errorCallback?: (node: Node<V>, error: Error, g?: BaseNetwork<V, T>) => unknown;
    }): this;
    DFSAsync({ callback, errorCallback, }?: {
        callback?: (node: Node<V>, g?: BaseNetwork<V, T>) => Promise<unknown>;
        errorCallback?: (node: Node<V>, error: Error, g?: BaseNetwork<V, T>) => Promise<unknown>;
    }): Promise<this>;
    DFSNode({ startingNode, callback, errorCallback, }: {
        startingNode: Node<V> | string;
        callback?: (node: Node<V>, g?: BaseNetwork<V, T>) => unknown;
        errorCallback?: (node: Node<V>, error: Error, g?: BaseNetwork<V, T>) => unknown;
    }): this;
    DFSNodeAsync({ startingNode, callback, errorCallback, }: {
        startingNode: Node<V> | string;
        callback?: (node: Node<V>, g?: BaseNetwork<V, T>) => Promise<unknown>;
        errorCallback?: (node: Node<V>, error: Error, g?: BaseNetwork<V, T>) => Promise<unknown>;
    }): Promise<this>;
    subgraph({ callback, }: {
        callback: (node: Node<V>, g: BaseNetwork<V, T, S>) => boolean;
    }): BaseNetwork<V, T, S>;
    union(n2: BaseNetwork<V, T, S>): BaseNetwork<V, T, S>;
    difference(n2: BaseNetwork<V, T, S>): BaseNetwork<V, T, S>;
    kronecker<V2, T2>(n2: BaseNetwork<V2, T2>): BaseNetwork<[V, V2], [T, T2], S>;
    /**
     * Check if the network is connected using an undirected traversal.
     */
    isConnected(): boolean;
    /**
     * Find all bridges in the network treating edges as undirected.
     */
    bridges(): {
        source: string;
        target: string;
        data: T;
        weight: number;
    }[];
    /**
     * Find all directed bridges in the network. An edge (u,v) is a
     * directed bridge if there is no alternative directed path from
     * u to v when this edge is ignored.
     */
    directedBridges(): {
        source: string;
        target: string;
        data: T;
        weight: number;
    }[];
    /**
     * Return all simple cycles in the network.
     */
    cycles(): string[][];
    /**
     * Try to find a Hamiltonian cycle in the network.
     */
    Hamiltonian(): string[] | null;
    /**
     * Return a topological ordering of the network nodes if acyclic.
     * Returns null if a cycle is detected.
     */
    topologicalOrder(): string[] | null;
    /**
     * Find the shortest path between two nodes using
     * Dijkstra's algorithm.
     */
    shortestPath({ start, end }: {
        start: string;
        end: string;
    }): {
        distance: number;
        path: string[];
        pathStack: DynamicStack<string>;
    } | null;
    /**
     * Construct a minimum spanning tree using Kruskal's algorithm.
     */
    minimumSpanningTree(): BaseNetwork<V, T, S>;
    /**
     * Construct a minimum spanning tree using Prim's algorithm.
     */
    PRIM(start?: string): BaseNetwork<V, T, S>;
    /**
     * Compute earliest finish times for nodes using a forward pass (PERT).
     */
    PERT(): Map<string, number>;
    /**
     * Determine the critical path and its duration using CPM.
     */
    CPM(): {
        duration: number;
        path: string[];
        pathStack: DynamicStack<string>;
    };
    /**
     * Determine if the network is bipartite.
     */
    biGraph(): boolean;
    /** Serialize network to an object including weights. */
    toJSON(): {
        nodes: {
            name: string;
            data: V | null;
            value: number;
        }[];
        edges: {
            source: string;
            target: string;
            data: T;
            weight: number;
        }[];
        state: S | null;
    };
    [Symbol.iterator](): Iterator<Node<V>>;
}
