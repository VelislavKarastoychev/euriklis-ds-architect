# BST<T>

A generic binary search tree implemented with linked nodes. Supports insertion, search and deletion operations along with traversal helpers.

## Usage

```ts
import { BST } from "@euriklis/ds-architect";

const bst = new BST<number>();
bst.insert(10).insertMany([5, 15]);

console.log(bst.min()); // 5
```

## Common Methods

| Method                         | Description                                         |
| ------------------------------ | --------------------------------------------------- |
| `insert(data: T, id?: string)` | Add a value (or node ID) to the tree.               |
| `insertMany(data: T[])`        | Bulk insert values.                                 |
| `delete(value: T, cb?)`        | Remove a node matching `value`.                     |
| `deleteNode(cb)`               | Delete a node located via a callback.               |
| `binarySearch(value, cb?)`     | Retrieve a value using optional comparison.         |
| `BFS(cb)`                      | Breadth-first traversal calling `cb` for each node. |
| `DFS(cb)`                      | Depth-first traversal using a stack.                |
| `[Symbol.iterator]()`          | Iterate values breadth-first.                       |

The BST class is extended by [`AVLTree`](../AVL/DOCUMENTATION.md) for self-balancing behaviour.
