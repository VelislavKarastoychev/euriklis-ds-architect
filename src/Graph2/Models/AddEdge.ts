"use strict";
import { v4 as uuid } from "uuid";

import { GraphDataEdge, type GraphDataNode } from "../../DataNode";
import type { AbstractAttributesType, GraphValuesDomain } from "../../../Types";

export const AddEdge = <V extends GraphDataNode>(
  source: V,
  target: V,
  attributes?: AbstractAttributesType & { weight: GraphValuesDomain },
) => {
  const id = uuid();
  const edge = new GraphDataEdge({
    id,
    source: source.id,
    target: target.id,
    attributes,
  });
  source.addOutgoingEdge(edge);
  target.addIncomingEdge(edge);
};
