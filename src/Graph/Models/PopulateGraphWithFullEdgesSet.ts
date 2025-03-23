"use strict";

import type { GraphType } from "../../../Types";

/**
 * Generates a fully connected edge set for the given graph, including loops.
 *
 * This utility function adds edges between every pair of nodes in the graph, including self-loops.
 * Each edge is assigned a weight of 1. This operation updates the `outputs` and `inputs` maps for each node
 * to reflect a complete graph.
 *
 * @param {GraphType} G - The graph to which the fully connected edges are to be added.
 */
export const PopulateGraphWithFullEdgesSet = (G: GraphType): void => {
  for (const [s, u] of G) {
    for (const [t, v] of G) {
      u.outputs.set(t, { id: t, attributes: { weight: 1 } });
      v.inputs.set(s, { id: s, attributes: { weight: 1 } });
    }
  }
};
