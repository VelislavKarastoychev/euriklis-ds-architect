import type { DynamicStack } from "../../Stack";
import type { BSTDataNode } from "../../DataNode";
import type { BST } from "..";
export declare const CallDFS: <T extends any, AbstractBSTDataNode extends BSTDataNode>(tree: BST<T>, S: DynamicStack<AbstractBSTDataNode | null>, callback: (node: AbstractBSTDataNode, tree: BST<T>) => void) => void;
