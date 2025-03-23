"use strict";
import type { AbstractAttributesType, GraphNodeType, GraphValuesDomain } from "../../Types";
import type { Graph } from "../Graph";

export function ifNodeExistsThrow(
  error: Function,
): (_: any, __: string, descriptor: PropertyDescriptor) => void {
  return function (_: any, __: string, descriptor: PropertyDescriptor) {
    const initialMethod = descriptor.value;
    descriptor.value = function (
      options: {name: string; attributes: AbstractAttributesType & {value: GraphValuesDomain}} | string,
    ) {
      let name: string, attributes: AbstractAttributesType & {value: GraphValuesDomain};
      if (typeof options === "string") {
        name = options;
        attributes = {value: 1};
      } else {
        name = options.name;
        attributes = options.attributes;
      }
      if ((this as Graph).hasNode(name)) error();
      return initialMethod.call(this, {name, attributes});
    };
  };
}
