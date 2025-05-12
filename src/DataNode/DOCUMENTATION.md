# DataNode

DataNode<T> is an abstract base class that provides a minimal, uniform API for any node in a data structure. It offers:

- 🎯 Unique identifier (id): automatically generated UUID v4 (or user-provided)

- 📦 Generic payload (data: T): flexible storage of any type

This class underpins more specialized node types—linked-list nodes, tree nodes, heap nodes, and beyond—ensuring consistency and reducing boilerplate.

## Usage

## Extending DataNode

```ts
import { DataNode } from "@euriklis/ds-architect";

/**
 * MyNode<T> adds domain-specific behavior to the base DataNode.
 */
class MyNode<T> extends DataNode<T> {
  // ...add additional properties or methods
}
```

## Creating Instances

```ts
// Node with simple string data
const node1 = new MyNode<string>("hello");

// Node with object data and custom ID
const node2 = new MyNode<{ x: number }>({ x: 42 }, "custom-id-123");

console.log(node1.id); // auto-generated UUID
console.log(node2.id); // "custom-id-123"
console.log(node1.data); // "hello"
console.log(node2.data.x); // 42
```

## Reading & Writing Properties

```ts
// Read the ID and data
const id = node1.id;
const payload = node1.data;

// Update the payload
node1.data = "world";
console.log(node1.data); // "world"

// Override the ID (use with care)
node1.id = "new-id-456";
console.log(node1.id); // "new-id-456"
```

## API Reference

| Member                               | Type                         | Description                                                                                                                       |
| ------------------------------------ | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `constructor(data?: T, id?: string)` | `(d?: T, i?: string) → void` | Creates a node. If `data` has an `id` field and no explicit `id` is passed, that `id` is used; otherwise a new UUID is generated. |
| `get id(): string`                   | `string`                     | Returns the node’s unique identifier (UUID v4 by default).                                                                        |
| `set id(i: string)`                  | `string → void`              | Manually override the node’s `id`.                                                                                                |
| `get data(): T \| null`              | `T \| null`                  | Retrieves the node’s payload.                                                                                                     |
| `set data(d: T \| undefined)`        | `T \| undefined → void`      | Assigns new payload; ignores `undefined` to prevent accidental data loss.                                                         |

## Examples of Derived Nodes

### Linked List Node

```ts
import { LinkedDataNode } from "@euriklis/ds-architect";
// Doubly-linked list node with `next` and `prev` pointers.
const n1 = new LinkedDataNode<number>(1);
const n2 = new LinkedDataNode<number>(2);
n1.next = n2;
n2.prev = n1;
```

### Binary Search Tree Node

```ts
import { BSTDataNode } from "@euriklis/ds-architect";
// BST node with `left`, `right`, and `prev` pointers.
const root = new BSTDataNode<string>("root");
const child = new BSTDataNode<string>("child");
child.prev = root;
root.left = child;
```

### AVL Tree Node

```ts
import { AVLDataNode } from "@euriklis/ds-architect";
// Self-balancing BST node with `balance` factor.
const avlNode = new AVLDataNode<number>(10);
avlNode.balance = 0; // initial balance
```
