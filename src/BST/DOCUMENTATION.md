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

| Method                               | Description                                          |
| ------------------------------------ | ---------------------------------------------------- |
| `insert(data: T, id?: string)`       | Add a value (or node ID) to the tree.                |
| `insertMany(data: T[])`              | Bulk insert values.                                  |
| `delete(value: T, cb?)`              | Remove a node matching `value`.                      |
| `deleteNode(cb)`                     | Delete a node located via a callback.                |
| `binarySearch(value, cb?)`           | Retrieve a value using optional comparison.          |
| `BFS(cb)`                            | Breadth-first traversal calling `cb` for each node.  |
| `DFS(cb)`                            | Depth-first traversal using a stack.                 |
| `[Symbol.iterator]()`                | Iterate values breadth-first.                        |
| `loop(cb)`                           | Traverse nodes until `cb` returns `false`.           |
| `filter(cb)`                         | Create a new BST containing nodes that pass `cb`.    |
| `min(node?)`                         | Smallest value starting from `node` (default root).  |
| `minNode(node?)`                     | Node containing the minimum value from `node`.       |
| `max(node?)`                         | Largest value starting from `node`.                  |
| `maxNode(node?)`                     | Node containing the maximum value from `node`.       |
| `predecessor(node?)`                 | Value preceding `node` in sorted order.              |
| `predecessorNode(node?)`             | Node preceding `node` in sorted order.               |
| `successor(node?)`                   | Value following `node` in sorted order.              |
| `successorNode(node?)`               | Node following `node` in sorted order.               |
| `height(node?)`                      | Height of the subtree rooted at `node`.              |
| `clean()`                            | Remove all nodes and reset callbacks.                |
| `copy()`                             | Deep copy of the entire tree.                        |
| `toArray(mode?)`                     | Convert tree to an array via BFS or DFS.             |
| `print(node?, level?, prefix?, cb?)` | Pretty-print the tree structure.                     |
| `isSame(tree)`                       | Compare structure and values with another tree.      |
| `isExactlySame(tree)`                | Compare structure, values and IDs with another tree. |
| `has(id)`                            | Check if a node with `id` exists.                    |

The BST class is extended by [`AVLTree`](../AVL/DOCUMENTATION.md) for self-balancing behaviour.
