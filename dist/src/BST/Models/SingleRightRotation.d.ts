import type { BST } from "..";
import type { BSTDataNode } from "../../DataNode";
/**
 * Performs single right rotation of an AVL
 * tree.
 *
 * @param a - The node which has to be rotated.
 * @returns{void}
 */
export declare const SingleRightRotation: <T extends any, AbstractBSTDataNode extends BSTDataNode<T>>(a: AbstractBSTDataNode, tree: BST<T>) => void;
