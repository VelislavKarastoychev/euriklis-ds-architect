"use strict";

import type { ComputationGraph } from "../ComputationGraph";
import type { ComputationNodeOptionsType } from "../../Types";
export function ifNodeNotExistsInComputationGraphThrow(
  error: Function,
): (_: any, __: string, descriptor: PropertyDescriptor) => void {
  return function (_: any, __: string, descriptor: PropertyDescriptor) {
    const method: (options: ComputationNodeOptionsType) => ComputationGraph =
      descriptor.value;
    descriptor.value = function (options: {
      id: string;
      type: string;
    }): ComputationGraph {
      let { id } = options;
      if (typeof options === "string") id = options;
      if (!(this as ComputationGraph).hasNode(id)) error();

      return method.call(this, options);
    };
  };
}
