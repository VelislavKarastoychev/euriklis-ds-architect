# Heap<T>

A binary heap built on a dynamic array. The base `PrimaryHeap` provides the core logic and supports max/min ordering. `Heap` simply extends it for convenience.

## Example

```ts
import { Heap } from "@euriklis/ds-architect";

const h = new Heap<number>();
h.add(4).add(2).add(8);
for (const v of h) console.log(v);
```

## API Highlights

| Method                             | Description                                      |
| ---------------------------------- | ------------------------------------------------ |
| `static from(items, size?, type?)` | Builds a heap from an array.                     |
| `add(data)`                        | Pushes a new element, maintaining heap property. |
| `search(id)`                       | Returns nodes matching an id (O(n/2)).           |
| `remove(id)`                       | Deletes element by id and re-heapify.            |
| `merge(other)`                     | Combines two heaps into one.                     |
| searchIndex(id)`                   | Return index for an id (O(n/2)).                 |
| `[Symbol.iterator]()`              | Iterates over heap elements.                     |

Additional helpers for shift-up/down are available in the `Models` subfolder.
