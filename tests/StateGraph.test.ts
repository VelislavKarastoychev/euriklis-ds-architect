"use strict";
import { describe, it, expect } from "bun:test";
import { StateGraph } from "../src";

describe("StateGraph", () => {
  it("toJSON serializes nodes and edges", () => {
    const sg = new StateGraph<number, null>();
    sg.addNode({ name: "A", data: 1 });
    sg.addNode({ name: "B", data: 2 });
    sg.addEdge({ source: "A", target: "B", data: null, params: {} });
    const json = sg.toJSON();
    expect(json.nodes).toEqual([
      { name: "A", data: 1 },
      { name: "B", data: 2 },
    ]);
    expect(json.edges).toEqual([{ source: "A", target: "B", data: null }]);
    expect(json.state).toBeNull();
  });
});
