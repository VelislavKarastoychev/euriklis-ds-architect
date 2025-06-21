import type { Integer } from "../../Types";
/**
 * This class implements the Stack data structure
 * using the idea of the linekd lists. So in each
 * instance of a Stack we have to generate a top.
 * when we push an element in the stack, then the
 * top element change and a reference to the previous
 * node is kept.
 * If the top element is null, then the Stack is empty.
 */
export declare class DynamicStack<T extends unknown> {
    /**
     * Holder for the top element of the Stack.
     * This property references the top node of the
     * stack chain.
     * @type {LinkedDataNode<T> | null}
     * @private
     */
    private _top;
    /**
     * Represents the current size (number of elements) of the Stack.
     * @type {Integer}
     * @private
     */
    private _size;
    private _limit;
    /**
     * Pros:
     * - Dynamic resizing allows handling of varying data amounts efficiently.
     * - Consistent performance across operations like pushMany and filter.
     * - Versatile and suitable for scenarios with unpredictable stack sizes.
     *
     * Cons:
     * - Potential for higher memory overhead due to dynamic resizing.
     * - Slightly higher execution times for certain operations compared to a static stack.
     *
     * Creates a new DynamicStack instance.
     * If initial data is provided, it is pushed onto the stack.
     * @param {T} data - The initial data to be stored in the stack (optional).
     */
    constructor(data?: T);
    /**
     * Retrieves the current size (number of elements) of the Stack.
     * @returns {Integer} The size of the Stack.
     */
    get size(): Integer;
    get limit(): Integer;
    /**
     * Checks whether the stack is empty (contains no elements).
     * @returns {boolean} Returns true if the stack is empty, otherwise returns false.
     */
    get isEmpty(): boolean;
    /**
     * Retrieves the top element of the stack without removing it.
     * @returns {T | null} The top element of the stack (last element).
     */
    get top(): T | null;
    /**
     * Pushes an element onto the stack.
     * If the element is valid (not undefined), it is added to the top of the stack.
     * @param {T | null} data - The element to be pushed onto the stack.
     * @returns {DynamicStack} The updated stack after pushing the element.
     */
    push(data?: T): DynamicStack<T>;
    /**
     * Pushes multiple items onto the stack.
     * If any item is valid (not undefined), it is added to the top of the stack.
     * @param {T[]} items - An array of items to be pushed onto the stack.
     * @returns {DynamicStack} The updated stack after pushing the items.
     */
    pushMany(items: T[]): DynamicStack<T>;
    /**
     * Removes and returns the top element of the stack.
     * If the stack is not empty, the top element is removed and returned.
     * @returns {T | null} The removed top element of the stack, or null if the stack is empty.
     */
    pop(): T | null;
    /**
     * Removes and returns multiple elements from the top of the stack.
     * If `n` exceeds the current size of the stack, it removes all elements.
     * @param {Integer} n - The number of elements to remove from the top of the stack.
     * @returns {T[]} An array containing the removed elements from the top of the stack.
     */
    popMany(n: Integer): T[];
    /**
     * Retrieves all elements from the stack in the order of removal (from top to bottom),
     * and empties the stack in the process.
     * @returns {T[]} An array containing all elements of the stack.
     */
    get list(): T[];
    /**
     * Traverses the elements of the stack from top to bottom,
     * executing a callback function on each element.
     * @param {Function} callback A function that will be executed on each element.
     * It receives the element and the stack itself as parameters.
     * @returns {DynamicStack<T>} The updated stack instance.
     */
    traverse(callback: (el: T, stack: DynamicStack<T>) => void): DynamicStack<T>;
    /**
     * Iteratively pops elements from the stack, executes a callback function on each popped element,
     * and collects the popped elements into an array in the order of removal (from top to bottom).
     * @param {Function} callback A function that will be executed on each popped element.
     * It receives the popped element and the stack itself as parameters.
     * @returns {T[]} An array containing all popped elements in the order of removal (from top to bottom).
     */
    popAndTraverse(callback: (el: T, stack: DynamicStack<T>) => void): T[];
    /**
     * Iteratively processes elements of the stack using a callback function until a termination condition is met.
     * The termination condition is determined by the return value of the callback function.
     * @param {Function} callback A function that will be executed on each element of the stack.
     * It receives the current element and the stack itself as parameters.
     * The function should return a boolean value:
     * - `true` to continue iterating to the next element.
     * - `false` to terminate the iteration early.
     * @param {Integer} iterations (Optional) The maximum number of iterations (elements to process).
     * Defaults to the size of the stack.
     * @returns {DynamicStack<T>} The updated stack instance.
     */
    loop(callback: (el: T, stack: DynamicStack<T>) => boolean, iterations?: Integer): DynamicStack<T>;
    /**
     * Creates a new DynamicStack containing elements filtered from the current stack based on a provided condition.
     * Elements are included in the new stack if the specified callback function returns `true` for that element.
     * @param {Function} callback A function that will be executed on each element of the stack.
     * It receives the current element and the stack itself as parameters.
     * The function should return a boolean value:
     * - `true` to include the element in the filtered stack.
     * - `false` to exclude the element from the filtered stack.
     * @returns {DynamicStack<T>} A new DynamicStack containing filtered elements.
     */
    filter(callback: (el: T, stack: DynamicStack<T>) => boolean): DynamicStack<T>;
    /**
     * Clears all elements from the stack, resetting it to an empty state.
     * @returns {DynamicStack<T>} The stack instance after clearing all elements.
     */
    clear(): DynamicStack<T>;
    /**
     * Creates a new DynamicStack instance that is an exact copy of the current stack.
     * @returns {DynamicStack<T>} A new DynamicStack instance containing a copy of the current stack's elements.
     */
    copy(): DynamicStack<T>;
    /**
     * Appends elements to the stack by invoking a callback function to generate each element.
     * @param {Function} callback - A callback function that generates elements based on an index and stack context.
     * @param {Integer} size - The number of elements to append to the stack (default: 0).
     * @returns {DynamicStack<T>} The updated stack after appending elements.
     */
    append(callback: (i: Integer, stack: DynamicStack<T>) => any, size?: Integer): DynamicStack<T>;
    [Symbol.iterator](): Iterator<T | null>;
}
/**
 * Represents a static implementation of the stack data structure.
 * This class uses an array to manage stack elements.
 */
export declare class StaticStack<T = unknown> {
    /**
     * Represents the top of the stack, implemented as a private array.
     * This array stores the elements of the stack with the top element
     * positioned at the end (highest index) of the array.
     * @type {T[]}
     * @private
     */
    private _top;
    /**
     * Pros:
     * - Consistent performance for basic operations like push, pop, and append.
     * - Efficient memory allocation due to fixed size.
     * - Low overhead for small data sets.
     *
     * Cons:
     * - Limited capacity; cannot resize dynamically.
     * - Performance impact with large data sets, especially with pushMany and filter operations.
     * - Less flexibility compared to a dynamically resizing stack.
     *
     * Constructs a new instance of StaticStack.
     * If an initial element `d` is provided, it will be pushed onto the stack.
     * @param {T} d - Optional initial element to push onto the stack.
     * If provided, it will be added to the top of the stack.
     */
    constructor(d?: T);
    /**
     * Retrieves the current number of elements in the stack.
     * @returns {Integer} The number of elements in the stack.
     */
    get size(): Integer;
    /**
     * Checks if the stack is empty.
     * @returns {boolean} True if the stack is empty, otherwise false.
     */
    get isEmpty(): boolean;
    /**
     * Retrieves the top element of the stack without removing it.
     * @returns {T} The top element of the stack.
     */
    get top(): T;
    /**
     * Adds an element to the top of the stack.
     * @param {T} d The element to be pushed onto the stack.
     * @returns {StaticStack<T>} The updated stack after pushing the element.
     */
    push(d: T): this;
    /**
     * Pushes multiple elements onto the stack.
     * @param {T[]} data An array of elements to push onto the stack.
     * @returns {StaticStack<T>} The updated stack after pushing the elements.
     * @throws {Error} Throws an error if the parameter is not an array.
     */
    pushMany(data: T[]): this;
    /**
     * Removes and returns the top element from the stack.
     * @returns {T | null} The element that was removed from the top of the stack.
     */
    pop(): T | null;
    /**
     * Removes multiple elements from the top of the stack and returns them as an array.
     * If the specified number of elements to remove (n) is greater than the current stack size,
     * it will remove all elements from the stack and return them.
     * @param {Integer} n - The number of elements to remove from the stack.
     * @returns {[]} An array containing the removed elements from the top of the stack.
     */
    popMany(n: Integer): T[];
    /**
     * Executes a callback function on each element of the stack without removing them,
     * iterating from the top to the bottom of the stack.
     * @param {(el: T, stack: StaticStack<T>) => void} callback - The callback function to execute on each element.
     * @returns {StaticStack<T>} The current instance of the stack after traversal.
     */
    traverse(callback: (el: T, stack: StaticStack<T>) => void): this;
    /**
     * Removes each element from the stack, executes a callback function on each removed element,
     * and collects the removed elements into an array.
     * @param {(el: any, stack: StaticStack) => void} callback - The callback function to execute on each removed element.
     * @returns {any[]} An array containing the elements that were removed from the stack.
     */
    popAndTraverse(callback: (el: T, stack: StaticStack<T>) => void): T[];
    /**
     * Creates a new StaticStack containing elements that pass the specified filter callback function.
     * @param {(el: T, stack: StaticStack<T>) => boolean} callback - The callback function used to filter elements.
     * @returns {StaticStack<T>} A new StaticStack containing elements that passed the filter.
     */
    filter(callback: (el: T, stack: StaticStack<T>) => boolean): StaticStack<T>;
    /**
     * Retrieves all elements from the StaticStack and resets the stack to an empty state.
     * @returns {T[]} An array containing all elements retrieved from the StaticStack.
     */
    get list(): T[];
    /**
     * Executes a loop over elements in the StaticStack,
     * applying a callback function to each element.
     * The loop stops either when all elements have been
     * processed or when the callback returns false.
     * @param {Function} callback The function to execute
     * on each element. It should accept the element and the stack as arguments and return a boolean.
     * @param {Integer} iterations The maximum number of
     * iterations to execute. If not provided, defaults to the size of the stack.
     * @returns {StaticStack<T>} The updated StaticStack instance after completing the loop.
     */
    loop(callback: (el: T, stack: StaticStack<T>) => boolean, iterations: Integer): this;
    /**
     * Creates a copy of the StaticStack with the same elements.
     * @returns {StaticStack<T>} A new StaticStack instance
     * containing a copy of the elements from the original stack.
     */
    copy(): StaticStack<T>;
    /**
     * Removes all elements from the StaticStack, making it empty.
     * @returns {StaticStack<T>} The StaticStack instance after clearing its elements.
     */
    clear(): this;
    /**
     * Appends elements to the StaticStack based on a callback function.
     * @param {Function} callback - The callback function that generates elements to append.
     * @param {Integer} [size=0] - The number of elements to append.
     * @returns {StaticStack<T>} The StaticStack instance after appending elements.
     */
    append(callback: (index: Integer, stack?: StaticStack<T>) => T, size?: Integer): this;
    [Symbol.iterator](): Iterator<T>;
}
