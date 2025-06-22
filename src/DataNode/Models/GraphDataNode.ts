"use strict";

import * as errors from "../Errors";
import { v4 as uuid } from "uuid";
import { GraphDataEdge, Edge, Arc } from "./GraphDataEdge";

/**
 * Base class for all graph-related nodes. Holds incoming and outgoing
 * edges as well as basic metadata like name and data payload.
 */
export abstract class GraphDataNode<
  O = unknown,
  E extends GraphDataEdge<
    GraphDataNode<any, E>,
    GraphDataNode<any, E>,
    unknown
  > = GraphDataEdge<GraphDataNode<any, any>, GraphDataNode<any, any>, unknown>,
> {
  private __ID__: string = "";
  protected __NAME__: string = "";
  protected __DATA__: O | null = null;
  protected __IN__: Map<string, E> = new Map();
  protected __OUT__: Map<string, E> = new Map();
  constructor({ name, data }: { name: string; data: O }) {
    if (!name) errors.NameIsRequired();
    this.id = uuid();
    this.name = name;
    if (typeof data !== "undefined") this.data = data;
  }

  get id(): string {
    return this.__ID__;
  }

  set id(id: string) {
    this.__ID__ = id;
  }

  get name(): string {
    return this.__NAME__;
  }

  set name(name: string) {
    this.__NAME__ = name;
  }

  get data(): O | null {
    return this.__DATA__;
  }

  set data(d: O) {
    this.__DATA__ = d;
  }

  get incomming(): Map<string, E> {
    return this.__IN__;
  }

  get outgoing(): Map<string, E> {
    return this.__OUT__;
  }

  /** Override this to construct your concrete edge subclass */
  protected abstract createEdge<D = unknown>(
    target: GraphDataNode<any, E>,
    data?: D,
    params?: { [param: string]: any },
  ): E;

  connect<D = unknown>({
    node,
    data,
    params,
  }: {
    node: GraphDataNode<any, E>;
    data: D;
    params: { [param: string]: any };
  }): this {
    if (this.outgoing.has(node.name)) errors.EdgeAlreadyExists(node.name);
    const e = this.createEdge(node, data, params);
    this.outgoing.set(node.name, e);
    node.incomming.set(this.name, e);

    return this;
  }

  findConnections(callback: (edge: E) => boolean): Map<string, E> {
    const edges: Map<string, E> = new Map();
    this.outgoing.forEach((edge, name) =>
      callback(edge) ? edges.set(name, edge) : null,
    );

    return edges;
  }

  getConnection(target: string | GraphDataNode): E | undefined {
    let targetName: string = "";
    if (typeof target === "string") targetName = target;
    else targetName = target.name;

    return this.outgoing.get(targetName);
  }

  removeConnection({
    node,
    nodeName,
  }: {
    nodeName?: string;
    node?: GraphDataNode<any, E>;
  }): E | undefined {
    let e: E | undefined;
    if (!nodeName && !node) {
      errors.NameIsRequired();
    }
    if (node) {
      e = this.outgoing.get(node.name);
      this.outgoing.delete(node.name);
      node.incomming.delete(this.name);
    } else {
      const e = this.outgoing.get(nodeName as string);
      if (e) {
        this.outgoing.delete(nodeName as string);
        (e.target as GraphDataNode<any, E>).incomming.delete(this.name);
      }
    }

    return e;
  }

  get inDegree(): number {
    return this.incomming.size;
  }

  get outDegree(): number {
    return this.outgoing.size;
  }
}

/**
 * Basic graph vertex implementation holding outgoing and incoming edges.
 */
export class Vertex<D = unknown> extends GraphDataNode<D, Edge<any>> {
  protected createEdge<T = unknown>(target: Vertex<any>, data: T): Edge<T> {
    return new Edge({ source: this, target, data });
  }
}

/**
 * Vertex variant storing a numeric value used by weighted graphs.
 */
export class Node<D = unknown> extends GraphDataNode<D, Arc<any>> {
  protected __VALUE__: number = 1;

  constructor({ name, data, value }: { name: string; data: D; value: number }) {
    super({ name, data });
    if (typeof value !== "undefined") this.value = value;
  }

  get value(): number {
    return this.__VALUE__;
  }

  set value(v: number) {
    this.__VALUE__ = v;
  }
  protected override createEdge<T = unknown>(
    target: Node<any>,
    data: T,
    { weight }: { weight: number },
  ): Arc<T> {
    return new Arc({ source: this, target, data, weight });
  }

  weightedInDegree(): number {
    let inDegree: number = 0;
    this.incomming.forEach((arc) => (inDegree += arc.weight));

    return inDegree;
  }

  weightedOutDegree(): number {
    let outDegree: number = 0;
    this.outgoing.forEach((arc) => (outDegree += arc.weight));

    return outDegree;
  }
}
