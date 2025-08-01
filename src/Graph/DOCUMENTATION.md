# Graph library

The Graph library provides a generic `Graph` class with fundamental methods for building and traversing graphs. It allows you to create nodes, connect them with edges, and run common algorithms like BFS and DFS.

## Structure of the Graph library

`Graph` is generic, so you can define the shape of its nodes, edges, and optional state. You may treat the graph as directed or undirected depending on how you add edges.

### Basic usage

```ts
import { Graph } from "@euriklis/ds-architect";

const g = new Graph<string>();

g.addNode({ name: "A", data: "hello" });
g.addNode({ name: "B", data: "world" });

g.addEdge({ source: "A", target: "B", data: null });
console.log(g.inDegree("B")); // 1

// For an undirected edge, add the reverse connection
g.addEdge({ source: "B", target: "A", data: null });
```

### API overview

#### Graph

| Method                                      | Description                                              |
| ------------------------------------------- | -------------------------------------------------------- |
| `addNode({ name, data })`                   | Insert a node with the given name.                       |
| `removeNode(name)`                          | Delete a node and its connections.                       |
| `addEdge({ source, target, data, params })` | Connect two nodes.                                       |
| `removeEdge({ source, target })`            | Remove a connection.                                     |
| `getNode(name)`                             | Return node data.                                        |
| `getNodeInstance(name)`                     | Return the internal node object.                         |
| `getEdge({ source, target })`               | Return edge data.                                        |
| `getEdgeInstance({ source, target })`       | Return the internal edge object.                         |
| `inDegree(name)`                            | Number of incoming edges of a node.                      |
| `outDegree(name)`                           | Number of outgoing edges of a node.                      |
| `BFS(...)` / `BFSAsync(...)`                | Breadth-first traversal over all nodes.                  |
| `BFSNode(...)` / `BFSNodeAsync(...)`        | Breadth-first traversal starting from a node.            |
| `DFS(...)` / `DFSAsync(...)`                | Depth-first traversal over all nodes.                    |
| `DFSNode(...)` / `DFSNodeAsync(...)`        | Depth-first traversal starting from a node.              |
| `subgraph({ callback })`                    | Create a new graph with nodes that satisfy the callback. |
| `union(graph)`                              | Union of two graphs.                                     |
| `difference(graph)`                         | Difference of two graphs.                                |
| `kronecker(graph)`                          | Kronecker (tensor) product of two graphs.                |
| `isConnected()`                             | Check if the graph is connected.                         |
| `cycles()`                                  | Return simple cycles.                                    |
| `Hamiltonian()`                             | Find a Hamiltonian cycle if one exists.                  |
| `biGraph()`                                 | Test if the graph is bipartite.                          |
| `nCube(n)`                                  | Generate an n-dimensional cube graph.                    |
| `[Symbol.iterator]()`                       | Iterate over graph nodes.                                |
| `toJSON()`                                  | Serialize nodes, edges and state.                        |
| `topologicalOrder()`                        | Return nodes in topological order if acyclic.            |
| `bridges()`                                 | Find undirected bridge edges.                            |
| `directedBridges()`                         | Find directed bridge edges.                              |
| `clone()`                                   | Create a deep copy of the graph.                         |
| `upgradeToBaseNetwork()`                    | Convert to a `BaseNetwork` with weights.                 |

#### BaseNetwork

`BaseNetwork` behaves like `Graph` but each node has a numeric `value` and each edge a `weight`. Algorithms use a configurable `weightFn` property to derive numeric weights from edges.

| Method                                      | Description                                        |
| ------------------------------------------- | -------------------------------------------------- |
| `addNode({ name, data, value })`            | Add a weighted node.                               |
| `addEdge({ source, target, data, weight })` | Add a weighted edge.                               |
| `getNode(name)`                             | Return node data along with its value.             |
| `shortestPath({start, end})`                | Dijkstra shortest path between two nodes.          |
| `adjacencyMatrix(weightFn?)`                | Matrix of edge weights (uses `weightFn` callback). |
| `toJSON()`                                  | Serialize weighted graph to JSON.                  |
| `minimumSpanningTree()`                     | Return a minimum spanning tree.                    |
| _all other methods from `Graph`_            |                                                    |

#### StateGraph

`StateGraph` is a minimal graph used to manage stateful workflows. It exposes the same node and edge API as `Graph` but skips traversal algorithms, making it ideal as a building block for agent-like systems (similar to `langGraph`).

```ts
import { StateGraph } from "@euriklis/ds-architect";

const sg = new StateGraph<number, null, { count: number }>();

sg.addNode({ name: "start", data: 0 });
sg.addNode({ name: "end", data: 1 });
sg.addEdge({ source: "start", target: "end", data: null });

sg.state = { count: 0 };
```

```ts
const snapshot = sg.toJSON();
console.log(snapshot.nodes.length); // 2
```

StateGraph methods: `clone`, `upgradeToGraph`, `upgradeToBaseNetwork`, and `toJSON` mirror the behaviour of the Graph equivalents.
