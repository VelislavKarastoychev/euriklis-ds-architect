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
});
