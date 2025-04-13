"use strict";

import { Graph } from "./src";

const g = new Graph();
g.addNode({
  name: "v0",
  data: { type: "Numeric" },
  value: Math.PI,
});

g.addNode({
  name: "v1",
  data: { type: "String" },
  value: Math.E,
});

g.addEdge({
  source: "v0",
  target: "v1",
  data: "This is an edge",
  weight: Math.random(),
});

console.log("Nodes");
console.log(g.nodes);
console.log("Edges");
console.log(g.edges);
