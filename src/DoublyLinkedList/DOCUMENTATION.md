# DoublyLinkedList<T>

A doubly linked list implementation in TypeScript that supports:

- Optional maximum size (overflow protected).

- Two backing “secure stores” for O(1) lookups: either a Map or an AVLTree.

- Full suite of list operations: add/remove at both ends, insert at arbitrary position, remove-by-id.

- Rich traversal methods (traverse, loop, filter, every, any).

- Batch operations: values(), copy(), merge().

- Iterable protocol (for…of).
