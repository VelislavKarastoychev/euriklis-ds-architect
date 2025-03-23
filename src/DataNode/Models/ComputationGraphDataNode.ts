"use strict";

import { GraphDataElement } from "./GraphDataElement";
import type {
  AbstractAttributesType,
  ComputationNodeOptionsType,
  GraphValuesDomain,
  ComputationGraphGradientType,
  GradientCallbackType,
} from "../../../Types";

export class ComputationGraphDataNode extends GraphDataElement {
  protected _inputs: Map<string, ComputationGraphDataNode> = new Map();
  protected _outputs: Map<string, ComputationGraphDataNode> = new Map();

  constructor(options: ComputationNodeOptionsType) {
    const { id, ...attributes } = options;
    super({ id, attributes });
  }

  get value(): GraphValuesDomain | null {
    return this._data.value;
  }

  set value(v: GraphValuesDomain) {
    this._data.value = v;
  }

  get f(): (args: AbstractAttributesType) => GraphValuesDomain {
    return this._data.f;
  }

  set f(callback: (args: AbstractAttributesType) => GraphValuesDomain) {
    this._data.f = callback;
  }

  get gradient(): GradientCallbackType {
    return this._data.gradient;
  }

  set gradient(g: GradientCallbackType) {
    this._data.gradient = g;
  }

  get type(): "constant" | "variable" | "operation" {
    return this._data.type;
  }

  set type(t: string) {
    this._data.type = t;
  }

  get inputs(): Map<string, ComputationGraphDataNode> {
    return this._inputs;
  }

  get outputs(): Map<string, ComputationGraphDataNode> {
    return this._outputs;
  }

  get g(): ComputationGraphGradientType | null {
    return this._data._g;
  }

  set g(grad: ComputationGraphGradientType) {
    this._data._g = grad;
  }

  get gm1(): ComputationGraphGradientType | null {
    return this._data._gm1;
  }

  set gm1(grad: ComputationGraphGradientType) {
    this._data._gm1 = grad;
  }

  get init(): (params: AbstractAttributesType) => GraphValuesDomain | void {
    return this._data.init;
  }

  set init(
    callback: (params: AbstractAttributesType) => GraphValuesDomain | void,
  ) {
    if (this.type === "variable") this._data.init = callback;
  }

  get params(): AbstractAttributesType {
    return this._data.params;
  }

  set params(params: AbstractAttributesType) {
    this._data.params = params;
  }

  get name(): string {
    return this._data.name || this._id;
  }

  set name(name: string) {
    this._data.name = name;
  }
}
