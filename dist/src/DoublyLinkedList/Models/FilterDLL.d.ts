import type { DoublyLinkedList } from "..";
import type { LinkedDataNode } from "../../DataNode";
export declare const FilterDLL: <T = undefined>(node: LinkedDataNode<T> | null, callback: (d: any, id?: string, list?: DoublyLinkedList<T>) => boolean, l1: DoublyLinkedList<T>, l2: DoublyLinkedList<T>, inversed: boolean) => void;
