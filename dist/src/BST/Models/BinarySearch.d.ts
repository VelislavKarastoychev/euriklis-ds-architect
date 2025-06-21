import type { BST } from "..";
import type { BSTNodeValueComparisonCallbackType } from "../../../Types";
import type { BSTDataNode } from "../../DataNode";
export declare const BinarySearchNode: <T extends any, AbstractBSTDataNode extends BSTDataNode>(tree: BST<T>, node: AbstractBSTDataNode | null, callback: (node: AbstractBSTDataNode, tree?: BST<T>) => -1 | 0 | 1) => AbstractBSTDataNode | null;
export declare const BinarySearch: <T extends any, AbstractBSTDataNode extends BSTDataNode>(node: AbstractBSTDataNode | null, value: T, callback: BSTNodeValueComparisonCallbackType) => AbstractBSTDataNode | null;
