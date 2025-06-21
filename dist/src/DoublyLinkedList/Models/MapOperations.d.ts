import { AVLTree } from "../../AVL";
import type { LinkedDataNode } from "../../DataNode";
export declare const MapInsertion: <T = undefined>(Node: LinkedDataNode<T>, map: null | Map<string, LinkedDataNode<T>> | AVLTree<LinkedDataNode<T>>) => void;
export declare const MapDeletion: <T = unknown>(id: string, map: null | Map<string, LinkedDataNode> | AVLTree<LinkedDataNode<T>>) => void;
export declare const MapHas: <T = unknown>(id: string, map: Map<string, LinkedDataNode> | AVLTree<LinkedDataNode<T>>) => boolean;
