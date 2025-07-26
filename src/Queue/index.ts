"use strict";
import * as errors from "../Errors";
import validator from "@euriklis/validator-ts";
import type { Integer } from "../../Types";
import { LinkedDataNode } from "../DataNode";

/**
 * This class implements a queue data structure
 * using a linked list.
 */
export class Queue<T = unknown> {
  public static random(
    n: Integer,
    from: number = 0,
    to: number = 1,
  ): Queue<number> {
    return new Queue<number>().enqueueMany(
      Array.from({ length: n }).map(
        (_: unknown): number => from + Math.random() * (to - from),
      ),
    );
  }

  private _head: LinkedDataNode<T> | null = null;
  private _tail: LinkedDataNode<T> | null = null;
  private _size: Integer = Infinity;
  private _length: Integer = 0;

  /**
   * Creates an instance of Queue.
   * @param {T} [data] - The initial data to enqueue.
   * @param {Integer} [size=Infinity] - The maximum size of the queue.
   */
  constructor(data?: T, size: Integer = Infinity) {
    this.size = size;
    if (data) this.enqueue(data);
  }

  /**
   * Gets the maximum size of the queue.
   * @returns {Integer}
   */
  get size(): Integer {
    return this._size;
  }

  /**
   * Sets the maximum size of the queue.
   * @param {Integer} s - the maximum size.
   */
  set size(s: Integer) {
    this._size = s;
  }

  /**
   * Checks if the queue is empty.
   * @returns {boolean}
   */
  get isEmpty(): boolean {
    return this._head === null && this._tail === null && this._length === 0;
  }

  get length(): Integer {
    return this._length;
  }

  /**
   * Views the front item without removing it.
   * Time complexity: O(1).
   * @returns {T | null} The front data.
   */
  get peek(): T | null {
    return this._head?.data || null;
  }

  /**
   * Views the last item without adding
   * another element.
   * @returns {T | null} The last element.
   */
  get rear(): T | null {
    return this._tail?.data || null;
  }

  /**
   * @private
   * Enqueues a node into the queue.
   * Time complexity: O(1).
   * @param {LinkedDataNode<T>} node - The node to enqueue.
   */
  private _enqueue(node: LinkedDataNode<T>): void {
    if (this._size < this._length + 1) {
      errors.StackOverflow("Queue enqueue")();
    }
    if (!this._tail) {
      this._tail = node;
      this._head = node;
    } else {
      node.prev = this._tail;
      this._tail.next = node;
      this._tail = node;
    }
    this._length++;
  }

  /**
   * Adds data to the end of the queue.
   * Time complexity: O(1).
   * @param {T} data - The data to enqueue.
   * @returns {Queue<T>} The updated queue.
   */
  enqueue(data: T): Queue<T> {
    if (data) {
      const node = new LinkedDataNode<T>(data);
      this._enqueue(node);
    }

    return this;
  }

  /**
   * Adds multiple items to the queue.
   * Time complexity: O(n), where n is the length of the "items" parameter.
   * @param {T[]} items - The items to enqueue.
   * @returns {Queue<T>} The updated queue.
   */
  enqueueMany(items: T[]): Queue<T> {
    const n = items.length;
    let i: Integer,
      node: LinkedDataNode | null,
      nm1: Integer = n - 1;
    for (i = n; i-- > 1; ) {
      node = new LinkedDataNode<T>(items[nm1 - i--]);
      this._enqueue(node as LinkedDataNode<T>);
      node = new LinkedDataNode<T>(items[nm1 - i]);
      this._enqueue(node as LinkedDataNode<T>);
    }
    if (i === 0) {
      node = new LinkedDataNode<T>(items[nm1]);
      this._enqueue(node as LinkedDataNode<T>);
    }

    return this;
  }

  /**
   * Removes and returns the first item in the queue.
   * Time complexity: O(1).
   * @returns {T | null} The dequeued data.
   */
  dequeue(): T | null {
    if (this.isEmpty) errors.StackUnderflow("Queue dequeue")();
    const data: T | null = this._head?.data || null;
    this._head = this._head?.next || null;
    if (this._head) this._head.prev = null;
    else this._tail = null; // if the head is empty delete the rear.
    this._length--;

    return data;
  }

  /**
   * Removes and returns multiple items from the front of the queue.
   * Time complexity: O(n), where the "n" is the count of the elements
   * which have to be deleted.
   * @param {Integer} [n=1] - The number of items to dequeue.
   * @returns {T[]} The dequeued data items.
   */
  dequeueMany(n: Integer = 1): T[] {
    const items: T[] = [];
    let i: Integer, node: LinkedDataNode<T> | null;
    for (i = n; i-- > 1; ) {
      if (this._head) {
        node = this._head;
        this._head = this._head.next;
        if (this._head) this._head.prev = null;
        else this._tail = null;
        items.push(node.data as T);
        this._length--;
        i--;
      } else errors.StackUnderflow("Queue dequeueMany")();

      if (this._head) {
        node = this._head;
        this._head = this._head.next;
        if (this._head) this._head.prev = null;
        else this._tail = null;
        items.push(node.data as T);
        this._length--;
      } else errors.StackUnderflow("Queue dequeueMany")();
    }

    if (i === 0) {
      if (this._head) {
        node = this._head;
        this._head = this._head.next;
        if (this._head) this._head.prev = null;
        else this._tail = null;
        items.push(node.data as T);
        this._length--;
      } else errors.StackUnderflow("Queue dequeueMany")();
    }

    return items;
  }

  /**
   * Traverses the queue, applying the given callback to each node.
   * Time complexity: O(n), where the "n" is the length of the queue.
   * @param {function} callback - The function to apply to each node.
   * @param {boolean} [inversed=false] - Whether to traverse in reverse order.
   * @returns {Queue<T>} The traversed queue.
   */
  traverse(
    callback: (node: LinkedDataNode<T>, queue: Queue<T>) => void,
    inversed: boolean = false,
  ): Queue<T> {
    let node = inversed ? this._tail : this._head;
    while (node) {
      callback(node, this);
      node = inversed ? node.prev : node.next;
    }

    return this;
  }

  /**
   * Filters the queue, returning a new queue with nodes that match the given callback.
   * Time complexity: O(n), where the "n" is the length of the queue.
   * @param {function} callback - The function to apply to each node.
   * @returns {Queue} The filtered queue.
   */
  filter(
    callback: (node: LinkedDataNode<T>, queue?: Queue<T>) => boolean,
  ): Queue<T> {
    const queue = new Queue<T>();
    let node: LinkedDataNode<T> | null = this._head;
    while (node) {
      if (callback(node, this)) {
        queue.enqueue(node.data as T);
      }
      node = node.next;
    }
    return queue;
  }

  /**
   * Checks if the queue contains a specific element.
   * Time complexity: 0(n), where the "n" is the length of the queue.
   * @param {T} data - The data to search for.
   * @returns {boolean} True if the queue contains the element, false otherwise.
   */
  contains(data: T): boolean {
    let node: LinkedDataNode<T> | null = this._head;
    while (node) {
      const answer = new validator(node.data).isSame(data).answer;
      if (answer) return true;
      else node = node.next;
    }

    return false;
  }

  /**
   * Reverses the order of elements in the queue.
   * @returns {Queue<T>} The reversed queue.
   */
  reverse(): Queue<T> {
    let node: LinkedDataNode<T> | null = this._head,
      temp: LinkedDataNode<T> | null = null;
    this._tail = this._head;
    while (node) {
      temp = node.prev;
      node.prev = node.next;
      node.next = temp;
      node = node.prev;
    }

    if (temp) {
      this._head = temp.prev;
    }

    return this;
  }

  /**
   * Clears the queue.
   * @returns {Queue<T>} The emmpy queue.
   */
  clean(): Queue<T> {
    this._head = null;
    this._tail = null;
    this._size = Infinity;
    this._length = 0;

    return this;
  }

  /**
   * Creates a shallow copy of the queue.
   * Time complexity: O(n), where the "n" is the number of the elements of the queue.
   * @returns {Queue<T>} A new queue instance with the same elements as the current queue.
   */
  copy(): Queue<T> {
    const queue = new Queue<T>();
    let node: LinkedDataNode<T> | null = this._head;
    while (node) {
      const temp: LinkedDataNode<T> = new LinkedDataNode<T>(node.data as T);
      temp.id = node.id;
      queue._enqueue(temp);
      node = node.next;
    }

    queue.size = this.size;

    return queue;
  }

  /**
   * Merges another queue into this queue.
   * Complexity: O(1).
   * @param {Queue<T>} queue - The queue to merge into this one.
   * @returns {Queue<T>} The updated queue.
   */
  merge(queue: Queue<T>): Queue<T> {
    if (this.isEmpty) {
      this._head = queue._head;
      this._tail = queue._tail;
    } else if (queue._head) {
      if (this._tail) {
        this._tail.next = queue._head;
        queue._head.prev = this._tail;
      }
      this._tail = queue._tail;
    }
    this._length += queue._length;

    return this;
  }

  /**
   * Converts the queue to an array.
   * @returns {T[]} The array representation of the queue.
   */
  toArray(): T[] {
    const values: T[] = [];
    this.traverse((node: LinkedDataNode<T>): number =>
      values.push(node.data as T),
    );

    return values;
  }

  [Symbol.iterator](): Iterator<T | null> {
    let pointer = this._head;
    return {
      next(): IteratorResult<T | null> {
        if (pointer) {
          const value = pointer.data;
          pointer = pointer.next;
          return { value, done: false };
        }
        return { value: undefined, done: true };
      },
    };
  }
}
