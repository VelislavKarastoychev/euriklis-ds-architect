import { describe, it, expect } from "bun:test";
import { Heap } from "../src";

describe("Heap", () => {
  it("allows inserting falsy values", () => {
    const h = new Heap<number>();
    h.add(0).add(false as unknown as number);
    expect((h as any)._heap.length).toBe(2);
  });

  it("throws when capacity exceeded", () => {
    const h = new Heap<number>();
    h.size = 1;
    h.add(1);
    expect(() => h.add(2)).toThrow();
  });

  it("search finds nodes by id", () => {
    const h = new Heap<number>();
    h.add(5);
    const id = (h as any)._heap[0].id;
    const result = h.search(id);
    expect(result && result[0].id).toBe(id);
  });

  it("maintains max-heap property and iteration works", () => {
    const values = [3, 1, 4, 2, 5];
    const h = Heap.from(values);
    const arr = (h as any)._heap;
    for (let i = 0; i < arr.length; i++) {
      const left = (i << 1) + 1;
      const right = left + 1;
      if (left < arr.length) expect(arr[i].id >= arr[left].id).toBe(true);
      if (right < arr.length) expect(arr[i].id >= arr[right].id).toBe(true);
    }
    expect([...h]).toEqual(h.toArray());
  });
});
