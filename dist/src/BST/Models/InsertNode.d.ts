import type { BST } from "..";
import { BSTDataNode } from "../../DataNode";
/**
 * Inserts a new node with the given data into the Binary Search Tree (BST).
 * If the BST's `unique` property is set to true and a node with the same ID exists,
 * the existing node will be replaced with the new node.
 * @param tree The BST instance where the node should be inserted.
 * @param data The data to be stored in the new node.
 * @param id Optional. The ID for the new node. If not provided, `data.id` will be used if available.
 * @returns The newly inserted BSTDataNode.
 */
export declare const InsertNodeInBST: <T extends any, AbstractBSTDataNode extends BSTDataNode>(tree: BST<T>, node: AbstractBSTDataNode, id?: string) => AbstractBSTDataNode | null;
