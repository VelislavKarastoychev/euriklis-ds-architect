"use strict";

import type { HeapType, Integer } from "../../Types";
import { HeapDataNode } from "../DataNode";
import { ifLengthIsGreaterThanSizeThrow } from "./Decorators";
import * as errors from "../Errors";
import * as models from "./Models";

export class PrimaryHeap<T = unknown> {
  private _heap: HeapDataNode<T>[] = [];
  private _type: HeapType = "max";
  private _size: Integer = Infinity;
  private _compare: (
    a: HeapDataNode<T>,
    b: HeapDataNode<T>,
    i?: Integer,
    j?: Integer,
    heap?: HeapDataNode<T>[],
  ) => 1 | -1 | 0 = (a, b) => (a > b ? 1 : a < b ? -1 : 0);

  /**
   * Creates a PrimaryHeap from an array of items.
   * @param {T[]} items - The items to create the heap from.
   * @param {Integer} [size=Infinity] - The maximum size of the heap.
   * @param {HeapType} [type="max"] - The type of heap, either "max" or "min".
   * @returns {PrimaryHeap<T>} - The newly created PrimaryHeap.
   */
  public static from<T = unknown>(
    items: T[],
    size: Integer = Infinity,
    type: HeapType = "max",
  ): PrimaryHeap<T> {
    const heap = new PrimaryHeap<T>();
    heap.size = size;
    heap.type = type;
    heap._heap = items.map(
      (item: T): HeapDataNode<T> => new HeapDataNode<T>(item),
    );
    models.PrimaryShiftDownHeapify(heap._heap as HeapDataNode<T>[], type);

    return heap;
  }

  /**
   * Constructs a PrimaryHeap instance.
   * @param {T} [data] - Initial data to add to the heap.
   */
  constructor(data?: T) {
    this.add(data);
  }

  get compare() {
    return this._compare;
  }

  set compare(
    callback: (
      a: HeapDataNode<T>,
      b: HeapDataNode<T>,
      i?: Integer,
      j?: Integer,
      heap?: HeapDataNode<T>[],
    ) => 1 | -1 | 0,
  ) {
    this._compare = callback;
  }

  /**
   * Gets the length of the heap.
   * @returns {Integer} - The length of the heap.
   */
  get length(): Integer {
    return this._heap.length;
  }

  set length(l) {
    this._heap.length = l;
  }

  /**
   * Gets the maximum size of the heap.
   * @returns {Integer} - The maximum size of the heap.
   */
  get size(): Integer {
    return this._size;
  }

  /**
   * Sets the maximum size of the heap.
   * @param {Integer} s - The new maximum size.
   */
  set size(s: Integer) {
    this._size = s;
  }

  /**
   * Gets the type of the heap.
   * @returns {"max" | "min"} - The type of the heap.
   */
  get type(): "max" | "min" {
    return this._type;
  }

  /**
   * Sets the type of the heap.
   * @param {"max" | "min"} t - The new type.
   */
  set type(t: "max" | "min") {
    this._type = t;
  }

  /**
   * Adds a new element to the heap.
   * @param {T | undefned} data - The data to add.
   * @returns {PrimaryHeap<T>} - The heap instance.
   * @throws {Error} - If the heap size exceeds the maximum size.
   */
  @ifLengthIsGreaterThanSizeThrow(errors.StackOverflow("PrimaryHeap.add"))
  add(data: T | undefined): PrimaryHeap<T> {
    if (typeof data === "undefined" || data === null) return this;
    const node = new HeapDataNode<T>(data);
    this._heap[this._heap.length] = node;
    models.PrimaryShiftUp<T>(this._heap, this.length - 1, this.type);

    return this;
  }

  /**
   * Searches for an element by its id.
   * Complexity - O(n / 2), where the n is the length of the heap.
   * @param {string} id - The id of the element to search for.
   * @returns {HeapDataNode[] | null} - The found elements or null.
   */
  search(id: string): HeapDataNode[] | null {
    return models.PrimaryHeapSearch(this._heap, id, this.type);
  }

  /**
   * Removes an element from the heap by id.
   * Complexity: O(n) due to heapify after removal.
   * @param {string} id - The id of the element to remove.
   * @returns {T | null} - The removed element data or null if not found.
   */
  remove(id: string): T | null {
    const index = this._heap.findIndex((n) => n.id === id);
    if (index === -1) return null;
    const [node] = this._heap.splice(index, 1);
    models.PrimaryShiftDownHeapify(this._heap, this.type);
    return node.data as T;
  }

  /**
   * Merges another heap into this one.
   * @param {PrimaryHeap<T>} heap - The heap to merge with.
   * @returns {PrimaryHeap<T>} The merged heap.
   */
  merge(heap: PrimaryHeap<T>): PrimaryHeap<T> {
    if (heap._heap.length) {
      this._heap = this._heap.concat(heap._heap);
      if (this._heap.length > this.size) this.size = this._heap.length;
      models.PrimaryShiftDownHeapify(this._heap, this.type);
    }
    return this;
  }

  /**
   * Convert heap contents to an array of data values.
   * @returns {T[]} - The array of values in heap order.
   */
  toArray(): T[] {
    return this._heap.map((n: HeapDataNode<T>): T => n.data as T);
  }

  /**
   * Returns an iterator for the heap.
   * @returns {Iterator<T>} - An iterator for the heap.
   */
  [Symbol.iterator](): Iterator<T> {
    const heap = this._heap;
    let i = 0;
    return {
      next(): IteratorResult<T> {
        if (i < heap.length) {
          return { value: heap[i++].data as T, done: false };
        }

        return { value: undefined, done: true };
      },
    };
  }
}

export class Heap<T> extends PrimaryHeap<T> {
  /**
   * Constructs a Heap instance.
   * @param {T} [data] - Initial data to add to the heap.
   */
  constructor(data?: T) {
    super(data);
  }
}
