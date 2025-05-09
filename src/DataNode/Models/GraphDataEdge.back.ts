"use strict";

import { DataNode } from "./DataNode";
import {
  DirectedGraphDataNode,
  UndirectedGraphDataNode,
} from "./GraphDataNode";

export class GraphDataEdge<
  INData = unknown,
  NData = unknown,
  EData = unknown,
> extends DataNode<EData> {
  protected _link?:
    | DirectedGraphDataNode<NData, INData, EData>
    | UndirectedGraphDataNode<NData, INData, EData>;
  protected __weight__: number = 1;
  constructor({
    link,
    data,
    weight = 1,
  }: {
    link:
      | DirectedGraphDataNode<NData, INData, EData>
      | UndirectedGraphDataNode<NData, INData, EData>;
    data: EData;
    weight: number;
  }) {
    super(data);
    this.link = link;
    this.__weight__ = weight;
  }

  get link():
    | DirectedGraphDataNode<NData, INData, EData>
    | UndirectedGraphDataNode<NData, INData, EData>
    | undefined {
    return this._link;
  }

  set link(
    link:
      | DirectedGraphDataNode<NData, INData, EData>
      | UndirectedGraphDataNode<NData, INData, EData>,
  ) {
    this._link = link;
  }

  get data(): EData | null {
    return this._data;
  }

  set data(d: EData) {
    this._data = d;
  }

  get weight(): number {
    return this.__weight__;
  }

  set wight(w: number) {
    this.__weight__ = w;
  }
}
