import type { HeapType } from "../../../Types";
import type { HeapDataNode } from "../../DataNode";
export declare const PrimaryHeapSearch: <T = unknown>(heap: HeapDataNode<T>[], id: string, type: HeapType) => HeapDataNode<T>[] | null;
