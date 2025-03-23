# @euriklis/graphworld

@eurikklis/graphworld is a modular and extensible library that provides a rich ecosystem for graph and network-based data structures. Designed with both academic rigor and practical application in mind, this library offers powerful graph algorithms and network functionalities while also including additional data structure components (like AVL trees, BSTs, queues, and heaps) for broader algorithmic programming.

> **Note:** Some data structures (e.g., AVL, BST, heaps) are under active development and will be refined in future releases.

## Features

- **Graph Structures**

  - Create, update, and remove nodes and edges using a robust, type-safe API.
  - Support for both directed and symmetric (undirected) graphs.
  - Generate adjacency matrices and perform common traversals (BFS, DFS).

- **Network & Extended Functionality**

  - Integrate domain-specific attributes (e.g., `model`, `prompt`, `callback`, `modelOptions`) into graph nodes.
  - Extend basic graph behavior to support network operations such as centrality measures and neural network concepts.
  - Asynchronous traversal methods (e.g., `BFSAsync`, `DFSAsync`) for integrating LLM or other async operations.

- **Additional Data Structures**
  - Along with graphs, GraphWorld includes other fundamental data structures—like queues, heaps, and trees—to support algorithmic programming.
  - Designed to be lightweight: you can import only what you need without the overhead of heavy mathematics libraries.

## Installation

Install via npm:

```bash
npm install @euriklis/graphworld
```

Or via bun:

```sh
bun install @euriklis/graphworld
```

# Usage:
