import type { HeapType, Integer } from "../../Types";
import { HeapDataNode } from "../DataNode";
export declare class PrimaryHeap<T = unknown> {
    private _heap;
    private _type;
    private _size;
    private _compare;
    /**
     * Creates a PrimaryHeap from an array of items.
     * @param {T[]} items - The items to create the heap from.
     * @param {Integer} [size=Infinity] - The maximum size of the heap.
     * @param {HeapType} [type="max"] - The type of heap, either "max" or "min".
     * @returns {PrimaryHeap<T>} - The newly created PrimaryHeap.
     */
    static from<T = unknown>(items: T[], size?: Integer, type?: HeapType): PrimaryHeap<T>;
    /**
     * Constructs a PrimaryHeap instance.
     * @param {T} [data] - Initial data to add to the heap.
     */
    constructor(data?: T);
    get compare(): (a: HeapDataNode<T>, b: HeapDataNode<T>, i?: Integer, j?: Integer, heap?: HeapDataNode<T>[]) => 1 | -1 | 0;
    set compare(callback: (a: HeapDataNode<T>, b: HeapDataNode<T>, i?: Integer, j?: Integer, heap?: HeapDataNode<T>[]) => 1 | -1 | 0);
    /**
     * Gets the length of the heap.
     * @returns {Integer} - The length of the heap.
     */
    get length(): Integer;
    set length(l: Integer);
    /**
     * Gets the maximum size of the heap.
     * @returns {Integer} - The maximum size of the heap.
     */
    get size(): Integer;
    /**
     * Sets the maximum size of the heap.
     * @param {Integer} s - The new maximum size.
     */
    set size(s: Integer);
    /**
     * Gets the type of the heap.
     * @returns {"max" | "min"} - The type of the heap.
     */
    get type(): "max" | "min";
    /**
     * Sets the type of the heap.
     * @param {"max" | "min"} t - The new type.
     */
    set type(t: "max" | "min");
    /**
     * Adds a new element to the heap.
     * @param {T | undefned} data - The data to add.
     * @returns {PrimaryHeap<T>} - The heap instance.
     * @throws {Error} - If the heap size exceeds the maximum size.
     */
    add(data: T | undefined): PrimaryHeap<T>;
    /**
     * Searches for an element by its id.
     * Complexity - O(n / 2), where the n is the length of the heap.
     * @param {string} id - The id of the element to search for.
     * @returns {HeapDataNode[] | null} - The found elements or null.
     */
    search(id: string): HeapDataNode[] | null;
    /**
     * Searches for the index of an element by its id.
     * Complexity - O(n / 2) using heap ordering.
     * @param {string} id - The id of the element to search for.
     * @returns {Integer[] | null} Found indices or null.
     */
    searchIndex(id: string): Integer;
    /**
     * Removes an element from the heap by id.
     * Complexity: O(n) due to heapify after removal.
     * @param {string} id - The id of the element to remove.
     * @returns {T | null} - The removed element data or null if not found.
     */
    remove(id: string): T | null;
    /**
     * Merges another heap into this one.
     * @param {PrimaryHeap<T>} heap - The heap to merge with.
     * @returns {PrimaryHeap<T>} The merged heap.
     */
    merge(heap: PrimaryHeap<T>): PrimaryHeap<T>;
    /**
     * Convert heap contents to an array of data values.
     * @returns {T[]} - The array of values in heap order.
     */
    toArray(): T[];
    /**
     * Returns an iterator for the heap.
     * @returns {Iterator<T>} - An iterator for the heap.
     */
    [Symbol.iterator](): Iterator<T>;
}
export declare class Heap<T> extends PrimaryHeap<T> {
    /**
     * Constructs a Heap instance.
     * @param {T} [data] - Initial data to add to the heap.
     */
    constructor(data?: T);
}
