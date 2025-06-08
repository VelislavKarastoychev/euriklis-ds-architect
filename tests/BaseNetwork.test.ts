import { describe, it, expect } from "bun:test";
import { BaseNetwork } from "../src";

const buildNetwork = () => {
  const n = new BaseNetwork<number, null>({});
  n.addNode({ name: "A", data: 1 });
  n.addNode({ name: "B", data: 2 });
  n.addNode({ name: "C", data: 3 });
  n.addNode({ name: "D", data: 4 });
  n.addEdge({ source: "A", target: "B", data: null, params: { weight: 1 } });
  n.addEdge({ source: "B", target: "C", data: null, params: { weight: 1 } });
  n.addEdge({ source: "C", target: "D", data: null, params: { weight: 1 } });
  n.addEdge({ source: "B", target: "D", data: null, params: { weight: 1 } });
  return n;
};

describe("BaseNetwork", () => {
  it("BFS traverses correctly", () => {
    const n = buildNetwork();
    const visited: string[] = [];
    n.BFS({ callback: (node) => visited.push(node!.name) });
    expect(visited).toEqual(["A", "B", "C", "D"]);
  });

  it("DFS traverses correctly", () => {
    const n = buildNetwork();
    const visited: string[] = [];
    n.DFS({ callback: (node) => visited.push(node.name) });
    expect(visited).toEqual(["A", "B", "D", "C"]);
  });
});
