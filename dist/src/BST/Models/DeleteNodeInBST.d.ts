import type { BST } from "..";
import type { BSTDataNode } from "../../DataNode";
export declare const DeleteNodeInBST: <T extends any, AbstractBSTDataNode extends BSTDataNode<T>>(node: AbstractBSTDataNode | null, tree: BST<T>) => AbstractBSTDataNode | null;
