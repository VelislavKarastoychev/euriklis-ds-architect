"use strict";

export const NodeAlreadyExistsTxt = (name: string): string =>
  `Node ${name} already exists in the Graph.`;
export const NodeNotExistsTxt = (name: string): string =>
  `Node ${name} does not exist in the graph.`;
