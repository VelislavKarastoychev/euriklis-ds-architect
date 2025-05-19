# Queue

A **Queue<T>** is a First-In, First-Out (FIFO) collection implemented via a doubly-linked list of `LinkedDataNode<T>`. Each `enqueue` adds to the tail in O(1) time, and each `dequeue` removes from the head in O(1) time :contentReference[oaicite:0]{index=0} :contentReference[oaicite:1]{index=1}. This linked-list approach avoids the shifting cost of array-based queues and supports an optional fixed capacity to detect overflow :contentReference[oaicite:2]{index=2}.

---

## Import

```ts
import { Queue } from "@euriklis/ds-architect";
```

## Usage:

```ts
// Create an empty queue of numbers
const q = new Queue<number>();

// Enqueue single items
q.enqueue(1).enqueue(2);

// Enqueue many at once
q.enqueueMany([3, 4, 5]);

console.log(q.length); // 5
console.log(q.peek, q.rear); // 1, 5

// Dequeue items
console.log(q.dequeue()); // 1
console.log(q.dequeueMany(2)); // [2, 3]

// create a queue from random numbers:

const randQueue = Quaue.random(20);
// get the queue as an array:
const rand = [...randQueue];
```

### Enqueue & Dequeue

```ts
const q = new Queue<string>("first", 5);
q.enqueue("second").enqueueMany(["third", "fourth"]);

console.log(q.peek); // "first"
console.log(q.rear); // "fourth"

console.log(q.dequeue()); // "first"
console.log(q.dequeueMany(2)); // ["second", "third"]
```

### Traversal

```ts
const q = Queue.random(200, -1, 1);
q.traverse((node, queue) => {
  console.log(node.data);
});
// outputs each element without altering the queue.
```

### Filtering

```ts
const evens = q.filter(
  (node) => typeof node.data === "number" && node.data % 2 === 0,
);
console.log(evens.toArray()); // only even values
```

### Merging Queues

```ts
// complexity O(1)
const a = new Queue<number>().enqueueMany([1, 2, 3]);
const b = new Queue<number>().enqueueMany([4, 5]);
a.merge(b);
console.log(a.toArray()); // [1,2,3,4,5]
```

## API Reference:

| Method                                                                                   | Description                                                                                               |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `new Queue<T>(initial?: T, size?: number)`                                               | Constructs a queue, optionally seeded with initial, and with maximum capacity size (infinite by default). |
| `static random(n: number, from?: number, to?: number): Queue<number>`                    | Creates a new Queue<number> of length n filled with random values in [from, to).                          |
| `get size(): number`                                                                     | Maximum capacity of the queue.                                                                            |
| `set size(s: number)`                                                                    | Set maximum capacity (throws on overflow if enqueued beyond this).                                        |
| `get length(): number`                                                                   | Current number of elements enqueued.                                                                      |
| `get isEmpty(): boolean`                                                                 | true if the queue has no elements, false otherwise.                                                       |
| `get peek(): T \| null`                                                                  | Views the front element without removing it; null if empty.                                               |
| `get rear(): T \| null`                                                                  | Views the last element without removing it; null if empty.                                                |
| `enqueue(data: T): this`                                                                 | Adds a single element to the tail; throws on overflow.                                                    |
| `enqueueMany(items: T[]): this`                                                          | Adds multiple elements in FIFO order.                                                                     |
| `dequeue(): T \| null`                                                                   | Removes and returns the front element; throws on underflow.                                               |
| `dequeueMany(n?: number): T[]`                                                           | Removes up to n elements from the front and return them as an array.                                      |
| `traverse(fn: (node: LinkedDataNode<T>, q: Queue<T>) => void, inversed?: boolean): this` | Visits each node in FIFO (or LIFO if inversed=true) order without removal.                                |
| `filter(fn: (node: LinkedDataNode<T>, q?: Queue<T>) => boolean): Queue<T>`               | Returns a new Queue<T> containing only nodes for which fn returns true.                                   |
| `contains(data: T): boolean`                                                             | Returns true if any enqueued element strictly equals data.                                                |
| `reverse(): this`                                                                        | In-place reverse of the queue’s order.                                                                    |
| `clean(): this`                                                                          | Clears all elements, resetting length to zero and capacity to infinite.                                   |
| `copy(): Queue<T>`                                                                       | Returns a shallow copy (nodes cloned, original intact).                                                   |
| `merge(other: Queue<T>): this`                                                           | Appends all nodes from other in O(1) time (concatenate lists).                                            |
| `toArray(): T[]`                                                                         | Creates a non-destructive array snapshot of the queue’s elements in front→rear order.                     |
| `[Symbol.iterator](): Iterator<T>`                                                       | Iterate from front→rear using for…of queue syntax.                                                        |

## Performance Characteristics

- ### Time Complexity
  - `enqueue, dequeue, peek, rear, merge`: O(1)
  - Bulk operations (`enqueueMany, dequeueMany, filter, traverse, copy, toArray`): O(n)
- ### Space complexity:
  - Uses O(n) memory for n enqueued elements, plus O(n) for operations returning new collections.

## Best Practices

- **Capacity Management**: Set ```size```` to prevent unbounded growth in memory-constrained environments.
- **Error Handling**: Wrap `enqueue`/`dequeue` calls in try/catch if you rely on overflow/underflow detection.
- **Iteration**: Prefer `for…of` queue over manual pointer walks; iterator yields only `T` values.
- **Deep Comparison**: For complex objects, use a user-provided predicate in `filter` or `contains`, rather than strict `===`.
