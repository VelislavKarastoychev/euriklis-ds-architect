import type { SecureStoreType } from "../../../Types";
import { AVLTree } from "../../AVL";
import type { LinkedDataNode } from "../../DataNode";
export declare const GenerateMap: <T>(secureStore: SecureStoreType) => Map<string, LinkedDataNode<T>> | AVLTree<LinkedDataNode<T>> | null;
