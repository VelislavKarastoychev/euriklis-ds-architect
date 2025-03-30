"use strict";
import { v4 as uuid } from "uuid";
import { BST, AVLTree, DoublyLinkedList, Queue } from "./src";

const avl = new AVLTree<{
  name: string;
  family: string;
  id?: string | number;
}>();

const isEmpty = avl.isEmpty;

console.log(isEmpty);

avl.insert({ name: "Nevena", family: "Coneva", id: "Nevena Coneva" });
avl.insert({
  name: "Vanya",
  family: "Karastoycheva",
  id: "Vanya Karastoycheva",
});

avl.insertMany([
  { name: "Strahil", family: "Penkov", id: "Strahil Penkov" },
  { name: "Chocho", family: "Popyordanov", id: "Chocho Popyordanov" },
  { name: "Chochka", family: "Popyordanova", id: "Chochhka Popyordanova" },
  { name: "Velislav", family: "Karastoychev", id: "Velislav Karastoychev" },
  { name: "Albena", family: "Kyurtekova", id: "Albena Kyurtekova" },
  { name: "Bojidar", family: "Stoev", id: "Bojidar Stoev" },
]);
for (let i: number = 0; i < 20; i++) {
  avl.insert({ name: uuid(), family: uuid(), id: uuid() });
}

const dll = new DoublyLinkedList<{ name: string; family: string }>();

const isDLLEmpty = dll.isEmpty;
console.log(isDLLEmpty);
dll.addLast({ name: "Gyuro", family: "Mihailov" }, "GM");
dll.insertAfter("GM", { name: "Velislav", family: "Karastoychev" });
const isVeliHere = dll.any((n) => n.name === "Velislav");
const isMilkoHere = dll.any((n) => n.name === "Mihail");
console.log(isVeliHere);
console.log(isMilkoHere);
