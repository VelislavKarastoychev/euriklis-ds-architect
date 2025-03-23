"use strict";

import type { EdgeType, GraphType } from "../../../Types";
import { IncorrectEdgeDeclaration } from "../../Errors";

/**
 * Sets the edges in the given graph.
 *
 * This utility function adds edges to the graph based on the provided array of `EdgeType`
 * objects. It updates the `outputs` map of the source node and the `inputs` map of the target
 * node for each edge. If either the source or target node does not exist in the graph, an
 * error is thrown.
 *
 * @param {GraphType} G - The graph to which the edges will be added. It is expected to be a
 *    `Map` where each key is a node identifier and the value is an object representing the
 *    node with its inputs and outputs.
 * @param {EdgeType[]} edges - An array of `EdgeType` objects representing the edges to be
 *    added. Each object contains `source`, `target`, and `attributes`.
 *
 * @throws {Error} Throws an error if either the source or target node is not present in the graph.
 * @returns {void}
 */
export const SetGraphEdges = (G: GraphType, edges: EdgeType[]): void => {
  for (const { source, target, attributes } of edges) {
    const sourceNode = G.get(source);
    const targetNode = G.get(target);
    if (!sourceNode || !targetNode) {
      IncorrectEdgeDeclaration("setter edges");
    }
    sourceNode?.outputs.set(target, { id: target, attributes });
    targetNode?.inputs.set(source, { id: source, attributes });
  }
};
