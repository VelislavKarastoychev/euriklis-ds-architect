import { describe, it, expect } from "bun:test";
import { BaseNetwork } from "../dist";

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

  it("reports order and size", () => {
    const n = buildNetwork();
    expect(n.order).toBe(4);
    expect(n.size).toBe(4);
    expect(n.weightedOrder).toBe(4);
    expect(n.weightedSize).toBe(4);
  });

  it("clone duplicates the network", () => {
    const n = buildNetwork();
    const c = n.clone();
    expect(c.order).toBe(n.order);
    expect(c.size).toBe(n.size);
    c.addNode({ name: "E", data: 5 });
    expect(n.order).toBe(4);
  });

  it("subgraph filters nodes", () => {
    const n = buildNetwork();
    const sg = n.subgraph({ callback: (node) => node.name !== "C" });
    expect(sg.order).toBe(3);
    expect(sg.getNode("C")).toBeNull();
    expect(sg.size).toBe(2);
  });

  it("union merges networks", () => {
    const n1 = buildNetwork();
    const n2 = new BaseNetwork<number, null>();
    n2.addNode({ name: "E", data: 5 });
    n2.addNode({ name: "F", data: 6 });
    n2.addEdge({ source: "E", target: "F", data: null, params: { weight: 1 } });
    const u = n1.union(n2);
    expect(u.order).toBe(6);
    expect(u.size).toBe(5);
    expect(u.weightedSize).toBe(5);
  });

  it("difference subtracts networks", () => {
    const n1 = buildNetwork();
    const n2 = new BaseNetwork<number, null>();
    n2.addNode({ name: "B", data: 2 });
    const d = n1.difference(n2);
    expect(d.order).toBe(3);
    expect(d.getNode("B")).toBeNull();
    expect(d.size).toBe(1);
  });

  it("kronecker creates tensor product", () => {
    const n1 = new BaseNetwork<number, null>();
    n1.addNode({ name: "A", data: 1 });
    n1.addNode({ name: "B", data: 2 });
    n1.addEdge({ source: "A", target: "B", data: null, params: { weight: 1 } });
    const n2 = new BaseNetwork<number, null>();
    n2.addNode({ name: "X", data: 3 });
    n2.addNode({ name: "Y", data: 4 });
    n2.addEdge({ source: "X", target: "Y", data: null, params: { weight: 1 } });
    const k = n1.kronecker(n2);
    expect(k.order).toBe(4);
    expect(k.size).toBe(1);
    expect(k.weightedSize).toBe(1);
    expect(k.getEdge({ source: "A|X", target: "B|Y" })).not.toBeNull();
  });

  it("detects connectivity", () => {
    const n = buildNetwork();
    expect(n.isConnected()).toBe(true);
    const d = new BaseNetwork<number, null>();
    d.addNode({ name: "A", data: 1 });
    d.addNode({ name: "B", data: 2 });
    expect(d.isConnected()).toBe(false);
  });

  it("checks bipartite property", () => {
    const n = buildNetwork();
    expect(n.biGraph()).toBe(false);
    const b = new BaseNetwork<number, null>();
    b.addNode({ name: "A", data: 1 });
    b.addNode({ name: "B", data: 2 });
    b.addNode({ name: "C", data: 3 });
    b.addNode({ name: "D", data: 4 });
    b.addEdge({ source: "A", target: "C", data: null, params: { weight: 1 } });
    b.addEdge({ source: "B", target: "D", data: null, params: { weight: 1 } });
    expect(b.biGraph()).toBe(true);
  });

  it("finds cycles", () => {
    const n = new BaseNetwork<number, null>();
    n.addNode({ name: "A", data: 1 });
    n.addNode({ name: "B", data: 2 });
    n.addNode({ name: "C", data: 3 });
    n.addEdge({ source: "A", target: "B", data: null, params: { weight: 1 } });
    n.addEdge({ source: "B", target: "C", data: null, params: { weight: 1 } });
    n.addEdge({ source: "C", target: "A", data: null, params: { weight: 1 } });
    const cycles = n.cycles();
    expect(cycles.length).toBeGreaterThan(0);
  });

  it("finds Hamiltonian cycle", () => {
    const h = new BaseNetwork<number, null>();
    h.addNode({ name: "A", data: 1 });
    h.addNode({ name: "B", data: 2 });
    h.addNode({ name: "C", data: 3 });
    h.addNode({ name: "D", data: 4 });
    h.addEdge({ source: "A", target: "B", data: null, params: { weight: 1 } });
    h.addEdge({ source: "B", target: "C", data: null, params: { weight: 1 } });
    h.addEdge({ source: "C", target: "D", data: null, params: { weight: 1 } });
    h.addEdge({ source: "D", target: "A", data: null, params: { weight: 1 } });
    const cycle = h.Hamiltonian();
    expect(cycle).not.toBeNull();
    expect(cycle!.length).toBe(5);
  });

  it("builds nCube networks", () => {
    const cube = BaseNetwork.nCube(2);
    expect(cube.order).toBe(4);
    expect(cube.weightedSize).toBe(8);
  });

  it("computes shortest paths", () => {
    const n = buildNetwork();
    const result = n.shortestPath({ start: "A", end: "D" });
    expect(result).not.toBeNull();
    expect(result!.distance).toBe(2);
    expect(result!.path).toEqual(["A", "B", "D"]);
  });

  it("creates a minimum spanning tree", () => {
    const n = new BaseNetwork<number, null>();
    n.addNode({ name: "A", data: 1 });
    n.addNode({ name: "B", data: 2 });
    n.addNode({ name: "C", data: 3 });
    n.addNode({ name: "D", data: 4 });
    n.addEdge({ source: "A", target: "B", data: null, params: { weight: 1 } });
    n.addEdge({ source: "A", target: "C", data: null, params: { weight: 4 } });
    n.addEdge({ source: "B", target: "C", data: null, params: { weight: 2 } });
    n.addEdge({ source: "B", target: "D", data: null, params: { weight: 1 } });
    n.addEdge({ source: "C", target: "D", data: null, params: { weight: 1 } });

    const mst = n.minimumSpanningTree();
    expect(mst.order).toBe(4);
    expect(mst.size).toBe(3);
    expect(mst.weightedSize).toBe(3);
  });

  it("adjacencyMatrix returns weight grid", () => {
    const n = buildNetwork();
    const m = n.adjacencyMatrix();
    expect(m.length).toBe(n.order);
    expect(m[0].length).toBe(n.order);
    // B -> D has weight 1 at [1][3]
    expect(m[1][3]).toBe(1);
  });

  it("toJSON serializes nodes and edges", () => {
    const n = buildNetwork();
    const json = n.toJSON();
    expect(json.nodes.length).toBe(4);
    expect(json.edges.length).toBe(4);
    expect(json.state).toBeNull();
  });
  it("topologicalOrder returns a valid order", () => {
    const n = buildNetwork();
    const order = n.topologicalOrder();
    expect(order).toEqual(["A", "B", "C", "D"]);
  });

  it("PERT computes earliest finish times", () => {
    const n = new BaseNetwork<number, null>();
    n.addNode({ name: "A", data: 1 });
    n.addNode({ name: "B", data: 2 });
    n.addNode({ name: "C", data: 3 });
    n.addNode({ name: "D", data: 4 });
    n.addEdge({ source: "A", target: "B", data: null, params: { weight: 2 } });
    n.addEdge({ source: "A", target: "C", data: null, params: { weight: 4 } });
    n.addEdge({ source: "B", target: "D", data: null, params: { weight: 3 } });
    n.addEdge({ source: "C", target: "D", data: null, params: { weight: 1 } });
    const m = n.PERT();
    expect(m.get("A")).toBe(0);
    expect(m.get("B")).toBe(2);
    expect(m.get("C")).toBe(4);
    expect(m.get("D")).toBe(5);
  });

  it("CPM finds the critical path", () => {
    const n = new BaseNetwork<number, null>();
    n.addNode({ name: "A", data: 1 });
    n.addNode({ name: "B", data: 2 });
    n.addNode({ name: "C", data: 3 });
    n.addNode({ name: "D", data: 4 });
    n.addEdge({ source: "A", target: "B", data: null, params: { weight: 2 } });
    n.addEdge({ source: "A", target: "C", data: null, params: { weight: 4 } });
    n.addEdge({ source: "B", target: "D", data: null, params: { weight: 3 } });
    n.addEdge({ source: "C", target: "D", data: null, params: { weight: 1 } });
    const res = n.CPM();
    expect(res.duration).toBe(5);
    expect(res.path).toEqual(["A", "B", "D"]);
  });

  it("PRIM creates a minimum spanning tree", () => {
    const n = new BaseNetwork<number, null>();
    ["A", "B", "C", "D"].forEach((name, i) => n.addNode({ name, data: i }));
    const edges: [string, string, number][] = [
      ["A", "B", 1],
      ["B", "A", 1],
      ["A", "C", 4],
      ["C", "A", 4],
      ["B", "C", 2],
      ["C", "B", 2],
      ["B", "D", 1],
      ["D", "B", 1],
      ["C", "D", 1],
      ["D", "C", 1],
    ];
    for (const [s, t, w] of edges) {
      n.addEdge({ source: s, target: t, data: null, params: { weight: w } });
    }
    const tree = n.PRIM({ start: "A" });
    expect(tree.order).toBe(4);
    expect(tree.size).toBe(3);
    expect(tree.weightedSize).toBe(3);
    const tEdges = tree.edges.map((e) => ({
      s: e.source,
      t: e.target,
      w: e.weight,
    }));
    expect(tEdges).toEqual([
      { s: "A", t: "B", w: 1 },
      { s: "B", t: "D", w: 1 },
      { s: "D", t: "C", w: 1 },
    ]);
  });
  it("identifies bridges", () => {
    const n = new BaseNetwork<number, null>();
    ["A", "B", "C", "D", "E"].forEach((name, i) =>
      n.addNode({ name, data: i }),
    );
    n.addEdge({ source: "A", target: "B", data: null, params: { weight: 1 } });
    n.addEdge({ source: "B", target: "C", data: null, params: { weight: 1 } });
    n.addEdge({ source: "C", target: "A", data: null, params: { weight: 1 } });
    n.addEdge({ source: "C", target: "D", data: null, params: { weight: 1 } });
    n.addEdge({ source: "D", target: "E", data: null, params: { weight: 1 } });
    const bridges = n.bridges();
    expect(bridges.length).toBe(2);
    expect(bridges).toContainEqual({
      source: "C",
      target: "D",
      data: null,
      weight: 1,
    });
    expect(bridges).toContainEqual({
      source: "D",
      target: "E",
      data: null,
      weight: 1,
    });
  });

  it("identifies directed bridges", () => {
    const n = new BaseNetwork<number, null>();
    ["A", "B", "C"].forEach((name, i) => n.addNode({ name, data: i }));
    n.addEdge({ source: "A", target: "B", data: null, params: { weight: 1 } });
    n.addEdge({ source: "B", target: "C", data: null, params: { weight: 1 } });
    n.addEdge({ source: "A", target: "C", data: null, params: { weight: 1 } });
    const bridges = n.directedBridges();
    expect(bridges.length).toBe(2);
    expect(bridges).toContainEqual({
      source: "A",
      target: "B",
      data: null,
      weight: 1,
    });
    expect(bridges).toContainEqual({
      source: "B",
      target: "C",
      data: null,
      weight: 1,
    });
  });

  it("adjacencyMatrix accepts a custom callback", () => {
    const n = new BaseNetwork<number, number>();
    n.addNode({ name: "A", data: 1 });
    n.addNode({ name: "B", data: 2 });
    n.addEdge({ source: "A", target: "B", data: 5, params: { weight: 1 } });
    const m = n.adjacencyMatrix((_, data) => data);
    expect(m[0][1]).toBe(5);
  });

  it("uses weightFn property when provided", () => {
    const n = new BaseNetwork<number, number>({
      weightFn: (_, d) => d,
    });
    n.addNode({ name: "A", data: 1 });
    n.addNode({ name: "B", data: 2 });
    n.addEdge({ source: "A", target: "B", data: 7, params: { weight: 1 } });
    const m = n.adjacencyMatrix();
    expect(m[0][1]).toBe(7);
  });

  it("builds ring lattice networks", () => {
    const g = BaseNetwork.ringLattice(5, 1);
    expect(g.order).toBe(5);
    for (const node of g.nodes) {
      expect(g.inDegree(node.name) + g.outDegree(node.name)).toBe(4);
    }
    expect(g.isRingLattice(1)).toBe(true);
  });

  it("builds ER random networks", () => {
    const g = BaseNetwork.erdosRenyi(5, 0.5);
    expect(g.order).toBe(5);
  });

  it("builds Barabasi-Albert networks", () => {
    const g = BaseNetwork.barabasiAlbert(6, 2);
    expect(g.order).toBe(6);
  });
});
