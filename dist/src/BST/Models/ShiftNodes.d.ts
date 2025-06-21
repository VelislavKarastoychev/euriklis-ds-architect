import type { BST } from "..";
import type { BSTDataNode } from "../../DataNode";
export declare const ShiftNodes: <T extends unknown, AbstractBSTDataNode extends BSTDataNode<T>>(tree: BST<T>, u: AbstractBSTDataNode, v: AbstractBSTDataNode | null) => void;
