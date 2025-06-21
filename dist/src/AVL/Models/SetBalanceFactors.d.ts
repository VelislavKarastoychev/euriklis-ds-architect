import type { AVLTree } from "..";
import type { AVLDataNode } from "../../DataNode";
export declare const SetBalanceFactorsForward: <T>(node: AVLDataNode | null, tree: AVLTree<T>) => void;
export declare const SetBalanceFactorsAfterDeletion: <T>(node: AVLDataNode | null, tree: AVLTree<T>) => void;
export declare const UpdateNodeBalance: <T>(node: AVLDataNode<T>, tree: AVLTree<T>) => void;
export declare const SetBalanceFactorsBackward: <T>(node: AVLDataNode<T>, tree: AVLTree<T>, rebalancing?: boolean) => void;
