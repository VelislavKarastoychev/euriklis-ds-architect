import type { HeapType, Integer } from "../../../Types";
import type { HeapDataNode } from "../../DataNode";
export declare const PrimaryHeapSearchIndex: <T = unknown>(heap: HeapDataNode<T>[], id: string, type: HeapType) => Integer;
