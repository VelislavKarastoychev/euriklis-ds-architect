import type { Integer } from "../../../Types";
import { Node, Arc } from "../../DataNode/Models";
import { DynamicStack } from "../../Stack";
import { BaseGraph } from "./BaseGraph";
/**
 * Extension of `Graph` where nodes carry numeric values and edges have
 * weights, enabling common network metrics and algorithms.
 * The BaseNetwork is a generic Graph structure which requires three
 * types - the type of the data of the nodes, the type of the edge data and
 * the type of the state of the network.
 */
export declare class BaseNetwork<V, T, S = unknown> extends BaseGraph<Node<V>, Arc<T>, V, T, S> {
    /**
     * Function used to derive a numeric weight from an edge's stored weight and
     * data. Users can override this to globally change how algorithms interpret
     * edge weights.
     */
    weightFn: (weight: number, data: T, g?: BaseNetwork<V, T, S>) => number;
    /**
     * Generate an Erdos-Renyi random network with
     * `n` nodes and connection probability `p`.
     */
    static erdosRenyi(n: number, p: number): BaseNetwork<number, null>;
    /**
     * Generate a regular ring lattice where each node connects to `k` neighbours on each side.
     */
    static ringLattice(n: number, k: number): BaseNetwork<number, null>;
    /**
     * Generate a Watts–Strogatz small-world network.
     */
    static wattsStrogatz(n: number, k: number, beta: number): BaseNetwork<number, null>;
    /**
     * Generate a Barabasi–Albert preferential attachment network.
     * `n` is the number of nodes and `m` the number of edges added for each new node.
     */
    static barabasiAlbert(n: number, m: number): BaseNetwork<number, null>;
    /**
     * Build a deterministic hierarchical scale-free network using the pseudofractal model.
     */
    static hierarchical(iterations: number): BaseNetwork<number, null>;
    /**
     * Generate a network exhibiting the rich‑club phenomenon.
     */
    static richClub(n: number, clubSize: number, p: number): BaseNetwork<number, null>;
    /**
     * Build an Apollonian network by recursively subdividing triangles.
     */
    static apollonian(iterations: number): BaseNetwork<number, null>;
    /**
     * Generate a simple stochastic block model with equal intra and inter community probabilities.
     */
    static stochasticBlockModel(blockSizes: number[], pIn: number, pOut: number): BaseNetwork<number, null>;
    /**
     * Generate a latent space/random dot-product network.
     */
    static latentSpace(n: number, d: number, threshold: number): BaseNetwork<number[], null>;
    /**
     * Heuristic check if the network resembles an Erdos-Renyi random network.
     */
    isErdosRenyi(tolerance?: number): boolean;
    /** Check if each node has degree approximately `2*k` as in a ring lattice. */
    isRingLattice(k: number): boolean;
    /** Rough test for a Barabasi–Albert style degree distribution. */
    isBarabasiAlbert(): boolean;
    /** Check for rich‑club organisation using a simple coefficient. */
    hasRichClub(threshold?: number): boolean;
    /** Estimate if the network originated from a Watts–Strogatz process. */
    isWattsStrogatz(k: number, betaTolerance?: number): boolean;
    /** Basic check for a deterministic hierarchical structure. */
    isHierarchical(): boolean;
    /** Quick planar check for an Apollonian network. */
    isApollonian(): boolean;
    /** Rough heuristic detecting block community structure. */
    isStochasticBlockModel(): boolean;
    /** Determine if node vectors likely generated edges via dot-product similarity. */
    isLatentSpace(): boolean;
    private nodeClusteringCoefficient;
    private averageClusteringCoefficient;
    /**
     * Generate an n-dimensional cube network.
     */
    static nCube(n: number): BaseNetwork<number[], null>;
    constructor({ nodes, edges, weightFn, }?: {
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
        weightFn?: (weight: number, data: T, g?: BaseNetwork<V, T, S>) => number;
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
    adjacencyMatrix(weightFn?: (weight: number, data: T, g?: BaseNetwork<V, T, S>) => number): number[][];
    clone(): BaseNetwork<V, T, S>;
    BFSNode({ startingNode, callback, errorCallback, }: {
        startingNode: Node<V> | string;
        callback?: (node: Node<V> | null, g?: BaseNetwork<V, T, S>) => unknown;
        errorCallback?: (node: Node<V> | null, error: Error, g?: BaseNetwork<V, T, S>) => unknown;
    }): this;
    BFSNodeAsync({ startingNode, callback, errorCallback, }: {
        startingNode: Node<V> | string;
        callback?: (node: Node<V> | null, g?: BaseNetwork<V, T, S>) => Promise<unknown>;
        errorCallback?: (node: Node<V> | null, error: Error, g?: BaseNetwork<V, T, S>) => Promise<unknown>;
    }): Promise<this>;
    BFS({ callback, errorCallback, }?: {
        callback?: (node: Node<V> | null, g?: BaseNetwork<V, T, S>) => unknown;
        errorCallback?: (node: Node<V> | null, error: Error, g?: BaseNetwork<V, T, S>) => unknown;
    }): this;
    BFSAsync({ callback, errorCallback, }?: {
        callback?: (node: Node<V>, g?: BaseNetwork<V, T, S>) => Promise<unknown>;
        errorCallback?: (node: Node<V>, error: Error, g?: BaseNetwork<V, T, S>) => Promise<unknown>;
    }): Promise<this>;
    DFS({ callback, errorCallback, }: {
        callback?: (node: Node<V>, g?: BaseNetwork<V, T, S>) => unknown;
        errorCallback?: (node: Node<V>, error: Error, g?: BaseNetwork<V, T, S>) => unknown;
    }): this;
    DFSAsync({ callback, errorCallback, }?: {
        callback?: (node: Node<V>, g?: BaseNetwork<V, T, S>) => Promise<unknown>;
        errorCallback?: (node: Node<V>, error: Error, g?: BaseNetwork<V, T, S>) => Promise<unknown>;
    }): Promise<this>;
    DFSNode({ startingNode, callback, errorCallback, }: {
        startingNode: Node<V> | string;
        callback?: (node: Node<V>, g?: BaseNetwork<V, T, S>) => unknown;
        errorCallback?: (node: Node<V>, error: Error, g?: BaseNetwork<V, T, S>) => unknown;
    }): this;
    DFSNodeAsync({ startingNode, callback, errorCallback, }: {
        startingNode: Node<V> | string;
        callback?: (node: Node<V>, g?: BaseNetwork<V, T, S>) => Promise<unknown>;
        errorCallback?: (node: Node<V>, error: Error, g?: BaseNetwork<V, T, S>) => Promise<unknown>;
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
    bridges(weightFn?: (weight: number, data: T, g?: BaseNetwork<V, T, S>) => number): {
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
    directedBridges(weightFn?: (weight: number, data: T, g?: BaseNetwork<V, T, S>) => number): {
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
    PRIM({ start, weightFn, }?: {
        start?: string;
        weightFn?: (weight: number, data: T, g?: BaseNetwork<V, T, S>) => number;
    }): BaseNetwork<V, T, S>;
    /**
     * Compute earliest finish times for nodes using a forward pass (PERT).
     */
    PERT(weightFn?: (weight: number, data: T, g?: BaseNetwork<V, T, S>) => number): Map<string, number>;
    /**
     * Determine the critical path and its duration using CPM.
     */
    CPM(weightFn?: (weight: number, data: T, g?: BaseNetwork<V, T, S>) => number): {
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
