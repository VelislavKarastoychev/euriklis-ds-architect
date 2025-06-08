import { describe, it, expect } from "bun:test";
import { Graph } from "../src";

const buildGraph = () => {
  const g = new Graph<number>();
  g.addNode({ name: "A", data: 1 });
  g.addNode({ name: "B", data: 2 });
  g.addNode({ name: "C", data: 3 });
  g.addNode({ name: "D", data: 4 });
  g.addEdge({ source: "A", target: "B", data: null, params: {} });
  g.addEdge({ source: "B", target: "C", data: null, params: {} });
  g.addEdge({ source: "C", target: "D", data: null, params: {} });
  g.addEdge({ source: "B", target: "D", data: null, params: {} });
  return g;
};

describe("Graph", () => {
  it("supports basic node and edge operations", () => {
    const g = new Graph<number>();
    g.addNode({ name: "A", data: 1 });
    g.addNode({ name: "B", data: 2 });
    g.addEdge({ source: "A", target: "B", data: null, params: {} });
    expect(g.getNode("A")?.data).toBe(1);
    expect(g.getEdge({ source: "A", target: "B" })).not.toBeNull();
    g.removeEdge({ source: "A", target: "B" });
    expect(g.getEdge({ source: "A", target: "B" })).toBeNull();
    g.removeNode("B");
    expect(g.getNode("B")).toBeNull();
  });

  it("computes in and out degrees", () => {
    const g = buildGraph();
    expect(g.inDegree("D")).toBe(2);
    expect(g.outDegree("B")).toBe(2);
  });

  it("BFSNode traverses correctly", () => {
    const g = buildGraph();
    const visited: string[] = [];
    g.BFSNode({ startingNode: "A", callback: (n) => visited.push(n!.name) });
    expect(visited).toEqual(["A", "B", "C", "D"]);
  });

  it("BFSNodeAsync traverses correctly", async () => {
    const g = buildGraph();
    const visited: string[] = [];
    await g.BFSNodeAsync({
      startingNode: "A",
      callback: async (n) => {
        visited.push(n!.name);
      },
    });
    expect(visited).toEqual(["A", "B", "C", "D"]);
  });

  it("BFS traverses entire graph", () => {
    const g = buildGraph();
    const visited: string[] = [];
    g.BFS({ callback: (n) => visited.push(n!.name) });
    expect(visited).toEqual(["A", "B", "C", "D"]);
  });

  it("BFSAsync traverses entire graph", async () => {
    const g = buildGraph();
    const visited: string[] = [];
    await g.BFSAsync({ callback: async (n) => visited.push(n.name) });
    expect(visited).toEqual(["A", "B", "C", "D"]);
  });

  it("DFSNode traverses correctly", () => {
    const g = buildGraph();
    const visited: string[] = [];
    g.DFSNode({ startingNode: "A", callback: (n) => visited.push(n.name) });
    expect(visited).toEqual(["A", "B", "D", "C"]);
  });

  it("DFSNodeAsync traverses correctly", async () => {
    const g = buildGraph();
    const visited: string[] = [];
    await g.DFSNodeAsync({
      startingNode: "A",
      callback: async (n) => {
        visited.push(n.name);
      },
    });
    expect(visited).toEqual(["A", "B", "D", "C"]);
  });

  it("DFS traverses entire graph", () => {
    const g = buildGraph();
    const visited: string[] = [];
    g.DFS({ callback: (n) => visited.push(n.name) });
    expect(visited).toEqual(["A", "B", "D", "C"]);
  });

  it("DFSAsync traverses entire graph", async () => {
    const g = buildGraph();
    const visited: string[] = [];
    await g.DFSAsync({ callback: async (n) => visited.push(n.name) });
    expect(visited).toEqual(["A", "B", "D", "C"]);
  });
});
