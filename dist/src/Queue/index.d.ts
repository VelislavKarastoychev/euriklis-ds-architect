import type { Integer } from "../../Types";
import { LinkedDataNode } from "../DataNode";
/**
 * This class implements a queue data structure
 * using a linked list.
 */
export declare class Queue<T = unknown> {
    static random(n: Integer, from?: number, to?: number): Queue<number>;
    private _head;
    private _tail;
    private _size;
    private _length;
    /**
     * Creates an instance of Queue.
     * @param {T} [data] - The initial data to enqueue.
     * @param {Integer} [size=Infinity] - The maximum size of the queue.
     */
    constructor(data?: T, size?: Integer);
    /**
     * Gets the maximum size of the queue.
     * @returns {Integer}
     */
    get size(): Integer;
    /**
     * Sets the maximum size of the queue.
     * @param {Integer} s - the maximum size.
     */
    set size(s: Integer);
    /**
     * Checks if the queue is empty.
     * @returns {boolean}
     */
    get isEmpty(): boolean;
    get length(): Integer;
    /**
     * Views the front item without removing it.
     * Time complexity: O(1).
     * @returns {T | null} The front data.
     */
    get peek(): T | null;
    /**
     * Views the last item without adding
     * another element.
     * @returns {T | null} The last element.
     */
    get rear(): T | null;
    /**
     * @private
     * Enqueues a node into the queue.
     * Time complexity: O(1).
     * @param {LinkedDataNode<T>} node - The node to enqueue.
     */
    private _enqueue;
    /**
     * Adds data to the end of the queue.
     * Time complexity: O(1).
     * @param {T} data - The data to enqueue.
     * @returns {Queue<T>} The updated queue.
     */
    enqueue(data: T): Queue<T>;
    /**
     * Adds multiple items to the queue.
     * Time complexity: O(n), where the "n"  is the
     * length of the length of the "items" parameter.
     * @param {T[]} items - The items to enqueue.
     * @returns {Queue<T>} The updated queue.
     */
    enqueueMany(items: T[]): Queue<T>;
    /**
     * Removes and returns the first item in the queue.
     * Time complexity: O(1).
     * @returns {T | null} The dequeued data.
     */
    dequeue(): T | null;
    /**
     * Removes and returns multiple items from the front of the queue.
     * Time complexity: O(n), where the "n" is the count of the elements
     * which have to be deleted.
     * @param {Integer} [n=1] - The number of items to dequeue.
     * @returns {T[]} The dequeued data items.
     */
    dequeueMany(n?: Integer): T[];
    /**
     * Traverses the queue, applying the given callback to each node.
     * Time complexity: O(n), where the "n" is the length of the queue.
     * @param {function} callback - The function to apply to each node.
     * @param {boolean} [inversed=false] - Whether to traverse in reverse order.
     * @returns {Queue<T>} The traversed queue.
     */
    traverse(callback: (node: LinkedDataNode<T>, queue: Queue<T>) => void, inversed?: boolean): Queue<T>;
    /**
     * Filters the queue, returning a new queue with nodes that match the given callback.
     * Time complexity: O(n), where the "n" is the length of the queue.
     * @param {function} callback - The function to apply to each node.
     * @returns {Queue} The filtered queue.
     */
    filter(callback: (node: LinkedDataNode<T>, queue?: Queue<T>) => boolean): Queue<T>;
    /**
     * Checks if the queue contains a specific element.
     * Time complexity: 0(n), where the "n" is the length of the queue.
     * @param {T} data - The data to search for.
     * @returns {boolean} True if the queue contains the element, false otherwise.
     */
    contains(data: T): boolean;
    /**
     * Reverses the order of elements in the queue.
     * @returns {Queue<T>} The reversed queue.
     */
    reverse(): Queue<T>;
    /**
     * Clears the queue.
     * @returns {Queue<T>} The emmpy queue.
     */
    clean(): Queue<T>;
    /**
     * Creates a shallow copy of the queue.
     * Time complexity: O(n), where the "n" is the number of the elements of the queue.
     * @returns {Queue<T>} A new queue instance with the same elements as the current queue.
     */
    copy(): Queue<T>;
    /**
     * Merges another queue into this queue.
     * Complexity: O(1).
     * @param {Queue<T>} queue - The queue to merge into this one.
     * @returns {Queue<T>} The updated queue.
     */
    merge(queue: Queue<T>): Queue<T>;
    /**
     * Converts the queue to an array.
     * @returns {T[]} The array representation of the queue.
     */
    toArray(): T[];
    [Symbol.iterator](): Iterator<T | null>;
}
