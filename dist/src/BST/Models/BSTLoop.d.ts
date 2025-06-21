import type { BST } from "..";
import type { BSTDataNode } from "../../DataNode";
import type { Queue } from "../../Queue";
export declare const BSTLoop: <T extends any, AbstractBSTDataNode extends BSTDataNode>(callback: (node: AbstractBSTDataNode, bst: BST<T>) => boolean, queue: Queue<AbstractBSTDataNode | null>, tree: BST<T>) => void;
