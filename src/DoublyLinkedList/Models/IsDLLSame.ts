"use strict";
import { IsSame } from "../../../utils";
import type { LinkedDataNode } from "../../DataNode";

const DLLSame = (
  n1: LinkedDataNode | null,
  n2: LinkedDataNode | null,
  properties: ["data", "id"] | ["data"] = ["data"],
): boolean => {
  if (n1 && n2) {
    if (
      properties.every((prop) =>
        IsSame((n1 as LinkedDataNode)[prop], (n2 as LinkedDataNode)[prop])
      )
    ) {
      n1 = n1.next;
      n2 = n2.next;
      return DLLSame(n1, n2, properties);
    }

    return false;
  }

  return true;
};

export const IsDLLSame = (
  n1: LinkedDataNode | null,
  n2: LinkedDataNode | null,
): boolean => DLLSame(n1, n2);

export const IsDLLExactlySame = (
  n1: LinkedDataNode | null,
  n2: LinkedDataNode | null,
): boolean => DLLSame(n1, n2, ["data", "id"]);
