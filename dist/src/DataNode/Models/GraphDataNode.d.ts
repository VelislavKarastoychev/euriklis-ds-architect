import { GraphDataEdge, Edge, Arc } from "./GraphDataEdge";
/**
 * Base class for all graph-related nodes. Holds incoming and outgoing
 * edges as well as basic metadata like name and data payload.
 */
export declare abstract class GraphDataNode<O = unknown, E extends GraphDataEdge<GraphDataNode<any, E>, GraphDataNode<any, E>, unknown> = GraphDataEdge<GraphDataNode<any, any>, GraphDataNode<any, any>, unknown>> {
    private __ID__;
    protected __NAME__: string;
    protected __DATA__: O | null;
    protected __IN__: Map<string, E>;
    protected __OUT__: Map<string, E>;
    constructor({ name, data }: {
        name: string;
        data: O;
    });
    get id(): string;
    set id(id: string);
    get name(): string;
    set name(name: string);
    get data(): O | null;
    set data(d: O);
    get incomming(): Map<string, E>;
    get outgoing(): Map<string, E>;
    /** Override this to construct your concrete edge subclass */
    protected abstract createEdge<D = unknown>(target: GraphDataNode<any, E>, data?: D, params?: {
        [param: string]: any;
    }): E;
    connect<D = unknown>({ node, data, params, }: {
        node: GraphDataNode<any, E>;
        data: D;
        params: {
            [param: string]: any;
        };
    }): this;
    findConnections(callback: (edge: E) => boolean): Map<string, E>;
    getConnection(target: string | GraphDataNode): E | undefined;
    removeConnection({ node, nodeName, }: {
        nodeName?: string;
        node?: GraphDataNode<any, E>;
    }): E | undefined;
    get inDegree(): number;
    get outDegree(): number;
}
/**
 * Basic graph vertex implementation holding outgoing and incoming edges.
 */
export declare class Vertex<D = unknown> extends GraphDataNode<D, Edge<any>> {
    protected createEdge<T = unknown>(target: Vertex<any>, data: T): Edge<T>;
}
/**
 * Vertex variant storing a numeric value used by weighted graphs.
 */
export declare class Node<D = unknown> extends GraphDataNode<D, Arc<any>> {
    protected __VALUE__: number;
    constructor({ name, data, value }: {
        name: string;
        data: D;
        value: number;
    });
    get value(): number;
    set value(v: number);
    protected createEdge<T = unknown>(target: Node<any>, data: T, { weight }: {
        weight: number;
    }): Arc<T>;
    weightedInDegree(): number;
    weightedOutDegree(): number;
}
