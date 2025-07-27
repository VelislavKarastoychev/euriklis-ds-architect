import { describe, it, expect } from "bun:test";
import { AVLTree } from "../dist";

describe("AVLTree", () => {
  it("stores and retrieves elements", () => {
    const t = new AVLTree<number>();
    t.insert(3).insert(2).insert(1);
    const values: number[] = [];
    t.BFS((n) => values.push(n.data as number));
    expect(values.sort()).toEqual([1, 2, 3]);
    expect(t.height()).toBe(2);
  });

  it("balances with mixed insert order", () => {
    const t = new AVLTree<number>();
    t.insert(3).insert(1).insert(2);
    const values: number[] = [];
    t.BFS((n) => values.push(n.data as number));
    expect(values.sort()).toEqual([1, 2, 3]);
    expect(t.height()).toBeLessThanOrEqual(2);
  });
});
