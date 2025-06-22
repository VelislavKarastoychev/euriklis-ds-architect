import { DataNode } from "./DataNode";
/**
 * Simple wrapper around `DataNode` used by heap structures.
 */
export declare class HeapDataNode<T = unknown> extends DataNode<T> {
    constructor(data: T);
}
