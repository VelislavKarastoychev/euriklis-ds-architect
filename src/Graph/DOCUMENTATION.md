# Graph and Network

`Graph` is a lightweight directed graph structure supporting named nodes and edges. `BaseNetwork` extends `Graph` with weighted nodes and edges for modelling complex systems.

Current implementation focuses on CRUD operations. Traversal algorithms (BFS/DFS) and metrics (centralities, small-world index, etc.) are planned in future releases.

## Basic Example

```ts
import { Graph } from "@euriklis/ds-architect";

const g = new Graph<string>();
g.addNode({ name: "A", data: "hello" });
g.addNode({ name: "B", data: "world" });

g.addEdge({ source: "A", target: "B", data: null, params: {} });
console.log(g.inDegree("B")); // 1
```

## Key Methods

| Method                                 | Description                              |
| -------------------------------------- | ---------------------------------------- |
| `addNode({name,data})`                 | Insert a node by name.                   |
| `removeNode(name)`                     | Delete a node and its connections.       |
| `addEdge({source,target,data,params})` | Connect two nodes.                       |
| `removeEdge({source,target})`          | Remove the connection between two nodes. |
| `getNode(name)`                        | Retrieve node data.                      |
| `getEdge({source,target})`             | Retrieve edge data.                      |
| `inDegree(name)`/`outDegree(name)`     | Count incoming or outgoing edges.        |

`BaseNetwork` exposes the same API but expects additional `value` and `weight` fields on nodes and edges.
