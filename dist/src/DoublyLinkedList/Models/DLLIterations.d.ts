import type { DoublyLinkedList } from "..";
import type { LinkedDataNode } from "../../DataNode";
export declare const DLLTraverse: <T>(callback: (d: any, id: string, list: DoublyLinkedList<T>) => void, node: LinkedDataNode<T> | null, list: DoublyLinkedList<T>, inversed: boolean) => void;
export declare const DLLLoop: <T>(callback: (data: T | null, id: string, list: DoublyLinkedList<T>) => boolean, node: LinkedDataNode<T> | null, list: DoublyLinkedList<T>, inversed: boolean) => void;
