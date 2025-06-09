import { describe, it, expect } from "bun:test";
import { DynamicStack, StaticStack } from "../src";

describe("DynamicStack", () => {
  it("push and pop work correctly", () => {
    const s = new DynamicStack<number>();
    s.push(1).push(2).push(3);
    expect(s.size).toBe(3);
    expect(s.pop()).toBe(3);
    expect(s.pop()).toBe(2);
    expect(s.pop()).toBe(1);
    expect(s.isEmpty).toBe(true);
  });

  it("filter and copy behave independently", () => {
    const s = new DynamicStack<number>();
    s.pushMany([1, 2, 3, 4]);
    const even = s.filter((v) => v % 2 === 0);
    const copy = s.copy();
    s.pop();
    expect(Array.from(even)).toEqual([4, 2]);
    expect(Array.from(copy)).toEqual([4, 3, 2, 1]);
  });
});

describe("StaticStack", () => {
  it("push and pop work correctly", () => {
    const s = new StaticStack<number>();
    s.push(1).push(2).push(3);
    expect(s.size).toBe(3);
    expect(s.pop()).toBe(3);
    expect(s.pop()).toBe(2);
    expect(s.pop()).toBe(1);
    expect(s.isEmpty).toBe(true);
  });

  it("filter and copy behave independently", () => {
    const s = new StaticStack<number>();
    s.pushMany([1, 2, 3, 4]);
    const even = s.filter((v) => v % 2 === 0);
    const copy = s.copy();
    s.pop();
    expect(Array.from(even)).toEqual([4, 2]);
    expect(Array.from(copy)).toEqual([4, 3, 2, 1]);
  });
});
