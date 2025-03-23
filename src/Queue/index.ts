"use strict";
import * as errors from "../Errors";
import validator from "@euriklis/validator-ts";
import type { Integer } from "../../Types";
import { LinkedDataNode } from "../DataNode";
// import { Matrix } from "../../Matrix";

/**
 * This class implements a queue data structure using a linked list.
 */
export class Queue {
  public static random(n: Integer, from: number = 0, to: number = 1): Queue {
    return new Queue().enqueueMany(Array.from({ length: n }).map(Math.random));
  }

  private _head: LinkedDataNode | null = null;
  private _top: LinkedDataNode | null = null;
  private _size: Integer = Infinity;
  private _length: Integer = 0;

  /**
   * Creates an instance of Queue.
   * @param {any} [data] - The initial data to enqueue.
   * @param {Integer} [size=Infinity] - The maximum size of the queue.
   */
  constructor(data?: any, size: Integer = Infinity) {
    this.size = size;
    this.enqueue(data);
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
    return this._head === null && this._top === null && this._length === 0;
  }

  get length(): Integer {
    return this._length;
  }

  /**
   * Views the front item without removing it.
   * Time complexity: O(1).
   * @returns {any} The front data.
   */
  get peek(): any {
    return this._head?.data || null;
  }

  /**
   * Views the last item without adding
   * another element.
   * @returns {any} The last element.
   */
  get rear(): any {
    return this._top?.data || null;
  }

  /**
   * @private
   * Enqueues a node into the queue.
   * Time complexity: O(1).
   * @param {LinkedDataNode} node - The node to enqueue.
   */
  private _enqueue(node: LinkedDataNode) {
    if (this._size < this._length + 1) {
      errors.StackOverflow("Queue enqueue")();
    }
    if (!this._top) {
      this._top = node;
      this._head = node;
    } else {
      node.prev = this._top;
      this._top.next = node;
      this._top = node;
    }
    this._length++;
  }

  /**
   * Adds data to the end of the queue.
   * Time complexity: O(1).
   * @param {any} data - The data to enqueue.
   * @returns {Queue} The updated queue.
   */
  enqueue(data: any): Queue {
    if (data) {
      const node = new LinkedDataNode(data);
      this._enqueue(node);
    }

    return this;
  }

  /**
   * Adds multiple items to the queue.
   * Time complexity: O(n), where the "n"  is the
   * length of the length of the "items" parameter.
   * @param {any[]} items - The items to enqueue.
   * @returns {Queue} The updated queue.
   */
  enqueueMany(items: any[]): Queue {
    const n = items.length;
    let i: Integer,
      node: LinkedDataNode | null,
      nm1: Integer = n - 1;
    for (i = n; i-- > 1; ) {
      node = new LinkedDataNode(items[nm1 - i--]);
      this._enqueue(node);
      node = new LinkedDataNode(items[nm1 - i]);
      this._enqueue(node);
    }
    if (i === 0) {
      node = new LinkedDataNode(items[nm1]);
      this._enqueue(node);
    }

    return this;
  }

  /**
   * Removes and returns the first item in the queue.
   * Time complexity: O(1).
   * @returns {any} The dequeued data.
   */
  dequeue(): any {
    let data: any = null;
    if (this.isEmpty) errors.StackUnderflow("Queue dequeue")();
    data = this._head?.data || null;
    this._head = this._head?.next || null;
    if (this._head) this._head.prev = null;
    else this._top = null; // if the head is empty delete the rear.
    this._length--;

    return data;
  }

  /**
   * Removes and returns multiple items from the front of the queue.
   * Time complexity: O(n), where the "n" is the count of the elements
   * which have to be deleted.
   * @param {Integer} [n=1] - The number of items to dequeue.
   * @returns {any[]} The dequeued data items.
   */
  dequeueMany(n: Integer = 1): any[] {
    const items: any[] = [];
    let i: Integer, node: LinkedDataNode | null;
    for (i = n; i-- > 1; ) {
      if (this._head) {
        node = this._head;
        this._head = this._head.next;
        if (this._head) this._head.prev = null;
        else this._top = null;
        items.push(node.data);
        this._length--;
        i--;
      } else errors.StackUnderflow("Queue dequeueMany")();

      if (this._head) {
        node = this._head;
        this._head = this._head.next;
        if (this._head) this._head.prev = null;
        else this._top = null;
        items.push(node.data);
        this._length--;
      } else errors.StackUnderflow("Queue dequeueMany")();
    }

    if (i === 0) {
      if (this._head) {
        node = this._head;
        this._head = this._head.next;
        if (this._head) this._head.prev = null;
        else this._top = null;
        items.push(node.data);
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
   * @returns {Queue} The traversed queue.
   */
  traverse(
    callback: (node: LinkedDataNode, queue: Queue) => void,
    inversed: boolean = false,
  ): Queue {
    let node = inversed ? this._top : this._head;
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
  filter(callback: (node: LinkedDataNode, queue?: Queue) => boolean): Queue {
    const queue = new Queue();
    let node: LinkedDataNode | null = this._head;
    while (node) {
      if (callback(node, this)) {
        queue.enqueue(node.data);
      }
      node = node.next;
    }
    return queue;
  }

  /**
   * Checks if the queue contains a specific element.
   * Time complexity: 0(n), where the "n" is the length of the queue.
   * @param {any} data - The data to search for.
   * @returns {boolean} True if the queue contains the element, false otherwise.
   */
  contains(data: any): boolean {
    let node: LinkedDataNode | null = this._head;
    while (node) {
      const answer = new validator(node.data).isSame(data).answer;
      if (answer) return true;
      else node = node.next;
    }

    return false;
  }

  /**
   * Reverses the order of elements in the queue.
   * @returns {Queue} The reversed queue.
   */
  reverse(): Queue {
    let node: LinkedDataNode | null = this._head,
      temp: LinkedDataNode | null = null;
    this._top = this._head;
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
   * @returns {Queue} The emmpy queue.
   */
  clean(): Queue {
    this._head = null;
    this._top = null;
    this._size = Infinity;
    this._length = 0;

    return this;
  }

  /**
   * Creates a shallow copy of the queue.
   * Time complexity: O(n), where the "n" is the number of the elements of the queue.
   * @returns {Queue} A new queue instance with the same elements as the current queue.
   */
  copy(): Queue {
    const queue: Queue = new Queue();
    let node: LinkedDataNode | null = this._head;
    while (node) {
      const temp: LinkedDataNode = new LinkedDataNode(node.data);
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
   * @param {Queue} queue - The queue to merge into this one.
   * @returns {Queue} The updated queue.
   */
  merge(queue: Queue): Queue {
    if (this.isEmpty) {
      this._head = queue._head;
      this._top = queue._top;
    } else if (queue._head) {
      if (this._top) {
        this._top.next = queue._head;
        queue._head.prev = this._top;
      }
      this._top = queue._top;
    }
    this._length += queue._length;

    return this;
  }

  /**
   * Converts the queue to an array.
   * @returns {any[]} The array representation of the queue.
   */
  toArray(): any[] {
    const values: any[] = [];
    this.traverse((node) => values.push(node.data));

    return values;
  }
}
