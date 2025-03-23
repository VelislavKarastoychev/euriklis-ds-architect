"use strict";

import type { Integer, SecureStoreType } from "../../Types";
import { IsSame } from "../../utils";
import { AVLTree } from "../AVL";
import { LinkedDataNode } from "../DataNode";
import * as errors from "../Errors";
import * as models from "./Models";

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
export class DoublyLinkedList {
  private _size: Integer = Infinity;
  private _head: LinkedDataNode | null = null;
  private _top: LinkedDataNode | null = null;
  private _currentSize = 0;
  private _secureStore: SecureStoreType = null;
  private _map: null | Map<string, LinkedDataNode> | AVLTree = null;

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
  public static random(options: {
    length: Integer;
    from?: Integer;
    to?: Integer;
    seed?: Integer;
    callback?: (d: any, id?: string, list?: DoublyLinkedList) => any;
    mapType?: SecureStoreType;
  }): DoublyLinkedList {
    const {
      length,
      from = 0,
      to = 1,
      seed = 123456,
      callback,
      mapType = "Map",
    } = options;
    const l = new DoublyLinkedList();
    l.mapType = mapType;
    models.FillDLLWithRandomNumbers(l, length, from, to, seed, callback);

    return l;
  }

  /**
   * Creates an instance of DoublyLinkedList.
   * @param {any} [data] - The initial data to add to the list.
   * @param {Integer} [size=Infinity] - The maximum size of the list.
   */
  constructor(data?: any, size: Integer = Infinity) {
    this.size = size;
    this.addLast(data);
  }

  /**
   * Gets the maximum size of the list.
   * @returns {Integer}
   */
  get size(): Integer {
    return this._size;
  }

  get mapType() {
    return this._secureStore;
  }

  set mapType(type: SecureStoreType) {
    this._secureStore = type;
    this._map = models.GenerateMap(this.mapType);
  }

  /**
   * Sets the maximum size of the list.
   * @type {Integer}
   */
  set size(s: Integer) {
    this._size = s;
  }

  /**
   * Gets the data of the head node.
   * @returns {any}
   */
  get head(): any {
    return this._head?.data || null;
  }

  /**
   * Gets the data of the top (last) node.
   * @returns {any}
   */
  get top(): any {
    return this._top?.data || null;
  }

  /**
   * Gets the current length of the list.
   * @returns {Integer}
   */
  get length(): Integer {
    return this._currentSize;
  }

  /**
   * Checks if the list is empty.
   * @returns {boolean}
   */
  get isEmpty(): boolean {
    return this.length === 0 && this._head === this._top && this._head === null;
  }

  /**
   * Adds a node with the given data to the end of the list.
   * @param {any} data - The data to add.
   * @param{string} id? - The id property of the data node.
   * @returns {DoublyLinkedList} The updated list.
   */
  addLast(data: any, id?: string): DoublyLinkedList {
    if (data) {
      if (this._size < this._currentSize + 1) {
        errors.StackOverflow("DoublyLinkedList addLast")();
      }
      const node: LinkedDataNode = new LinkedDataNode(data);
      if (id) node.id = id;
      if (this._head) {
        (this._top as LinkedDataNode).next = node;
        node.prev = this._top;
      } else this._head = node;

      this._top = node;
      this._currentSize++;
      models.MapInsertion(node, this._map);
    }

    return this;
  }

  /**
   * Removes the last node from the list.
   * @returns {any} The data of the removed node.
   */
  removeLast(): DoublyLinkedList {
    if (!this._head) {
      errors.StackUnderflow("DoublyLinkedList removeLast")();
    }
    const data = this.top;
    models.MapDeletion(this._top?.id as string, this._map);
    if (this._head === this._top) {
      this._head = null;
      this._top = null;
    } else {
      this._top = (this._top as LinkedDataNode).prev;
      (this._top as LinkedDataNode).next = null;
    }
    this._currentSize--;

    return data;
  }

  /**
   * Removes the first node from the list.
   * @returns {any} The data of the removed node.
   */
  removeFirst(): any {
    if (!this._head) {
      errors.StackUnderflow("DoublyLinkedList removeFirst")();
    }

    const data = (this._head as LinkedDataNode)?.data;
    models.MapDeletion(this._head?.id as string, this._map);
    if (this._head === this._top) {
      this._head = null;
      this._top = null;
    } else {
      this._head = (this._head as LinkedDataNode)?.next;
      (this._head as LinkedDataNode).prev = null;
    }
    this._currentSize--;

    return data;
  }

  /**
   * Removes a node by its ID.
   * @param {string} id - The ID of the node to remove.
   * @returns {any} The data of the removed node.
   */
  remove(id: string): any {
    const node: LinkedDataNode | null = this._findNodeById(id);
    if (node) {
      models.MapDeletion(node.id, this._map);
      if ((this._head as LinkedDataNode).id === id) {
        this.removeFirst();
      } else if ((this._top as LinkedDataNode).id === id) {
        this.removeLast();
      } else {
        ((node as LinkedDataNode).next as LinkedDataNode).prev = node.prev;
        ((node as LinkedDataNode).prev as LinkedDataNode).next =
          (node as LinkedDataNode).next;
      }

      node.prev = null;
      node.next = null;
      this._currentSize--;

      return node.data;
    }
  }

  /**
   * Inserts a node with the given data after the node with the specified ID.
   * @param {string} id - The ID of the node to insert after.
   * @param {any} data - The data to insert.
   * @param {string} dataId? - the "id" property of the new node.
   * @returns {DoublyLinkedList} The updated list.
   */
  insertAfter(id: string, data: any, dataId?: string): DoublyLinkedList {
    const node = this._findNodeById(id);
    const newNode: LinkedDataNode | null = new LinkedDataNode(data);
    if (dataId) newNode.id = dataId;
    if (node) {
      if (this._size < this._currentSize + 1) {
        errors.StackOverflow("DoublyLinkedList insertAfter")();
      }
      newNode.prev = node;
      newNode.next = node.next;
      if (node === this._top) {
        this._top = newNode;
      } else {
        (node.next as LinkedDataNode).prev = newNode;
      }

      node.next = newNode;
      models.MapInsertion(newNode, this._map);
      this._currentSize++;
    }

    return this;
  }

  /**
   * Inserts a node with the given data before the node with the specified ID.
   * @param {string} id - The ID of the node to insert before.
   * @param {any} data - The data to insert.
   * @param{string} dataId? - The id property of the data node which will be created.
   * @returns {DoublyLinkedList} The updated list.
   */
  insertBefore(id: string, data: any, dataId?: string): DoublyLinkedList {
    const node: LinkedDataNode | null = this._findNodeById(id);
    const newNode = new LinkedDataNode(data);
    if (dataId) newNode.id = dataId;
    if (node) {
      if (this._size < this._currentSize + 1) {
        errors.StackOverflow("DoublyLinkedList insertBefore")();
      }
      newNode.prev = node.prev;
      newNode.next = node;

      if (node === this._head) {
        this._head = newNode;
      } else {
        (node.prev as LinkedDataNode).next = newNode;
      }

      node.prev = newNode;
      models.MapInsertion(newNode, this._map);
      this._currentSize++;
    }

    return this;
  }

  /**
   * Returns a map of all node values, keyed by their IDs.
   * @returns {Map<string, any>} The map of node values.
   */
  values(): Map<string, any> {
    const values = new Map();
    this.traverse((data, id) => values.set(id, data));

    return values;
  }

  /**
   * Checks if a node with the specified ID exists in the list.
   * @param {string} id - The ID to check for.
   * @returns {boolean} True if the node exists, otherwise false.
   */
  has(id: string): boolean {
    return this._findNodeById(id) !== null;
  }

  /**
   * Traverses the list, applying the given callback to each node.
   * @param {function} callback - The function to apply to each node.
   * @param {boolean} [inversed=false] - Whether to traverse in reverse order.
   * @returns {DoublyLinkedList} The traversed list.
   */
  traverse(
    callback: (d: any, id?: string, list?: DoublyLinkedList) => any,
    inversed: boolean = false,
  ): DoublyLinkedList {
    const pointer: LinkedDataNode | null = inversed ? this._top : this._head;
    models.DLLTraverse(callback, pointer, this, inversed);

    return this;
  }

  loop(
    callback: (d: any, id: string, list?: DoublyLinkedList) => boolean,
    inversed: boolean = true,
  ): DoublyLinkedList {
    const pointer = inversed ? this._top : this._head;
    models.DLLLoop(callback, pointer, this, inversed);

    return this;
  }

  /**
   * Filters the list, returning a new list with nodes that match the given callback.
   * @param {function} callback - The function to apply to each node.
   * @param {boolean} [inversed=false] - Whether to traverse in reverse order.
   * @returns {DoublyLinkedList} The filtered list.
   */
  filter(
    callback: (d: any, id?: string, list?: DoublyLinkedList) => boolean,
    inversed: boolean = false,
  ): DoublyLinkedList {
    const list = new DoublyLinkedList(),
      pointer: LinkedDataNode | null = inversed ? this._top : this._head;
    models.FilterDLL(pointer, callback, this, list, inversed);

    return list;
  }

  /**
   * Creates a copy of the list.
   * @param {boolean} [inversed=false] - Whether to traverse in reverse order.
   * @returns {DoublyLinkedList} The copied list.
   */
  copy(inversed: boolean = false): DoublyLinkedList {
    const DLL = new DoublyLinkedList();
    DLL.size = this.size;
    DLL._secureStore = this._secureStore;
    this.traverse((data, id) => {
      const node = new LinkedDataNode(data);
      node.id = id as string;
      DLL.addLast(node.data);
    }, inversed);

    return DLL;
  }

  /**
   * Checks if every node in the list satisfies the given callback.
   * @param {function} callback - The function to apply to each node.
   * @returns {boolean} True if all nodes satisfy the callback, otherwise false.
   */
  every(
    callback: (d: any, id?: string, list?: DoublyLinkedList) => boolean,
  ): boolean {
    let answer: boolean = false;
    this.loop((d, id, list) => (answer = callback(d, id, list), answer));

    return answer;
  }

  /**
   * Checks if any node in the list satisfies the given callback.
   * @param {function} callback - The function to apply to each node.
   * @returns {boolean} True if any node satisfies the callback, otherwise false.
   */
  any(
    callback: (d: any, id?: string, list?: DoublyLinkedList) => boolean,
  ): boolean {
    let answer: boolean = false;
    this.loop((data, id, list) => (answer = callback(data, id, list), !answer));

    return answer;
  }

  /**
   * Clears the list.
   * @returns {DoublyLinkedList} The cleared list.
   */
  clean(): DoublyLinkedList {
    this._size = Infinity;
    this._currentSize = 0;
    this._head = null;
    this._top = null;
    this._secureStore = "Map";
    this._map = new Map();

    return this;
  }

  /**
   * Merges another doubly linked list into this list.
   * @param {DoublyLinkedList} list - The list to merge.
   * @returns {DoublyLinkedList} The merged list.
   */
  merge(list: DoublyLinkedList): DoublyLinkedList {
    if (!list.isEmpty) {
      this._size = this._size + list._size;
      if (this.isEmpty) {
        this._head = list._head;
        this._top = list._top;
      } else {
        const top: LinkedDataNode = this._top as LinkedDataNode;
        top.next = list._head;
        (top.next as LinkedDataNode).prev = this._top;
        this._top = list._top;
      }
      this._currentSize += list._currentSize;
    }

    return this;
  }

  /**
   * Returns an iterator for the DoublyLinkedList,
   * allowing it to be used in for-of loops and
   * other iterable contexts. The iterator
   * traverses the list from head to tail.
   *
   * @returns {Iterator<any>} An iterator that
   * yields the data of each node in the DoublyLinkedList.
   */
  [Symbol.iterator](): Iterator<any> {
    let pointer = this._head;
    return {
      next(): IteratorResult<any> {
        if (pointer) {
          const value = pointer.data;
          pointer = pointer.next;
          return { value, done: false };
        }
        return { value: undefined, done: true };
      },
    };
  }

  /**
   * Checks if two doubly linekd lists contains
   * the same data.
   *
   * @param{DoublyLinkedList} list - the list
   * used for the comparison.
   * @returns {boolean} "True" if the data of list
   * and the current DoublyLinkedList instance
   * are the same and false otherwise.
   */
  isSame(list: DoublyLinkedList): boolean {
    let p1 = this._head;
    let p2 = list._head;

    if (this.length !== list.length) return false;

    return models.IsDLLSame(p1, p2);
  }
  /**
   * Checks if two doubly linekd lists contains
   * the same data and IDs.
   *
   * @param{DoublyLinkedList} list - the list
   * used for the comparison.
   * @returns {boolean} "True" if the data and the IDs 
   * of list and the current DoublyLinkedList instance
   * are the same as well as the mapType and false otherwise.
   */

  isExactlySame(list: DoublyLinkedList): boolean {
    let p1 = this._head;
    let p2 = list._head;


    if (this.length !== list.length) return false;
    if (this._secureStore !== list._secureStore) return false;
    
    return models.IsDLLExactlySame(p1, p2);
  }

  /**
   * Finds a node by its ID.
   * @private
   * @param {string} id - The ID of the node to find.
   * @returns {LinkedDataNode | null} The found node or null if not found.
   */
  private _findNodeById(id: string): LinkedDataNode | null {
    let node: LinkedDataNode | null = null;
    if (this._map) {
      node = models.FindNodeFromMap(id, this._map);
    } else node = models.FindNodeFromDLL(id, this._head);
    return node;
  }
}
