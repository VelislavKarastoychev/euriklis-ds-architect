import { describe, it, expect } from "bun:test";
import { DoublyLinkedList } from "../src";

describe("DoublyLinkedList", () => {
  it("supports basic add and remove operations", () => {
    const list = new DoublyLinkedList<number>();
    list.addLast(1, "a").addLast(2, "b").addLast(3, "c");
    expect(list.length).toBe(3);
    expect(list.head).toBe(1);
    expect(list.top).toBe(3);
    expect(list.removeFirst()).toBe(1);
    expect(list.removeLast()).toBe(3);
    expect(list.length).toBe(1);
    expect(list.top).toBe(2);
  });

  it("insertBefore and insertAfter work", () => {
    const list = new DoublyLinkedList<number>();
    list.addLast(1, "a").addLast(3, "c");
    list.insertAfter("a", 2, "b");
    list.insertBefore("c", 4, "d");
    const vals: number[] = [];
    list.traverse((d) => vals.push(d));
    expect(vals).toEqual([1, 2, 4, 3]);
  });

  it("copy creates identical list", () => {
    const list = new DoublyLinkedList<number>();
    list.addLast(1).addLast(2).addLast(3);
    const copy = list.copy();
    list.removeLast();
    expect(Array.from(copy)).toEqual([1, 2, 3]);
    expect(Array.from(list)).toEqual([1, 2]);
  });
});
