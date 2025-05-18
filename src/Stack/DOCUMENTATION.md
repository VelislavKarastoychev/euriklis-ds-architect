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

| Method                        | Type                     | Description                                                  |
| ----------------------------- | ------------------------ | ------------------------------------------------------------ |
| new DynamicStack<T>(initial?) | constructor(initial?: T) | Create an empty stack (or seed it with one initial element). |
