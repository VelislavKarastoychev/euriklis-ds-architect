# DoublyLinkedList\<T\>

A `doubly linked list` implementation in `TypeScript` that supports:

- Optional maximum `size` (**overflow protected**).

- Two backing “secure stores” for O(1) lookups: either a `Map` or an `AVLTree`.

- Full suite of list operations: `add`/`remove` at both ends, `insert` at arbitrary position, `remove-by-id`.

- Rich traversal methods (`traverse`, `loop`, `filter`, `every`, `any`).

- Batch operations: `values()`, `copy()`, `merge()`.

- Iterable protocol (`for…of`).

## Import

```ts
import { DoublyLinkedList } from "@euriklis/ds-architect";
```

## Usage:

```ts
// Create an empty list of numbers
const list = new DoublyLinkedList<number>();

// Add elements to the end
list.addLast(10);
list.addLast(20, "node-20"); // you can optionally supply your own ID

// Inspect head/top/length
console.log(list.head); // → 10
console.log(list.top); // → 20
console.log(list.length); // → 2

// Remove elements
list.removeFirst(); // → 10
list.removeLast(); // → 20
```

### Secure‐Store Option

By default, the list uses a **Map** internally to enable O(1) ID lookups. To switch to an `AVLTree` instead:

```ts
// Use AVLTree for under-the-hood storage
const list = new DoublyLinkedList<string>();
list.mapType = "AVL"; // now uses AVLTree to track IDs

list.addLast("a", "id-a");
list.addLast("b", "id-b");

// remove by ID in O(log n)
list.remove("id-a"); // → "a"
```

### Iterable protocol

```ts
const list = DoublyLinkedList.random({
  length: 10,
  from: -1,
  to: 1,
  seed: 123456,
});
for (const value of list) console.log(value);
const values = [...list];
```

Under the hood, this iterates from head → tail.

### Insertion & Removal

```ts
const dll = new DoublyLinkedList<string>();
dll.addLast("A").addLast("B", "id-B").addLast("C");

dll.insertBefore("id-B", "X"); // A → X → B → C
dll.insertAfter("id-B", "Y"); // A → X → B → Y → C

console.log(dll.values()); // Map { "<auto-id>"→"A", "id-B"→"B", … }
```

result:

```sh
Map(5) {
  "3a21e2a0-01e1-43e1-a6ef-9367828acd92": "A",
  "f2346948-f792-4543-83a3-e3132f3819f6": "X",
  "id-B": "B",
  "2e7830b2-591e-43d0-ab5e-8a78127a4807": "Y",
  "43e62c62-9bfa-4862-956a-716e8f7ea152": "C",
}
```

### Filtering:

```ts
const numbers = new DoublyLinkedList<number>();
[1, 2, 3, 4, 5].forEach(
  (n: number): DoublyLinkedList<number> => numbers.addLast(n),
);

const evens = numbers.filter((n) => n % 2 === 0);
console.log([...evens]); // → [2,4]
```

### Early Exit Loop

```ts
const stopsAt3 = new DoublyLinkedList<number>();
[1, 2, 3, 4, 5].forEach(
  (n: number): DoublyLinkedList<number> => stopsAt3.addLast(n),
);

stopsAt3.loop(
  (v: number | null, _: string, list?: DoublyLinkedList<number>): boolean => {
    console.log(v);
    return v !== 3; // returns false when v===3 to break
  },
  true, // start from the tail to the head (when inversed is set to true)!
);
```

## API Reference:

### Constructors

- `new DoublyLinkedList<T>(initialData?: T, maxSize: Integer = Infinity)`
  - `initialData`: optional first element
  - `maxSize`: upper bound on number of nodes (throws on overflow).
- `static random(options)`: Create a list pre - filled with random number values.

| Method                                                     | Description                                                                                                                                                                             |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `addLast(data: T, id?: string): this`                      | Adds a new node to the end. Optionally specify its `id`.                                                                                                                                |
| `removeFirst(): T \| null`                                 | Removes and returns the first element of the list. Throws on underflow.                                                                                                                 |
| `removeLast(): T \| null`                                  | Removes and returns the last element. Throws on underflow.                                                                                                                              |
| `remove(id: string): T \| null`                            | Removes the node with the given `id`. Returns its data or `null` if not found.                                                                                                          |
| `insertAfter(id: string, data: T, dataId?: string): this`  | Inserts a new node after the node with `id`.                                                                                                                                            |
| `insertBefore(id: string, data: T, dataId?: string): this` | Inserts a new node before the node with `id`.                                                                                                                                           |
| `values(): Map<string,T>`                                  | Returns a Map of all `{ id → data }`.                                                                                                                                                   |
| `has(id: string): boolean`                                 | Checks existence of a node by `id`.                                                                                                                                                     |
| `copy(inversed = false): DoublyLinkedList<T>`              | Returns a shallow clone of this list (preserving IDs and order).                                                                                                                        |
| `merge(other: DoublyLinkedList<T>): this`                  | Append all nodes of `other` to the end of this list.                                                                                                                                    |
| `traverse(cb, inversed = false): this`                     | Visit every node in order (or reverse if `inversed=true`).                                                                                                                              |
| `loop(cb, inversed = false): this`                         | Like `traverse` but stops early when `cb` returns `false`.                                                                                                                              |
| `filter(cb, inversed = false): this`                       | Build a new list of those nodes for which `cb` returns `true`.                                                                                                                          |
| `every(cb): boolean`                                       | Are all nodes passing cb?                                                                                                                                                               |
| `any(cb): boolean`                                         | Does any node pass cb?                                                                                                                                                                  |
| `[Symbol.iterator](): Iterator<T>`                         | Under the hood, this iterates from head → tail.                                                                                                                                         |
| `clean(): this`                                            | Cleans the elements in the doubly linked list.                                                                                                                                          |
| `isSame(list: DoublyLinkedList<T>): boolean`               | Returns `true` if the elements of the current doubly linked list are equivalent to the `list`                                                                                           |
| `isExactlySame(list: DoublyLinkedList<T>): boolean`        | Returns `true` if all the elements of the current doubly linked list instance are equal to the `list` doubly linked list as well as the ID's of the nodes and the mapType of the lists. |
