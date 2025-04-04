"use strict";

import { AVLTree } from "./src";

const avl = new AVLTree<{ name: string; description: string }>();

avl.insert({
  name: "Union",
  description: "A transport company.",
});
avl.insert({ name: "Arda Tour", description: "A bus company." });

avl.print(undefined, undefined, undefined, (node) => node.data?.description);
