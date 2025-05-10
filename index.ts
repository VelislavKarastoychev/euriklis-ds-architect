"use strict";
import type { Vertex } from "./src/DataNode/Models";
import { Graph } from "./src/Graph";

type PersonalType = {
  type: "Student" | "Profesor";
  age: number;
  address?: string;
};
type BuildingType = { type: "School" | "University"; address: string };

const g = new Graph<PersonalType | BuildingType, unknown, { absents: number }>({
  state: { absents: 123 },
});

g.addNode({
  name: "John",
  data: { type: "Student", age: 22, address: "St. Lucia 22" },
});

g.addNode({
  name: "Washington university of Economics",
  data: { type: "University", address: "St. George 22" },
});

const n = g.getNode("John") as Vertex<PersonalType>;
if (n) {
  const data = n.data?.type;
  if (data === "Student") console.log("Hello!!!");
}

console.log(g.nodes);
console.log(g.state);
