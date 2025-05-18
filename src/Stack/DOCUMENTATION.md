# DynamicStack<T>

This class is a LIFO structure implemented with the dynamic stack approach.

## Importing:

```ts
import { DynamicStack } from "@euriklis/ds-architect";
```

## Usage:

```ts
const stack = new DynamicStack<number>();
stack.push(10).push(20).pushMany([30, 40, 50]);

console.log(stack.size); // 5
console.log(stack.top); // 50
console.log([...stack]); // [50, 40, 30, 20, 10]

const popped = stack.popMany(2);
console.log(popped); // [50, 40]
console.log(stack.size); // 3
```

## API Reference:

| Member                                                                      | Description                                                                                      |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `new DynamicStack<T>(initial?: T)`                                          | Create a new stack, optionally seeded with one element.                                          |
| `get size(): number`                                                        | Number of elements currently in the stack.                                                       |
| `get limit(): number`                                                       | Maximum allowed size (defaults to `Infinity`).                                                   |
| `get isEmpty(): boolean`                                                    | Returns `true` if the stack is empty (i.e. `size === 0`).                                        |
| `get top(): T \| null`                                                      | Peek at the top element without removing it; `null` if empty.                                    |
| `push(data?: T): this`                                                      | Push a single element; ignores `undefined`; throws a `StackOverflow` error if over the `limit`.  |
| `pushMany(items: T[]): this`                                                | Push multiple elements in array order.                                                           |
| `pop(): T \| null`                                                          | Remove and return the top element; returns `null` if the stack is empty.                         |
| `popMany(n: number): T[]`                                                   | Pop up to `n` elements and return them in removal order.                                         |
| `get list(): T[]`                                                           | Pop **all** elements and return them as an array (empties the stack).                            |
| `traverse(fn: (el: T, stack: DynamicStack<T>) => void): this`               | Call `fn` on each element (from top to bottom) without removing them.                            |
| `popAndTraverse(fn: (el: T, stack: DynamicStack<T>) => void): T[]`          | Repeatedly `pop()`, call `fn`, and collect the popped values into an array.                      |
| `loop(fn: (el: T, stack: DynamicStack<T>) => boolean, max?: number): this`  | Iterate (top→bottom), calling `fn`; continue while it returns `true` and under `max` iterations. |
| `filter(fn: (el: T, stack: DynamicStack<T>) => boolean): DynamicStack<T>`   | Return a **new** stack containing only elements for which `fn` returns `true`.                   |
| `clear(): this`                                                             | Remove all elements, resetting the stack to empty.                                               |
| `copy(): DynamicStack<T>`                                                   | Return a shallow copy of the stack (same order, brand new nodes).                                |
| `append(fn: (i: number, stack: DynamicStack<T>) => T, count: number): this` | Generate and push `count` new elements by calling `fn(index, stack)` for each index `0…count-1`. |
| `[Symbol.iterator](): Iterator<T>`                                          | Iterate from top→bottom using `for (const v of stack) { … }`.                                    |

# StaticStack

A `StaticStack` is a Last-In, First-Out (LIFO) collection implemented using a fixed-size TypeScript array. Elements are stored in a native array where the top of the stack corresponds to the highest index. While highly efficient for small, predictable workloads, a StaticStack does not resize dynamically.

## Importing:

```ts
import { StaticStack } from "@euriklis/ds-architect";
```

## Usage:

const stack = new StaticStack<number>();
stack.push(10);
stack.pushMany([20, 30, 40]);

console.log(stack.size); // 4
console.log(stack.top); // 40

const popped = stack.pop(); // 40
console.log(popped); // 40
console.log(stack.size); // 3

API Reference

| Method                            | Description                                                              |
| --------------------------------- | ------------------------------------------------------------------------ |
| `new StaticStack<T>(initial?: T)` | Create a new stack, optionally seeded with initial element.              |
| `get size(): number`              | Number of elements currently in the stack.                               |
| `get isEmpty(): boolean`          | true if the stack is empty (size === 0), otherwise false.                |
| `get top(): T`                    | Peek at the top element without removing it.                             |
| `push(d: T): this`                | Pushes a single element onto the stack.                                  |
| `pushMany(data: T[]): this`       | Pushes multiple elements in array order. Throws if data is not an array. |

|`pop(): T \| null`|Pop and return the top element; returns null if the stack is empty.|
|`popMany(n: number): T[]`|Pop up to n elements and return them in removal order.|
|`traverse(fn: (el: T, stack: StaticStack<T>) => void): this`|Execute fn on each element (top → bottom) without removing elements.|
|`popAndTraverse(fn: (el: T, stack: StaticStack<T>) => void): T[]`|Pop each element, call fn, collect and return popped elements.|
|`filter(fn: (el: T, stack: StaticStack<T>) => boolean): StaticStack<T>`|Returns a new StaticStack containing only elements for which fn returns true.|
|`get list(): T[]`|Remove all elements and return them as an array (stack is emptied).|
|`loop(fn: (el: T, stack: StaticStack<T>) => boolean, iterations: number): this`|Walk up to iterations elements, calling fn; continue while fn returns true.|
|`copy(): StaticStack<T>`|Return a shallow copy of the stack (same order, new underlying array).|
|`append(fn: (index: number, stack: StaticStack<T>) => T, size: number): this`|Generate and push size elements using fn(index, stack).|
|`clear(): this`|Remove all elements, resetting the stack to an empty state.|
