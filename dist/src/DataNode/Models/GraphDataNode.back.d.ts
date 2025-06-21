import type { GraphEdgeType } from "../../Graph/Types";
import { DataNode } from "./DataNode";
import { GraphDataEdge } from "./GraphDataEdge";
export declare class BaseGraphDataNode<INData = unknown, // the data which the node may accept
ONData = unknown, // The output nide data
EData = unknown> extends DataNode<ONData> {
    protected __name__: string;
    protected __value__: number;
    constructor({ name, data, value, }: {
        name: string;
        data: ONData;
        value: number;
    });
    get name(): string;
    set name(name: string);
    get data(): ONData | null;
    set data(d: ONData);
    get value(): number;
    set value(v: number);
}
export declare class DirectedGraphDataNode<INData = unknown, // the data which the node may accept
ONData = unknown, EData = unknown> extends BaseGraphDataNode<INData, ONData, EData> {
    protected __inEdges__: Map<string, GraphDataEdge<INData, ONData, EData>>;
    protected __outEdges__: Map<string, GraphDataEdge<ONData, INData, EData>>;
    constructor(options: {
        name: string;
        data: ONData;
        value: number;
    });
    get inEdges(): Map<string, GraphDataEdge<INData, ONData, EData>>;
    set inEdges(inputEdges: Map<string, GraphDataEdge<INData, ONData, EData>>);
    get outEdges(): Map<string, GraphDataEdge<ONData, INData, EData>>;
    set outEdges(outputEdges: Map<string, GraphDataEdge<ONData, INData, EData>>);
    addIncommingEdge({ source, data, weight, }: {
        source: DirectedGraphDataNode<ONData, INData, EData>;
        data: EData;
        weight: number;
    }): this;
    addOutgoingEdge({ target, data, weight, }: {
        target: DirectedGraphDataNode<INData, ONData, EData>;
        data: EData;
        weight: number;
    }): this;
    getIncomingEdgeByName(name: string): GraphDataEdge<ONData, INData, EData> | undefined;
    getOutgoingEdgeByName(name: string): GraphDataEdge<INData, ONData, EData> | undefined;
    removeIncommingEdge(source: DirectedGraphDataNode<INData, ONData, EData>): GraphDataEdge<INData, EData> | undefined;
    removeOutgoingEdge(target: DirectedGraphDataNode<INData, ONData, EData>): GraphDataEdge<INData, ONData, EData> | undefined;
    clearEdges(): this;
    getIncommingEdges(): GraphEdgeType<EData>[];
    getOutgoingEdges(): GraphEdgeType<EData>[];
}
export declare class UndirectedGraphDataNode<NData, EData> extends BaseGraphDataNode<NData, NData, EData> {
    private __edges__;
    constructor(options: {
        name: string;
        data: NData;
        value: number;
    });
    get edges(): Map<string, GraphDataEdge<NData, NData, EData>>;
    set edges(edges: Map<string, GraphDataEdge<NData, NData, EData>>);
    addEdge({ target, data, weight, }: {
        target: UndirectedGraphDataNode<NData, EData>;
        data: EData;
        weight: number;
    }): UndirectedGraphDataNode<NData, EData>;
    getEdge(target: string): GraphDataEdge<NData, EData> | undefined;
    removeEdge(target: UndirectedGraphDataNode<NData, EData>): GraphDataEdge<NData, NData, EData> | undefined;
    getEdges(): GraphEdgeType<EData>[];
    clearEdges(): this;
}
