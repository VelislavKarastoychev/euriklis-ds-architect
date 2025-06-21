import type { DoublyLinkedList } from "..";
import type { Integer } from "../../../Types";
export declare const FillDLLWithRandomNumbers: (l: DoublyLinkedList<number>, n: Integer, from: number, to: number, seed: number, callback?: (d: number, id: string, list: DoublyLinkedList<number>) => any) => void;
