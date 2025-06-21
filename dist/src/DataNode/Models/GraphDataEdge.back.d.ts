import { DataNode } from "./DataNode";
import { DirectedGraphDataNode, UndirectedGraphDataNode } from "./GraphDataNode";
export declare class GraphDataEdge<INData = unknown, NData = unknown, EData = unknown> extends DataNode<EData> {
    protected _link?: DirectedGraphDataNode<NData, INData, EData> | UndirectedGraphDataNode<NData, INData, EData>;
    protected __weight__: number;
    constructor({ link, data, weight, }: {
        link: DirectedGraphDataNode<NData, INData, EData> | UndirectedGraphDataNode<NData, INData, EData>;
        data: EData;
        weight: number;
    });
    get link(): DirectedGraphDataNode<NData, INData, EData> | UndirectedGraphDataNode<NData, INData, EData> | undefined;
    set link(link: DirectedGraphDataNode<NData, INData, EData> | UndirectedGraphDataNode<NData, INData, EData>);
    get data(): EData | null;
    set data(d: EData);
    get weight(): number;
    set wight(w: number);
}
