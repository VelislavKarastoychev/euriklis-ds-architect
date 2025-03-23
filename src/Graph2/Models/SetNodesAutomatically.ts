"use strict";

import type {
  AbstractAttributesType,
  GraphValuesDomain,
  Integer,
  NodeType,
} from "../../../Types";
import { GraphDataNode } from "../../DataNode";

export const SetNodesAutomatically = (
  G: Map<string, GraphDataNode>,
  nodes?: (string | NodeType)[],
  count?: Integer,
): void => {
  if (nodes) {
    for (const node of nodes) {
      let name: string,
        attributes:
          | AbstractAttributesType & { value: GraphValuesDomain }
          | undefined;
      if (typeof node !== "string") {
        name = node.name;
        attributes = node.attributes;
      } else {
        name = node;
      }
      G.set(name, new GraphDataNode({ id: name, attributes }));
    }
  } else {
    if (count) {
      let name: string, i: Integer;
      for (i = count; i-- > 1;) {
        name = `v${i--}`;
        G.set(name, new GraphDataNode(name));
        name = `v${i}`;
        G.set(name, new GraphDataNode(name));
      }

      if (i === 0) {
        name = `v0`;
        G.set(name, new GraphDataNode(name))
      }
    }
  }
};
