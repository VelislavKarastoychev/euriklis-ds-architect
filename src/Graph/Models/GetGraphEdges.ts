"use strict";

import type { EdgeType, GraphType } from "../../../Types";

/**
 * Retrieves all edges from the given graph.
 *
 * This utility function iterates through the nodes of the graph and collects all the edges
 * from each node's outputs. It constructs an array of `EdgeType` objects, each containing
 * the source node, target node, and edge attributes.
 *
 * @param {GraphType} G - The graph from which to retrieve the edges. It is expected to be a
 *    `Map` where each key is a node identifier and the value is an object representing the
 *    node with its outputs.
 *
 * @returns {EdgeType[]} An array of `EdgeType` objects, where each object represents an edge
 *    with `source`, `target`, and `attributes`.
 */
export const GetGraphEdges = (G: GraphType): EdgeType[] => {
  const edges: EdgeType[] = [];
  for (const [source, node] of G) {
    const { outputs } = node;
    if (!outputs.size) continue;
    for (const [target, edge] of outputs) {
      const { attributes } = edge;
      edges.push({ source, target, attributes });
    }
  }

  return edges;
};
