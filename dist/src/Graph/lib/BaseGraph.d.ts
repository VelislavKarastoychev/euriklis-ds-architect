import { GraphDataNode, GraphDataEdge } from "../../DataNode";
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
