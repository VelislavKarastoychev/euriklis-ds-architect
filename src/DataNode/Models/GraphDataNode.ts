"use strict";

import * as errors from "../Errors";
import { DataNode } from "./DataNode";
import { GraphDataEdge } from "./GraphDataEdge";

class BaseGraphDataNode<NData = unknown> extends DataNode<NData> {
  protected __name__: string = "";
  protected __value__?: number = 1;

  constructor(options: { name: string; data: NData; value?: number }) {
    super(options.data);
    this.name = options.name;
    this.value = options.value;
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

  get value(): number | undefined {
    return this.__value__;
  }

  set value(v: number | undefined) {
    if (typeof v !== "undefined" || v !== null) this.__value__ = v;
  }
}

export class DirectedGraphDataNode<
  NData = unknown,
  EData = unknown,
> extends BaseGraphDataNode<NData> {
  protected __inEdges__: Map<string, GraphDataEdge<NData, EData>> = new Map();
  protected __outEdges__: Map<string, GraphDataEdge<NData, EData>> = new Map();

  constructor(options: { name: string; data: NData; value: number }) {
    super(options);
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

  public async addIncommingEdge({
    source,
    data,
    weight = 1,
  }: {
    source: DirectedGraphDataNode<NData, EData>;
    data: EData;
    weight?: number;
  }): Promise<DirectedGraphDataNode<NData, EData>> {
    // check if the node already exists:
    if (this.__inEdges__.has(source.name))
      errors.EdgeAlreadyExists(source.name);
    const edge = new GraphDataEdge({ link: source, data, weight });
    this.__inEdges__.set(source.name, edge);

    return this;
  }

  public async addOutgoingEdge({
    target,
    data,
    weight,
  }: {
    target: DirectedGraphDataNode<NData, EData>;
    data: EData;
    weight: number;
  }): Promise<DirectedGraphDataNode<NData, EData>> {
    if (this.__outEdges__.has(target.name))
      errors.EdgeAlreadyExists(target.name);
    const edge = new GraphDataEdge({ link: target, data, weight });
    this.__outEdges__.set(target.name, edge);

    return this;
  }

  public async findIncomingEdgeByName(
    name: string,
  ): Promise<GraphDataEdge<NData, EData> | null> {
    return this.__inEdges__.get(name) || null;
  }

  public async findOutgoingEdgeByName(
    name: string,
  ): Promise<GraphDataEdge<NData, EData> | null> {
    return this.__outEdges__.get(name) || null;
  }

  public async removeIncommingEdge(
    source: DirectedGraphDataNode<NData, EData>,
  ): Promise<GraphDataEdge<NData, EData> | undefined> {
    const edge = this.__inEdges__.get(source.name);
    this.__inEdges__.delete(source.name);

    return edge;
  }
}

export class UndirectedGraphDataNode<
  NData,
  EData,
> extends BaseGraphDataNode<NData> {
  private __edges__: Map<string, GraphDataEdge<NData, EData>> = new Map();
  constructor(options: { name: string; data: NData; value?: number }) {
    super(options);
  }

  get edges(): Map<string, GraphDataEdge<NData, EData>> {
    return this.__edges__;
  }

  set edges(edges: Map<string, GraphDataEdge<NData, EData>>) {
    this.__edges__ = edges;
  }

  public async addEdge({
    target,
    data,
    weight,
  }: {
    target: UndirectedGraphDataNode<NData, EData>;
    data: EData;
    weight?: number;
  }): Promise<UndirectedGraphDataNode<NData, EData>> {
    if (this.__edges__.has(target.name)) {
      errors.EdgeAlreadyExists(target.name);
    }

    this.__edges__.set(
      target.name,
      new GraphDataEdge({ link: target, data, weight }),
    );

    target.__edges__.set(
      this.name,
      new GraphDataEdge({ link: this, data, weight }),
    );

    return this;
  }

  public async findEdge(
    target: string,
  ): Promise<GraphDataEdge<NData, EData> | null> {
    return this.__edges__.get(target) || null;
  }

  public async removeEdge(
    target: UndirectedGraphDataNode<NData, EData>,
  ): Promise<GraphDataEdge<NData, EData> | undefined> {
    const edge = this.__edges__.get(target.name);
    this.__edges__.delete(target.name);
    target.__edges__.delete(this.name);

    return edge;
  }
}
