import { describe, it, expect } from "bun:test";
import { Edge, Vertex } from "../src/DataNode/Models";

describe("GraphDataEdge", () => {
  it("allows assigning a custom id after creation", () => {
    const source = new Vertex({ name: "source", data: null });
    const target = new Vertex({ name: "target", data: null });
    const edge = new Edge({ source, target, data: null });
    const customId = "custom-id";
    edge.id = customId;
    expect(edge.id).toBe(customId);
  });
});
