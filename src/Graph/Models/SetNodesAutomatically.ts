"use strict";

import type { GraphType, Integer, NodeType } from "../../../Types";

/**
 * Automatically sets nodes in the given graph.
 *
 * @param {GraphType} G - The graph in which to set the nodes.
 * @param {Integer} count - The number of nodes to generate if no nodes are provided.
 * @param {(string | NodeType)[]} [nodes] - Optional array of nodes or node names to include in the graph.
 * @returns {void}
 */
export const SetNodesAutomatically = (
  G: GraphType,
  count: Integer,
  nodes?: (string | NodeType)[],
): void => {
  if (nodes) {
    for (const node of nodes) {
      if (typeof node === "string") {
        G.set(node as string, {
          id: node,
          attributes: { value: 1 },
          inputs: new Map(),
          outputs: new Map(),
        });
      } else {
        G.set(node.name, {
          id: node.name,
          attributes: node.attributes,
          inputs: new Map(),
          outputs: new Map(),
        });
      }
    }
  } else {
    for (let i = count; i--;) {
      G.set(`v${i}`, {
        id: `v${i}`,
        attributes: { value: 1 },
        inputs: new Map(),
        outputs: new Map(),
      });
    }
  }
};
