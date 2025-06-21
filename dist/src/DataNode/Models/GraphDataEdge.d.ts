import { GraphDataNode, Node, Vertex } from "./GraphDataNode";
export declare abstract class GraphDataEdge<S extends GraphDataNode<any, any>, T extends GraphDataNode<any, any>, D = unknown> {
    protected __SOURCE__: S;
    protected __TARGET__: T;
    protected __DATA__: D | null;
    private __ID__;
    constructor(__SOURCE__: S, __TARGET__: T, __DATA__?: D | null);
    get id(): string;
    set id(id: string);
    get source(): S;
    set source(s: S);
    get target(): T;
    set target(t: T);
    get data(): D | null;
    set data(d: D);
}
export declare class Edge<D = unknown> extends GraphDataEdge<Vertex<unknown>, Vertex<unknown>, D> {
    constructor({ source, target, data, }: {
        source: Vertex<any>;
        target: Vertex<any>;
        data: D;
    });
}
export declare class Arc<D = unknown> extends GraphDataEdge<Node<any>, Node<any>, D> {
    protected __WEIGHT__: number;
    constructor({ source, target, data, weight, }: {
        source: Node<any>;
        target: Node<any>;
        data: D;
        weight?: number;
    });
    get weight(): number;
    set weight(w: number);
}
