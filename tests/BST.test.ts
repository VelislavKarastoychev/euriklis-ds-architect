import { describe, it, expect } from "bun:test";
import { BST } from "../src";

describe("BST", () => {
  it("supports insert and traversal", () => {
    const t = new BST<number>();
    t.insertMany([2, 1, 3]);
    const bfs: number[] = [];
    t.BFS((n) => bfs.push(n.data as number));
    const dfs: number[] = [];
    t.DFS((n) => dfs.push(n.data as number));
    expect(bfs.sort()).toEqual([1, 2, 3]);
    expect(dfs.sort()).toEqual([1, 2, 3]);
  });

  it("deletes nodes by id", () => {
    const t = new BST<number>();
    t.insertMany([2, 1, 3], ["2", "1", "3"]);
    const ids: string[] = [];
    const d: number[] = [];
    t.BFS((n) => {
      ids.push(n.id);
      d.push(n.data as number);
    });
    t.delete(ids[2]);
    const arr: number[] = [];
    t.BFS((n) => arr.push(n.data as number));
    expect(arr.sort()).toEqual([1, 2]);
  });

  it("respects unique property", () => {
    const t = new BST<{ id: number; extra?: number }>();
    t.unique = true;
    t.insert({ id: 1 });
    t.insert({ id: 1, extra: 2 });
    expect(t.size).toBe(1);
    const node = t.binarySearchNode((n) =>
      n.data?.id === 1 ? 0 : (n?.data?.id as any) > 1 ? -1 : 1,
    );
    expect((node as any).data.extra).toBe(2);
  });
});
