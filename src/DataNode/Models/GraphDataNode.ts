"use strict";

import type { GraphEdgeType } from "../../Graph/Types";
import * as errors from "../Errors";
import { DataNode } from "./DataNode";
import { GraphDataEdge } from "./GraphDataEdge";

export class BaseGraphDataNode<
  NData = unknown,
  EData = unknown,
> extends DataNode<NData> {
  protected __name__: string = "";
  protected __value__: number = 1;

  constructor({
    name,
    data,
    value = 1,
  }: {
    name: string;
    data: NData;
    value: number;
  }) {
    super(data);
    this.name = name;
    this.value = value;
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
> extends BaseGraphDataNode<NData, EData> {
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

  public addIncommingEdge({
    source,
    data,
    weight = 1,
  }: {
    source: DirectedGraphDataNode<NData, EData>;
    data: EData;
    weight: number;
  }): DirectedGraphDataNode<NData, EData> {
    // check if the node already exists:
    if (this.__inEdges__.has(source.name))
      errors.EdgeAlreadyExists(source.name);
    const edge = new GraphDataEdge({ link: source, data, weight });
    this.__inEdges__.set(source.name, edge);
    source.__outEdges__.set(this.name, edge);

    return this;
  }

  public addOutgoingEdge({
    target,
    data,
    weight = 1,
  }: {
    target: DirectedGraphDataNode<NData, EData>;
    data: EData;
    weight: number;
  }): DirectedGraphDataNode<NData, EData> {
    if (this.__outEdges__.has(target.name))
      errors.EdgeAlreadyExists(target.name);
    const edge = new GraphDataEdge({ link: target, data, weight });
    this.__outEdges__.set(target.name, edge);
    target.__inEdges__.set(this.name, edge);

    return this;
  }

  public getIncomingEdgeByName(
    name: string,
  ): GraphDataEdge<NData, EData> | undefined {
    return this.__inEdges__.get(name);
  }

  public getOutgoingEdgeByName(
    name: string,
  ): GraphDataEdge<NData, EData> | undefined {
    return this.__outEdges__.get(name);
  }

  public removeIncommingEdge(
    source: DirectedGraphDataNode<NData, EData>,
  ): GraphDataEdge<NData, EData> | undefined {
    const edge = this.__inEdges__.get(source.name);
    this.__inEdges__.delete(source.name);
    source.__outEdges__.delete(this.name);

    return edge;
  }

  public removeOutgoingEdge(
    target: DirectedGraphDataNode<NData, EData>,
  ): GraphDataEdge<NData, EData> | undefined {
    const edge = this.__outEdges__.get(target.name);
    this.__outEdges__.delete(target.name);
    target.__inEdges__.delete(this.name);

    return edge;
  }

  clearEdges(): this {
    this.__inEdges__ = new Map();
    this.__outEdges__ = new Map();

    return this;
  }

  getIncommingEdges(): GraphEdgeType<EData>[] {
    const edges: GraphEdgeType<EData>[] = [];
    for (const [_, edge] of this.__inEdges__) {
      const source = ((edge as GraphDataEdge).link as DirectedGraphDataNode)
        .name;
      edges.push({
        source,
        target: this.name,
        data: edge.data,
        weight: edge.weight,
      });
    }

    return edges;
  }

  getOutgoingEdges(): GraphEdgeType<EData>[] {
    const edges: GraphEdgeType<EData>[] = [];
    for (const [_, edge] of this.__outEdges__) {
      const source = ((edge as GraphDataEdge).link as DirectedGraphDataNode)
        .name;
      edges.push({
        source,
        target: this.name,
        data: edge.data,
        weight: edge.weight,
      });
    }

    return edges;
  }
}

export class UndirectedGraphDataNode<NData, EData> extends BaseGraphDataNode<
  NData,
  EData
> {
  private __edges__: Map<string, GraphDataEdge<NData, EData>> = new Map();
  constructor(options: { name: string; data: NData; value: number }) {
    super(options);
  }

  get edges(): Map<string, GraphDataEdge<NData, EData>> {
    return this.__edges__;
  }

  set edges(edges: Map<string, GraphDataEdge<NData, EData>>) {
    this.__edges__ = edges;
  }

  public addEdge({
    target,
    data,
    weight = 1,
  }: {
    target: UndirectedGraphDataNode<NData, EData>;
    data: EData;
    weight: number;
  }): UndirectedGraphDataNode<NData, EData> {
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

  public getEdge(target: string): GraphDataEdge<NData, EData> | undefined {
    return this.__edges__.get(target) || undefined;
  }

  public removeEdge(
    target: UndirectedGraphDataNode<NData, EData>,
  ): GraphDataEdge<NData, EData> | undefined {
    const edge = this.__edges__.get(target.name);
    this.__edges__.delete(target.name);
    target.__edges__.delete(this.name);

    return edge;
  }

  clearEdges(): this {
    this.__edges__ = new Map();

    return this;
  }
}
