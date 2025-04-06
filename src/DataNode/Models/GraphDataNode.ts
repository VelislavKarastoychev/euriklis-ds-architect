"use strict";

import * as errors from "../Errors";
import { DataNode } from "./DataNode";
import { GraphDataEdge } from "./GraphDataEdge";

class BaseGraphDataNode<
  NData = unknown,
  EData = unknown,
> extends DataNode<NData> {
  protected __name__: string = "";
  protected __value__: number = 1;

  constructor(options: { name: string; data: NData; value: number }) {
    super(options.data);
    this.name = options.name;
  }

  get name(): string {
    return this.__name__;
  }

  set name(name: string) {
    this.__name__ = name;
  }

  get data(): NData | null {
    return this._data;
  }

  set data(d: NData) {
    this._data = d;
  }

  get value(): number {
    return this.__value__;
  }

  set value(v: number) {
    this.__value__ = v;
  }
}

export class DirectedGraphDataNode<
  NData = unknown,
  EData = unknown,
> extends DataNode<NData> {
  protected __name__: string = "";
  protected __value__: number = 1;
  protected __inEdges__: Map<string, GraphDataEdge<NData, EData>> = new Map();
  protected __outEdges__: Map<string, GraphDataEdge<NData, EData>> = new Map();

  constructor(options: { name: string; data: NData; value: number }) {
    super(options.data);
    this.name = options.name;
  }

  get name(): string {
    return this.__name__;
  }

  set name(name: string) {
    this.__name__ = name;
  }

  get data(): NData | null {
    return this._data;
  }

  set data(d: NData) {
    this._data = d;
  }

  get value(): number {
    return this.__value__;
  }

  set value(v: number) {
    this.__value__ = v;
  }

  get inEdges(): Map<string, GraphDataEdge<NData, EData>> {
    return this.__inEdges__;
  }

  set inEdges(inputEdges: Map<string, GraphDataEdge<NData, EData>>) {
    this.__inEdges__ = inputEdges;
  }

  get outEdges(): Map<string, GraphDataEdge<NData, EData>> {
    return this.__outEdges__;
  }

  set outEdges(outputEdges: Map<string, GraphDataEdge<NData, EData>>) {
    this.__outEdges__ = outputEdges;
  }

  addIncommingEdge({
    source,
    data,
    weight = 1,
  }: {
    source: DirectedGraphDataNode<NData, EData>;
    data: EData;
    weight?: number;
  }): DirectedGraphDataNode<NData, EData> {
    // check if the node already exists:
    if (this.__inEdges__.has(source.name))
      errors.EdgeAlreadyExists(source.name);
    const edge = new GraphDataEdge({ link: source, data, weight });
    this.__inEdges__.set(source.name, edge);

    return this;
  }

  addOutgoingEdge({
    target,
    data,
    weight,
  }: {
    target: DirectedGraphDataNode<NData, EData>;
    data: EData;
    weight: number;
  }): DirectedGraphDataNode<NData, EData> {
    if (this.__outEdges__.has(target.name))
      errors.EdgeAlreadyExists(target.name);
    const edge = new GraphDataEdge({ link: target, data, weight });
    this.__outEdges__.set(target.name, edge);

    return this;
  }

  findIncomingEdgeByName(name: string): GraphDataEdge<NData, EData> | null {
    return this.__inEdges__.get(name) || null;
  }

  findOutgoingEdgeByName(name: string): GraphDataEdge<NData, EData> | null {
    return this.__outEdges__.get(name) || null;
  }
}
