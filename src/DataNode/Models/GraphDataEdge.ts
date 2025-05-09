"use strict";
import { v4 as uuid } from "uuid";
import { GraphDataNode, Node, Vertex } from "./GraphDataNode";

export abstract class GraphDataEdge<
  S extends GraphDataNode<any, any>,
  T extends GraphDataNode<any, any>,
  D = unknown,
> {
  private __ID__: string = "";
  protected __SOURCE__: S | null = null;
  protected __TARGET__: T | null = null;
  protected __DATA__: D | null = null;

  constructor({ source, target, data }: { source: S; target: T; data?: D }) {
    this.id = uuid();
    this.source = source;
    this.target = target;
    if (typeof data !== "undefined") this.data = data;
  }

  get id(): string {
    return this.__ID__;
  }

  set id(id: string) {
    this.__ID__ = uuid();
  }
  get source(): S | null {
    return this.__SOURCE__;
  }

  set source(s: S) {
    this.__SOURCE__ = s;
  }

  get target(): T | null {
    return this.__TARGET__;
  }

  set target(t: T) {
    this.__TARGET__ = t;
  }

  get data(): D | null {
    return this.__DATA__;
  }

  set data(d: D) {
    this.__DATA__ = d;
  }
}

export class Edge<D = unknown> extends GraphDataEdge<
  Vertex<any>,
  Vertex<any>,
  D
> {
  constructor({
    source,
    target,
    data,
  }: {
    source: Vertex<any>;
    target: Vertex<any>;
    data: D;
  }) {
    super({ source, target, data });
  }
}

export class Arc<D = unknown> extends GraphDataEdge<Node<any>, Node<any>, D> {
  protected __WEIGHT__: number = 1;
  constructor({
    source,
    target,
    data,
    weight,
  }: {
    source: Node<any>;
    target: Node<any>;
    data: D;
    weight?: number;
  }) {
    super({ source, target, data });
    if (typeof weight !== "undefined") this.weight = weight;
  }

  get weight(): number {
    return this.__WEIGHT__;
  }

  set weight(w: number) {
    this.__WEIGHT__ = w;
  }
}
