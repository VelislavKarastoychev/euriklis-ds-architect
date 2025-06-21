import type { BST } from "..";
import type { BSTDataNode } from "../../DataNode";
import type { Queue } from "../../Queue";
export declare const CallBFS: <T extends any, AbstractBSTDataNode extends BSTDataNode>(tree: BST<T>, Q: Queue<AbstractBSTDataNode | null>, callback: (node: AbstractBSTDataNode, tree: BST<T>) => void) => void;
