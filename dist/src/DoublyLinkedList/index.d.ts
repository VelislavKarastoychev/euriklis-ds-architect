import type { Integer, SecureStoreType } from "../../Types";
/**
 * This class implements a doubly linked list
 * data structure. The implementation of the
 * DoublyLinkedList instance was largely inspired
 * by the work of programmer Georgi Stoychev, with
 * the exception of the concept of limiting the
 * list size and storing the data in AVL trees,
 * which are my own contributions.
 *
 * I chose to store the values in a BST (Binary Search Tree)
 * structure, specifically AVL trees, instead of using a
 * only a Map (hash table structure) for the following reasons:
 * 1. BSTs, and AVL trees in particular, are dynamic structures
 *    that offer relatively fast query operations.
 * 2. As a dynamic structure, BSTs help in avoiding the
 *    concentration of large memory blocks, thereby achieving
 *    better memory balancing.
 * 3. BSTs have predictable time complexity for operations,
 *    whereas hash tables can have amortized complexity in
 *    collision cases.
 * 4. The implementation of AVL trees is open source, providing
 *    me with full control over their manipulation, unlike the
 *    Map structure which is internally implemented in JavaScript.
 *  However the Map JavaScript structure is faster than the AVL trees.
 */
/**
 * @class DoublyLinkedList
 * @classdesc This class represents a doubly linked list
 * with optional size limitation.
 */
export declare class DoublyLinkedList<T> {
    private _size;
    private _head;
    private _tail;
    private _currentSize;
    private _secureStore;
    private _map;
    /**
     * Generates a DoublyLinkedList filled
     * with random numbers based on the provided options.
     *
     * @param {Object} options - The options for
     * generating the random DoublyLinkedList.
     * @param {Integer} options.length - The
     * number of random elements to generate.
     * @param {Integer} [options.from=0] - The minimum
     * value (inclusive) for the random numbers.
     * @param {Integer} [options.to=1] - The maximum
     * value (exclusive) for the random numbers.
     * @param {Integer} [options.seed=123456] - The seed
     * for the random number generator.
     * @param {(d: any, id?: string, list?: DoublyLinkedList) => any} [options.callback] - A callback
     * function to apply to each random element.
     * @param {SecureStoreType} [options.mapType="Map"] - The
     * type of map to use for storing elements.
     * @returns {DoublyLinkedList} A new DoublyLinkedList
     * instance filled with random numbers.
     */
    static random(options: {
        length: Integer;
        from?: Integer;
        to?: Integer;
        seed?: Integer;
        callback?: (d: any, id?: string, list?: DoublyLinkedList<number | unknown>) => any;
        mapType?: SecureStoreType;
    }): DoublyLinkedList<number | unknown>;
    /**
     * Creates an instance of DoublyLinkedList.
     * @param {T} [data] - The initial data to add to the list.
     * @param {Integer} [size=Infinity] - The maximum size of the list.
     */
    constructor(data?: T, size?: Integer);
    /**
     * Gets the maximum size of the list.
     * @returns {Integer}
     */
    get size(): Integer;
    get mapType(): SecureStoreType;
    set mapType(type: SecureStoreType);
    /**
     * Sets the maximum size of the list.
     * @type {Integer}
     */
    set size(s: Integer);
    /**
     * Gets the data of the head node.
     * @returns {T | null}
     */
    get head(): T | null;
    /**
     * Gets the data of the top (last) node.
     * @returns {T | null}
     */
    get top(): T | null;
    /**
     * Gets the current length of the list.
     * @returns {Integer}
     */
    get length(): Integer;
    /**
     * Checks if the list is empty.
     * @returns {boolean}
     */
    get isEmpty(): boolean;
    /**
     * Adds a node with the given data to the end of the list.
     * @param {any} data - The data to add.
     * @param{string} id? - The id property of the data node.
     * @returns {DoublyLinkedList} The updated list.
     */
    addLast(data: T, id?: string): this;
    /**
     * Removes the last node from the list.
     * @returns {T | null} The data of the removed node.
     */
    removeLast(): T | null;
    /**
     * Removes the first node from the list.
     * @returns {T | null} The data of the removed node.
     */
    removeFirst(): T | null;
    /**
     * Removes a node by its ID.
     * @param {string} id - The ID of the node to remove.
     * @returns {T | null} The data of the removed node.
     */
    remove(id: string): T | null;
    /**
     * Inserts a node with the given data after the node with the specified ID.
     * @param {string} id - The ID of the node to insert after.
     * @param {T} data - The data to insert.
     * @param {string} dataId? - the "id" property of the new node.
     * @returns {DoublyLinkedList<T>} The updated list.
     */
    insertAfter(id: string, data: T, dataId?: string): this;
    /**
     * Inserts a node with the given data before the node with the specified ID.
     * @param {string} id - The ID of the node to insert before.
     * @param {T} data - The data to insert.
     * @param{string} dataId? - The id property of the data node which will be created.
     * @returns {DoublyLinkedList<T>} The updated list.
     */
    insertBefore(id: string, data: T, dataId?: string): DoublyLinkedList<T>;
    /**
     * Returns a map of all node values, keyed by their IDs.
     * @returns {Map<string, any>} The map of node values.
     */
    values(): Map<string, any>;
    /**
     * Checks if a node with the specified ID exists in the list.
     * @param {string} id - The ID to check for.
     * @returns {boolean} True if the node exists, otherwise false.
     */
    has(id: string): boolean;
    /**
     * Traverses the list, applying the given callback to each node.
     * @param {function} callback - The function to apply to each node.
     * @param {boolean} [inversed=false] - Whether to traverse in reverse order.
     * @returns {DoublyLinkedList<T>} The traversed list.
     */
    traverse(callback: (d: T, id?: string, list?: DoublyLinkedList<T>) => unknown, inversed?: boolean): DoublyLinkedList<T>;
    /**
     * Traverses through the nodes of the doubly linked
     * list until the callback function returns true or
     * the final node has reached.
     * @param{function} callback - A function which returns a boolean
     * @param {boolean} inversed - A boolean. If true, then the traversing
     * of the doubly linked list starts from the final node.
     * @returns{DoublyLinkedList<T>} The initial doubly linked list instance.
     * Note that the values may be changed from the callback function of the
     * method.
     */
    loop(callback: (d: T | null, id: string, list?: DoublyLinkedList<T>) => boolean, inversed?: boolean): DoublyLinkedList<T>;
    /**
     * Filters the list, returning a new list with nodes that match the given callback.
     * @param {function} callback - The function to apply to each node.
     * @param {boolean} [inversed=false] - Whether to traverse in reverse order.
     * @returns {DoublyLinkedList<T>} The filtered list.
     */
    filter(callback: (d: T, id?: string, list?: DoublyLinkedList<T>) => boolean, inversed?: boolean): DoublyLinkedList<T>;
    /**
     * Creates a copy of the list.
     * @param {boolean} [inversed=false] - Whether to traverse in reverse order.
     * @returns {DoublyLinkedList<T>} The copied list.
     */
    copy(inversed?: boolean): DoublyLinkedList<T>;
    /**
     * Checks if every node in the list satisfies the given callback.
     * @param {function} callback - The function to apply to each node.
     * @returns {boolean} True if all nodes satisfy the callback, otherwise false.
     */
    every(callback: (d: any, id?: string, list?: DoublyLinkedList<T>) => boolean): boolean;
    /**
     * Checks if any node in the list satisfies the given callback.
     * @param {function} callback - The function to apply to each node.
     * @returns {boolean} True if any node satisfies the callback, otherwise false.
     */
    any(callback: (d: T | null, id?: string, list?: DoublyLinkedList<T>) => boolean): boolean;
    /**
     * Clears the list.
     * @returns {DoublyLinkedList<T>} The cleared list.
     */
    clean(): this;
    /**
     * Merges another doubly linked list into this list.
     * @param {DoublyLinkedList<T>} list - The list to merge.
     * @returns {DoublyLinkedList<T>} The merged list.
     */
    merge(list: DoublyLinkedList<T>): this;
    /**
     * Returns an iterator for the DoublyLinkedList,
     * allowing it to be used in for-of loops and
     * other iterable contexts. The iterator
     * traverses the list from head to tail.
     *
     * @returns {Iterator<T>} An iterator that
     * yields the data of each node in the DoublyLinkedList.
     */
    [Symbol.iterator](): Iterator<T>;
    /**
     * Checks if two doubly linekd lists contains
     * the same data.
     *
     * @param{DoublyLinkedList<T>} list - the list
     * used for the comparison.
     * @returns {boolean} "True" if the data of list
     * and the current DoublyLinkedList instance
     * are the same and false otherwise.
     */
    isSame(list: DoublyLinkedList<T>): boolean;
    /**
     * Checks if two doubly linekd lists contains
     * the same data and IDs.
     *
     * @param{DoublyLinkedList<T>} list - the list
     * used for the comparison.
     * @returns {boolean} "True" if the data and the IDs
     * of list and the current DoublyLinkedList instance
     * are the same as well as the mapType and false otherwise.
     */
    isExactlySame(list: DoublyLinkedList<T>): boolean;
    /**
     * Finds a node by its ID.
     * @private
     * @param {string} id - The ID of the node to find.
     * @returns {LinkedDataNode | null} The found node or null if not found.
     */
    private _findNodeById;
}
