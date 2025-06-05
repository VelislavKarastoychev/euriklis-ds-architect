# AVLTree<T>

A self-balancing binary search tree. `AVLTree` extends the generic [`BST`](../BST/index.ts) and automatically maintains the balance factor of each node. Insertions and deletions trigger rotations to keep operations logarithmic.

## Usage

```ts
import { AVLTree } from "@euriklis/ds-architect";

const avl = new AVLTree<number>();
avl.insert(5).insert(3).insert(8);

console.log(avl.root); // 5
avl.delete(3);
```

## API Highlights

| Method                               | Description                                                   |
| ------------------------------------ | ------------------------------------------------------------- |
| `insert(data: T, id?: string)`       | Insert a value and rebalance the tree.                        |
| `delete(value: T, cb?)`              | Remove a node by value using an optional comparison callback. |
| `deleteNode(cb)`                     | Delete a node determined by a callback returning -1/0/1.      |
| `copy()`                             | Return a structural clone of the tree.                        |
| `print(node?, level?, prefix?, cb?)` | Pretty print the subtree starting from `node`.                |

---

This file provides a short overview. See the source code for advanced rotation helpers and balance factor utilities.
