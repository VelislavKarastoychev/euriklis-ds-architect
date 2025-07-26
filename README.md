`@euriklis/ds-architect` is a modular and extensible library that provides a rich ecosystem for graph and network-based data structures. Designed with both academic rigor and practical application in mind, this library offers powerful graph algorithms and network functionalities while also including additional data structure components (like AVL trees, BSTs, queues, and heaps) for broader algorithmic programming.

## Features

- **Graph Structures**

  - Create, update, and remove nodes and edges using a robust, type-safe API.
  - Support for both directed and symmetric (undirected) graphs.
  - Generate adjacency matrices and perform common traversals (BFS, DFS).

- Create subgraphs and compute unions, differences, or Kronecker products of graphs.

- Check connectivity, find cycles, detect Hamiltonian cycles, and test bipartiteness.
- Generate n-dimensional cube graphs.

- **BaseNetwork & Extended Functionality**

  - Integrate domain-specific attributes (e.g., `model`, `prompt`, `callback`, `modelOptions`) into graph nodes.
  - Extend basic graph behavior to support network operations such as centrality measures and neural network concepts.
  - Asynchronous traversal methods (e.g., `BFSAsync`, `DFSAsync`) for integrating LLM or other async operations.

- Compute shortest paths and minimum spanning trees.

- **Additional Data Structures**
- Along with graphs, `ds-architect` includes other fundamental data structures—like queues, heaps, and trees—to support algorithmic programming.
- Designed to be lightweight: you can import only what you need without the overhead of heavy mathematics libraries.

## Installation

Install via npm:

```bash
npm install @euriklis/ds-architect
```

Or via bun:

```sh
bun install @euriklis/ds-architect
```

# Documentation

- [DataNode](https://github.com/VelislavKarastoychev/euriklis-ds-architect/blob/main/src/DataNode/DOCUMENTATION.md)
- [DoublyLinkedList](https://github.com/VelislavKarastoychev/euriklis-ds-architect/blob/main/src/DoublyLinkedList/DOCUMENTATION.md)
- [Queue](https://github.com/VelislavKarastoychev/euriklis-ds-architect/blob/main/src/Queue/DOCUMENTATION.md)
- [Stack](https://github.com/VelislavKarastoychev/euriklis-ds-architect/blob/main/src/Stack/DOCUMENTATION.md)
- [BST](https://github.com/VelislavKarastoychev/euriklis-ds-architect/blob/main/src/BST/DOCUMENTATION.md)
- [AVLTree](https://github.com/VelislavKarastoychev/euriklis-ds-architect/blob/main/src/AVL/DOCUMENTATION.md)
- [Heap](https://github.com/VelislavKarastoychev/euriklis-ds-architect/blob/main/src/Heap/DOCUMENTATION.md)
- [Graph & BaseNetwork](https://github.com/VelislavKarastoychev/euriklis-ds-architect/blob/main/src/Graph/DOCUMENTATION.md)

## Sub-library overview

Below is a brief summary of the main modules shipped with this package. Each
class has additional examples and details in its corresponding documentation
file linked above.

### DataNode

- `DataNode<T>` – Base class for all nodes. Provides `id` and `data` getters
  and setters along with a constructor that accepts optional data and id.

### DoublyLinkedList

- `DoublyLinkedList<T>` – A bidirectional list with optional size limit.
  Common methods include `addLast`, `removeFirst`, `removeLast`,
  `insertBefore`, `insertAfter`, `filter`, `traverse`, `merge`, and the
  iterable protocol.

### Queue

- `Queue<T>` – FIFO queue built on a linked list. Supports `enqueue`,
  `enqueueMany`, `dequeue`, `dequeueMany`, `traverse`, `filter`, `merge`, and
  `[Symbol.iterator]` for iteration.

### Stack

- `DynamicStack<T>` – Resizable LIFO stack with `push`, `pushMany`, `pop`,
  `popMany`, `filter`, `traverse`, and `copy` helpers.
- `StaticStack<T>` – Array-backed variant with similar API for fixed-size use
  cases.

### BST

- `BST<T>` – Binary search tree providing `insert`, `insertMany`, `delete`,
  `deleteNode`, `binarySearch`, `BFS`, `DFS`, and iteration support.

### AVLTree

- `AVLTree<T>` – Self-balancing tree that extends `BST` and rebalances on
  `insert` or `delete`. Includes `copy` and `print` utilities.

### Heap

- `Heap<T>` and `PrimaryHeap<T>` – Binary heap implementations. Key methods
  are `add`, `search`, `remove`, `merge`, `searchIndex`, and static `from` to
  build a heap from an array.

### Graph and networks

- `Graph<T>` – Generic graph structure with `addNode`, `removeNode`,
  `addEdge`, `removeEdge`, data lookups, degree helpers, BFS/DFS traversals
  (sync or async), and utilities like `subgraph`, `union`, `difference`,
  `kronecker`, `isConnected`, `cycles`, `Hamiltonian`, `biGraph`, and `nCube`.
- `BaseNetwork` – Extends `Graph` so nodes hold numeric values and edges carry
  weights.
- `StateGraph` – Lightweight graph focused on node/edge management without
  traversal algorithms.

# Usage:

Here is a quick look at how to work with the library.

## Basic Graph

```ts
import { Graph } from "@euriklis/ds-architect";

const g = new Graph<string>();
g.addNode({ name: "A", data: "hello" });
g.addNode({ name: "B", data: "world" });

g.addEdge({ source: "A", target: "B", data: null, params: {} });
console.log(g.inDegree("B")); // 1
```

## Building Your Own Structures

The `DataNode` class is the foundation for nodes used by the other data
structures. You can extend it to craft custom nodes for your own
structures and algorithms.

```ts
import { DataNode } from "@euriklis/ds-architect";

class MyNode<T> extends DataNode<T> {
  // add extra properties or behavior here
}

const node = new MyNode({ foo: 42 });
console.log(node.id); // auto-generated UUID
```

Create arrays, lists, or tree-like structures from these nodes to design
tailored data structures for your application.
