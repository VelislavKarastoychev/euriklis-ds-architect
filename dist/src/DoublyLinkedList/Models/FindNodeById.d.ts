import { AVLTree } from "../../AVL";
import type { LinkedDataNode } from "../../DataNode";
export declare const FindNodeFromMap: <T>(id: string, map: Map<string, LinkedDataNode<T>> | AVLTree<LinkedDataNode<T>>) => LinkedDataNode<T> | null;
export declare const FindNodeFromDLL: <T>(id: string, node: LinkedDataNode<T> | null) => LinkedDataNode<T> | null;
