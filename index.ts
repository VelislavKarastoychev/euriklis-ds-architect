"use strict";

import { Graph } from "./src";

const g = new Graph();
g.addNode({
  name: "v0",
  data: { type: "Numeric" },
  value: Math.PI,
});
console.log(g);
