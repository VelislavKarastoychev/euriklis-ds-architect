"use strict";
import { BST } from "./src";

const bst = new BST();

bst.insert({ name: "Allah" }, "Allah");
bst.insertMany([{ name: "Aaaakbar" }, { name: "Mohamed" }, { name: "Kerim" }]);

console.log(bst.size, bst.height());
const a = [...bst];

bst.print();

bst.loop((n) => (console.log(`Hello from ${n.data.name}`), true));
