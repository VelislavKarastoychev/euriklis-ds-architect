"use strict";
import type { DynamicStack } from "../../Stack";
import type { BSTDataNode } from "../../DataNode";
import { IsSame } from "../../utils";
const NodeSimilarity = <AbstractBSTDataNode extends BSTDataNode>(
  S1: DynamicStack<AbstractBSTDataNode | null>,
  S2: DynamicStack<AbstractBSTDataNode | null>,
  properties: ["data", "id"] | ["data"] = ["data"],
): boolean => {
  let t1: AbstractBSTDataNode, t2: AbstractBSTDataNode;
  if (!S1.isEmpty && !S2.isEmpty) {
    t1 = S1.pop() as AbstractBSTDataNode;
    t2 = S2.pop() as AbstractBSTDataNode;
    const same: boolean = properties.every((prop) =>
      IsSame(t1[prop], t2[prop]),
    );
    if (!same) return false;
    if (t1.left) S1.push(t1.left as AbstractBSTDataNode);
    if (t1.right) S1.push(t1.right as AbstractBSTDataNode);
    if (t2.left) S2.push(t2.left as AbstractBSTDataNode);
    if (t2.right) S2.push(t2.right as AbstractBSTDataNode);
    return IsNodeExactlySame(S1, S2);
  } else if (!S1.isEmpty || !S2.isEmpty) return false;
  return true;
};

export const IsNodeExactlySame = <AbstractBSTDataNode extends BSTDataNode>(
  S1: DynamicStack<AbstractBSTDataNode | null>,
  S2: DynamicStack<AbstractBSTDataNode | null>,
): boolean => NodeSimilarity(S1, S2, ["data", "id"]);

export const IsNodeSame = <AbstractBSTDataNode extends BSTDataNode>(
  S1: DynamicStack<AbstractBSTDataNode | null>,
  S2: DynamicStack<AbstractBSTDataNode | null>,
): boolean => NodeSimilarity(S1, S2);
