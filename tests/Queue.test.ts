import { describe, it, expect } from "bun:test";
import { Queue } from "../src";

describe("Queue", () => {
  it("maintains FIFO order", () => {
    const q = new Queue<number>();
    q.enqueue(1).enqueue(2).enqueue(3);
    expect(q.length).toBe(3);
    expect(q.peek).toBe(1);
    expect(q.rear).toBe(3);
    expect(q.dequeue()).toBe(1);
    expect(q.dequeue()).toBe(2);
    expect(q.dequeue()).toBe(3);
    expect(q.isEmpty).toBe(true);
  });

  it("copy creates an independent queue", () => {
    const q = new Queue<number>();
    q.enqueueMany([1, 2, 3]);
    const copy = q.copy();
    q.dequeue();
    expect(copy.toArray()).toEqual([1, 2, 3]);
    expect(q.toArray()).toEqual([2, 3]);
  });

  it("iterator yields elements in order", () => {
    const q = new Queue<number>();
    q.enqueueMany([1, 2, 3]);
    expect(Array.from(q)).toEqual([1, 2, 3]);
  });
});
