"use strict";

import type { HeapType, Integer } from "../../Types";
import { HeapDataNode } from "../DataNode";
import { ifLengthIsGreaterThanSizeThrow } from "./Decorators";
import * as errors from "../Errors";
import * as models from "./Models";

type T = NonNullable<any>;

export class PrimaryHeap<T extends any> {
  private _heap: T[] = [];
  private _type: HeapType = "max";
  private _size: Integer = Infinity;
  private _compare: (
    a: T,
    b: T,
    i?: Integer,
    j?: Integer,
    heap?: T[],
  ) => 1 | -1 | 0 = (a, b) => (a > b ? 1 : a < b ? -1 : 0);

  /**
   * Creates a PrimaryHeap from an array of items.
   * @param {T[]} items - The items to create the heap from.
   * @param {Integer} [size=Infinity] - The maximum size of the heap.
   * @param {HeapType} [type="max"] - The type of heap, either "max" or "min".
   * @returns {PrimaryHeap<T>} - The newly created PrimaryHeap.
   */
  public static from<T extends any>(
    items: T[],
    size: Integer = Infinity,
    type: HeapType = "max",
  ): PrimaryHeap<T> {
    const n: Integer = items.length;
    const heap = new PrimaryHeap<T>();
    heap.size = size;
    heap.type = type;
    heap._heap = items;
    models.PrimaryShiftDownHeapify(items as any, type);

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
    callback: (a: T, b: T, i?: Integer, j?: Integer, heap?: T[]) => 1 | -1 | 0,
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
   * @param {T} data - The data to add.
   * @returns {PrimaryHeap<T>} - The heap instance.
   * @throws {Error} - If the heap size exceeds the maximum size.
   */
  @ifLengthIsGreaterThanSizeThrow(errors.StackOverflow("PrimaryHeap.add"))
  add(data: any): PrimaryHeap<T> {
    const node = new HeapDataNode(data);
    if (typeof data === "undefined" || data === null) return this;
    this._heap[this._heap.length] = node;
    models.PrimaryShiftUp(this._heap, this.length - 1, this.type);

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
   * Returns an iterator for the heap.
   * @returns {Iterator<T>} - An iterator for the heap.
   */
  [Symbol.iterator](): Iterator<T> {
    const heap = this._heap;
    let i = 0;
    return {
      next(): IteratorResult<T> {
        if (i < heap.length) {
          return { value: heap[i++], done: false };
        }

        return { value: undefined, done: true };
      },
    };
  }
}

export class Heap extends PrimaryHeap<T> {
  /**
   * Constructs a Heap instance.
   * @param {T} [data] - Initial data to add to the heap.
   */
  constructor(data?: any) {
    super(data);
  }
}
