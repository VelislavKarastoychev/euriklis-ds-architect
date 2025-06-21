import type { DynamicStack } from "../../Stack";
import type { BSTDataNode } from "../../DataNode";
export declare const IsNodeExactlySame: <AbstractBSTDataNode extends BSTDataNode>(S1: DynamicStack<AbstractBSTDataNode | null>, S2: DynamicStack<AbstractBSTDataNode | null>) => boolean;
export declare const IsNodeSame: <AbstractBSTDataNode extends BSTDataNode>(S1: DynamicStack<AbstractBSTDataNode | null>, S2: DynamicStack<AbstractBSTDataNode | null>) => boolean;
