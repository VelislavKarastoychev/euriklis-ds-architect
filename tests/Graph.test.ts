import { describe, it, expect } from "bun:test";
import { Graph } from "../dist";

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

  it("reports order and size correctly", () => {
    const g = buildGraph();
    expect(g.order).toBe(4);
    expect(g.size).toBe(4);
  });

  it("clone creates an identical copy", () => {
    const g = buildGraph();
    const c = g.clone();
    expect(c.order).toBe(g.order);
    expect(c.size).toBe(g.size);
    c.addNode({ name: "E", data: 5 });
    expect(g.order).toBe(4);
  });

  it("upgradeToBaseNetwork copies nodes and edges", () => {
    const g = buildGraph();
    const n = g.upgradeToBaseNetwork();
    expect(n.order).toBe(g.order);
    expect(n.size).toBe(g.size);
    expect(n.weightedOrder).toBe(g.order);
    expect(n.weightedSize).toBe(g.size);
  });

  it("subgraph filters nodes", () => {
    const g = buildGraph();
    const sg = g.subgraph({ callback: (n) => n.name !== "C" });
    expect(sg.order).toBe(3);
    expect(sg.getNode("C")).toBeNull();
    expect(sg.size).toBe(2); // edges A->B and B->D remain
  });

  it("union merges two graphs", () => {
    const g1 = buildGraph();
    const g2 = new Graph<number>();
    g2.addNode({ name: "E", data: 5 });
    g2.addNode({ name: "F", data: 6 });
    g2.addEdge({ source: "E", target: "F", data: null, params: {} });
    const u = g1.union(g2);
    expect(u.order).toBe(6);
    expect(u.size).toBe(5);
  });

  it("difference subtracts nodes and edges", () => {
    const g1 = buildGraph();
    const g2 = new Graph<number>();
    g2.addNode({ name: "B", data: 2 });
    const d = g1.difference(g2);
    expect(d.order).toBe(3);
    expect(d.getNode("B")).toBeNull();
    expect(d.size).toBe(1); // only C->D should remain
  });

  it("kronecker creates tensor product", () => {
    const g1 = new Graph<number>();
    g1.addNode({ name: "A", data: 1 });
    g1.addNode({ name: "B", data: 2 });
    g1.addEdge({ source: "A", target: "B", data: null, params: {} });
    const g2 = new Graph<number>();
    g2.addNode({ name: "X", data: 3 });
    g2.addNode({ name: "Y", data: 4 });
    g2.addEdge({ source: "X", target: "Y", data: null, params: {} });
    const k = g1.kronecker(g2);
    expect(k.order).toBe(4);
    expect(k.size).toBe(1);
    expect(k.getNode("A|X")).not.toBeNull();
    expect(k.getEdge({ source: "A|X", target: "B|Y" })).not.toBeNull();
  });

  it("detects connectivity", () => {
    const g = buildGraph();
    expect(g.isConnected()).toBe(true);
    const h = new Graph<number>();
    h.addNode({ name: "A", data: 1 });
    h.addNode({ name: "B", data: 2 });
    expect(h.isConnected()).toBe(false);
  });

  it("checks bipartite graphs", () => {
    const g = buildGraph();
    expect(g.biGraph()).toBe(false);
    const b = new Graph<number>();
    b.addNode({ name: "A", data: 1 });
    b.addNode({ name: "B", data: 2 });
    b.addNode({ name: "C", data: 3 });
    b.addNode({ name: "D", data: 4 });
    b.addEdge({ source: "A", target: "C", data: null, params: {} });
    b.addEdge({ source: "B", target: "D", data: null, params: {} });
    expect(b.biGraph()).toBe(true);
  });

  it("finds cycles", () => {
    const g = new Graph<number>();
    g.addNode({ name: "A", data: 1 });
    g.addNode({ name: "B", data: 2 });
    g.addNode({ name: "C", data: 3 });
    g.addEdge({ source: "A", target: "B", data: null, params: {} });
    g.addEdge({ source: "B", target: "C", data: null, params: {} });
    g.addEdge({ source: "C", target: "A", data: null, params: {} });
    const cycles = g.cycles();
    expect(cycles.length).toBeGreaterThan(0);
  });

  it("finds Hamiltonian cycle", () => {
    const g = new Graph<number>();
    g.addNode({ name: "A", data: 1 });
    g.addNode({ name: "B", data: 2 });
    g.addNode({ name: "C", data: 3 });
    g.addNode({ name: "D", data: 4 });
    g.addEdge({ source: "A", target: "B", data: null, params: {} });
    g.addEdge({ source: "B", target: "C", data: null, params: {} });
    g.addEdge({ source: "C", target: "D", data: null, params: {} });
    g.addEdge({ source: "D", target: "A", data: null, params: {} });
    const cycle = g.Hamiltonian();
    expect(cycle).not.toBeNull();
    expect(cycle!.length).toBe(5);
  });

  it("builds nCube graphs", () => {
    const cube = Graph.nCube(2);
    expect(cube.order).toBe(4);
  });

  it("toJSON serializes nodes and edges", () => {
    const g = buildGraph();
    const json = g.toJSON();
    expect(json.nodes.length).toBe(4);
    expect(json.edges.length).toBe(4);
    expect(json.state).toBeNull();
  });

  it("identifies bridges", () => {
    const g = new Graph<number>();
    ["A", "B", "C", "D", "E"].forEach((name, i) =>
      g.addNode({ name, data: i }),
    );
    g.addEdge({ source: "A", target: "B", data: null, params: {} });
    g.addEdge({ source: "B", target: "C", data: null, params: {} });
    g.addEdge({ source: "C", target: "A", data: null, params: {} });
    g.addEdge({ source: "C", target: "D", data: null, params: {} });
    g.addEdge({ source: "D", target: "E", data: null, params: {} });
    const bridges = g.bridges();
    expect(bridges.length).toBe(2);
    expect(bridges).toContainEqual({ source: "C", target: "D", data: null });
    expect(bridges).toContainEqual({ source: "D", target: "E", data: null });
  });

  it("identifies directed bridges", () => {
    const g = new Graph<number>();
    ["A", "B", "C"].forEach((name, i) => g.addNode({ name, data: i }));
    g.addEdge({ source: "A", target: "B", data: null, params: {} });
    g.addEdge({ source: "B", target: "C", data: null, params: {} });
    g.addEdge({ source: "A", target: "C", data: null, params: {} });
    const bridges = g.directedBridges();
    expect(bridges.length).toBe(2);
    expect(bridges).toContainEqual({ source: "A", target: "B", data: null });
    expect(bridges).toContainEqual({ source: "B", target: "C", data: null });
  });
});
