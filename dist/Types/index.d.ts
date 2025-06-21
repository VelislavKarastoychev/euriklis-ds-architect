import type { BSTDataNode } from "../src/DataNode";
export type Integer = number;
export type GraphDataType = null;
export type AbstractAttributesType = {
    [property: string]: unknown;
};
export type SecureStoreType = "AVL" | "Map";
export type NodeType = {
    id: string | number;
    name: string;
    data: {
        value: number | string | number[] | number[][] | string[] | string[][];
        [property: string]: unknown;
    };
};
export type HeapType = "max" | "min";
export type BSTNodeComparisonCallbackType = <T extends BSTDataNode>(x: T, y: T) => -1 | 0 | 1;
export type BSTNodeValueComparisonCallbackType = <T extends BSTDataNode>(x: T, value: any) => -1 | 0 | 1;
type K<T> = NonNullable<T>;
export type ExtendedBSTDataNode<T> = K<T> extends BSTDataNode<T> ? K<T> : BSTDataNode<T>;
export type EdgeType<D = unknown> = {
    source: string;
    target: string;
    data?: D;
    params?: {
        [param: string]: unknown;
    };
};
export {};
